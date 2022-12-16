/* eslint-disable react/jsx-no-useless-fragment */
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<FieldValues>;
  variant: "underline" | "solid";
  icon?: JSX.Element;
  placeholder: string;
  className?: string;
  name: string;
  type: "text" | "password";
};

export default function Input({
  register,
  variant,
  placeholder,
  className = "",
  icon,
  type,
  name,
}: Props) {
  const Icon = icon ? () => icon : () => <></>;

  return (
    <label className="text-white capitalize w-full" htmlFor={name}>
      <span className="my-1">{name} :</span>
      <input
        type={type}
        className={`${variant} ${className}`}
        placeholder={placeholder}
        {...register(name)}
      />
      {icon && <Icon />}
    </label>
  );
}
