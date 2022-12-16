/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import Select from "../MultiSelect";

export type Option = {
  label: string;
  value: string;
  icon: string;
};

type Props = {
  data: Option[];
  values: Option[];
  onChange: Dispatch<SetStateAction<Option[]>>;
};

const OptionComponent = ({ option }: { option: Option }) => {
  return (
    <div className="flex w-full py-1 cursor-pointer hover:bg-blue-400 items-center space-x-2">
      <Image
        src={option.icon}
        width={10}
        height={10}
        alt={option.label}
        className="w-6 h-6 object-contain"
      />
      <p>{option.label}</p>
    </div>
  );
};

export default function MultiSelect({ data, onChange, values }: Props) {
  const handleChange = (value: Option[]) => {
    if (value) {
      onChange(value);
    }
  };

  return (
    <Select
      isMultiple
      noOptionsMessage="No technologies found"
      isSearchable
      isClearable
      classNames={{
        list: "bg-blue-800",
        menu: "bg-blue-800 w-full absolute text-white",
        tagItem: () => "bg-blue-600 text-white px-2 flex",
        searchBox:
          "bg-blue-600 py-2 w-full pl-10 justify-between align-middle items-center flex text-white",
        searchContainer:
          "bg-blue-800 w-full flex justify-between align-middle items-center",
      }}
      placeholder="Select some technologies"
      formatOptionLabel={(option) => (
        <OptionComponent option={option as Option} />
      )}
      primaryColor="indigo"
      value={values}
      onChange={(value) => handleChange(value as Option[])}
      options={data}
    />
  );
}
