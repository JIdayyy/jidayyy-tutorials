interface IProps {
  text: string;
  variant: "action" | "cancel" | "info";
  className?: string;
}

export default function Button({ text, variant, className }: IProps) {
  return (
    <button type="button" className={`${variant} ${className}`}>
      {text}
    </button>
  );
}
