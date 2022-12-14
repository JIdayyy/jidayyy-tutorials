/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useCallback, useEffect, useRef, useState } from "react";

import { COLORS, DEFAULT_THEME, THEME_DATA } from "../constants";
import useOnClickOutside from "../../../hooks/use-onclick-outside";

import { ChevronIcon, CloseIcon } from "./Icons";
import Options from "./Options";
import SearchInput from "./SearchInput";
import SelectProvider from "./SelectProvider";
import Spinner from "./Spinner";
import { GroupOption, Option, Options as ListOption } from "./type";

interface SelectProps {
  options: ListOption;
  value: Option | Option[] | null;
  onChange: (value?: Option | Option[] | null) => void;
  placeholder?: string;
  isMultiple?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  loading?: boolean;
  menuIsOpen?: boolean;
  searchInputPlaceholder?: string;
  noOptionsMessage?: string;
  primaryColor: string;
  formatGroupLabel?: ((data: GroupOption) => JSX.Element) | null;
  formatOptionLabel?: ((data: Option) => JSX.Element) | null;
  classNames?: {
    menuButton?: ({ isDisabled }: { isDisabled: boolean }) => string;
    menu?: string;
    tagItem?: ({ isDisabled }: { isDisabled: boolean }) => string;
    tagItemText?: string;
    tagItemIconContainer?: string;
    tagItemIcon?: string;
    list?: string;
    listGroupLabel?: string;
    listItem?: ({ isSelected }: { isSelected: boolean }) => string;
    listDisabledItem?: string;
    ChevronIcon?: ({ open }: { open: boolean }) => string;
    searchContainer?: string;
    searchBox?: string;
    searchIcon?: string;
    closeIcon?: string;
  };
}

const Select: React.FC<SelectProps> = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Select...",
  searchInputPlaceholder = "Search...",
  isMultiple = false,
  isClearable = false,
  isSearchable = false,
  isDisabled = false,
  loading = false,
  menuIsOpen = false,
  noOptionsMessage = "No options found",
  primaryColor = DEFAULT_THEME,
  formatGroupLabel = null,
  formatOptionLabel = null,
  classNames,
}) => {
  const [open, setOpen] = useState<boolean>(menuIsOpen);
  const [list, setList] = useState<ListOption>(options);
  const [inputValue, setInputValue] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const formatItem = (item: Option) => {
      if ("disabled" in item) return item;
      return {
        ...item,
        disabled: false,
      };
    };

    setList(
      options.map((item) => {
        if ("options" in item) {
          return {
            label: item.label,
            options: item.options.map(formatItem),
          };
        }
        return formatItem(item);
      })
    );
  }, [options]);

  const toggle = useCallback(() => {
    if (!isDisabled) {
      setOpen(!open);
    }
  }, [isDisabled, open]);

  const closeDropDown = useCallback(() => {
    if (open) setOpen(false);
  }, [open]);

  useOnClickOutside(ref, () => {
    closeDropDown();
  });

  const onPressEnterOrSpace = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      if ((e.code === "Enter" || e.code === "Space") && !isDisabled) {
        toggle();
      }
    },
    [isDisabled, toggle]
  );

  const handleValueChange = useCallback(
    (selected: Option) => {
      function update() {
        if (!isMultiple && !Array.isArray(value)) {
          closeDropDown();
          onChange(selected);
        }

        if (isMultiple && (Array.isArray(value) || value === null)) {
          onChange(value === null ? [selected] : [...value, selected]);
        }
      }

      if (selected !== value) {
        update();
      }
    },
    [closeDropDown, isMultiple, onChange, value]
  );

  const clearValue = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  const removeItem = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, item: Option) => {
      if (isMultiple && Array.isArray(value) && value.length) {
        e.stopPropagation();
        const result = value.filter((current) => item.value !== current.value);
        onChange(result.length ? result : null);
      }
    },
    [isMultiple, onChange, value]
  );

  const getSelectClass = useCallback(() => {
    if (COLORS.includes(primaryColor)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    }

    let borderFocus = THEME_DATA.borderFocus[DEFAULT_THEME];
    if (COLORS.includes(primaryColor)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      borderFocus = THEME_DATA.borderFocus[primaryColor];
    }
    const baseClass =
      "flex text-sm  text-gray-500 border-b border-blue-200 rounded shadow-sm transition-all duration-300 focus:outline-none";
    const defaultClass = `${baseClass} ${
      isDisabled
        ? "bg-gray-200"
        : `bg-blue-800 bg-opacity-20  ${borderFocus} outline-none `
    }`;

    return classNames && classNames.menuButton
      ? classNames.menuButton({ isDisabled })
      : defaultClass;
  }, [classNames, isDisabled, primaryColor]);

  const getTagItemClass = useCallback(() => {
    const baseClasse = "bg-gray-200 border rounded-sm flex space-x-1";
    const disabledClass = isDisabled ? "border-gray-500 px-1" : "pl-1";
    return classNames && classNames.tagItem
      ? classNames.tagItem({ isDisabled })
      : `${baseClasse} ${disabledClass}`;
  }, [classNames, isDisabled]);

  return (
    <SelectProvider
      otherData={{
        formatGroupLabel,
        formatOptionLabel,
        classNames,
      }}
      value={value}
      handleValueChange={handleValueChange}
    >
      <div className="relative w-full z-50 " ref={ref}>
        <div
          tabIndex={0}
          aria-expanded={open}
          onKeyDown={onPressEnterOrSpace}
          onClick={toggle}
          className={getSelectClass()}
        >
          <div className="grow pl-2.5 py-2 min-h-10 pr-2 flex flex-wrap gap-1">
            {!isMultiple ? (
              <p className="truncate cursor-default select-none">
                {value && !Array.isArray(value) ? value.label : placeholder}
              </p>
            ) : (
              <>
                {Array.isArray(value) && value.length === 0 && placeholder}

                {Array.isArray(value) &&
                  value.map((item, index) => (
                    <div className={getTagItemClass()} key={index}>
                      <p
                        className={
                          classNames && classNames.tagItemText
                            ? classNames.tagItemText
                            : "text-white truncate cursor-default select-none"
                        }
                      >
                        {item.label}
                      </p>
                      {!isDisabled && (
                        <div
                          onClick={(e) => removeItem(e, item)}
                          className={
                            classNames && classNames.tagItemIconContainer
                              ? classNames.tagItemIconContainer
                              : "flex items-center px-1 cursor-pointer rounded-r-sm hover:bg-red-200 hover:text-red-600"
                          }
                        >
                          <CloseIcon
                            className={
                              classNames && classNames.tagItemIcon
                                ? classNames.tagItemIcon
                                : "w-3 h-3 mt-0.5"
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>

          <div className="flex flex-none items-center py-1.5">
            {loading && (
              <div className="px-1.5">
                <Spinner primaryColor={primaryColor} />
              </div>
            )}

            {isClearable && !isDisabled && value !== null && (
              <div className="px-1.5 cursor-pointer" onClick={clearValue}>
                <CloseIcon
                  className={
                    classNames && classNames.closeIcon
                      ? classNames.closeIcon
                      : "w-5 h-5 p-0.5"
                  }
                />
              </div>
            )}

            <div className="h-full">
              <span className="w-px h-full inline-block text-white bg-gray-300 text-opacity-0" />
            </div>

            <div className="px-1.5">
              <ChevronIcon
                className={`transition duration-300 w-6 h-6 p-0.5${
                  open ? " transform rotate-90 text-gray-500" : " text-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        {open && !isDisabled && (
          <div
            tabIndex={-1}
            className={
              classNames && classNames.menu
                ? classNames.menu
                : "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700"
            }
          >
            {isSearchable && (
              <SearchInput
                value={inputValue}
                placeholder={searchInputPlaceholder}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}

            <Options
              list={list}
              noOptionsMessage={noOptionsMessage}
              text={inputValue}
              isMultiple={isMultiple}
              value={value}
              primaryColor={primaryColor || DEFAULT_THEME}
            />
          </div>
        )}
      </div>
    </SelectProvider>
  );
};

export default Select;
