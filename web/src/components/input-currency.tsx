import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
interface InputMoneyProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addonBefore?: string;
  inputClassName?: string;
  className?: string;
}
const DECIMAL_SIZE = 2;
const InputCurrency = ({
  value,
  onChange,
  inputClassName,
  ...props
}: InputMoneyProps) => {
  const [currentValue, setCurrentValue] = useState<string>(`${value}`);
  useEffect(() => {
    const valueString = `${value}`;
    if (!/\D/.test(valueString.replace(".", ""))) {
      setCurrentValue(value.toFixed(DECIMAL_SIZE).toString().replace(".", ","));
    }
  }, [value]);
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueRemoved = event.target.value.replace(",", "");
    const sizeSlice = valueRemoved.length - DECIMAL_SIZE;
    const newValue = [
      valueRemoved.slice(0, sizeSlice),
      ".",
      valueRemoved.slice(sizeSlice),
    ].join("");
    onChange({
      ...event,
      target: {
        ...event.target,
        value: newValue,
      },
    });
  };
  return (
    <div className={cn(props.className, "flex items-center rounded-xl ")}>
      <Input
        value={currentValue}
        onChange={handleOnChange}
        {...props}
        className={inputClassName}
      />
    </div>
  );
};
export default InputCurrency;
