"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { components, OptionProps, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useMedia } from "react-use";

type Option = {
  label: string;
  value: string;
};

const SelectOption = (props: OptionProps<Option, false>) => {
  return (
    <components.Option {...props}>
      <div className="flex w-full items-center justify-between gap-2">
        <span>{props.children}</span>
        {props.isSelected && <Check className="size-4 shrink-0" />}
      </div>
    </components.Option>
  );
};

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: Option[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

const EMPTY_OPTIONS: Option[] = [];

export const Select = ({
  value,
  onChange,
  disabled,
  onCreate,
  options = EMPTY_OPTIONS,
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<Option>) => {
    onChange(option?.value);
  };

  const isMobile = useMedia("(max-width: 767px)", false);

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="h-10 text-sm"
      components={{ Option: SelectOption }}
      styles={{
        control: (base, state) => ({
          ...base,
          cursor: "pointer",
          backgroundColor: "transparent",
          borderRadius: "0.5rem",
          borderColor: "#e2e8f0",
          borderWidth: isMobile ? "1px" : "2px",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#14b8a6",
          },
          ...(state.isFocused && {
            borderColor: "#14b8a6",
            outline: "none",
          }),
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "1rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 15px -3px rgba(30, 25, 20, 0.06), 0 4px 6px -4px rgba(30, 25, 20, 0.04)",
          overflow: "hidden",
        }),
        menuList: (base) => ({
          ...base,
          padding: "4px",
        }),
        option: (base, state) => ({
          ...base,
          borderRadius: "0.5rem",
          cursor: "pointer",
          padding: "6px 8px",
          color: state.isFocused ? "#0f766e" : "#1e293b",
          backgroundColor: state.isFocused ? "rgba(204, 251, 241, 0.75)" : "transparent",
          "&:active": {
            backgroundColor: "rgba(204, 251, 241, 0.75)",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: "#1e293b",
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};
