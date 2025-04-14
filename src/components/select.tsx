"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: {
    label: string;
    value: string;
  }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const Select = ({
  value,
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="h-10 text-sm"
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "transparent",
          borderRadius: "0.475rem",
          borderColor: "#e2e8f0",
          borderWidth: state.isFocused ? "2px" : "2px",
          boxShadow: state.isFocused ? "none" : base.boxShadow,
          "&:hover": {
            borderColor: "#14b8a6",
            color: "#14b8a6",
          },
          ...(state.isFocused && {
            borderColor: "#14b8a6",
            outline: "none",
          }),
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "0.375rem",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#e6fffa" : base.backgroundColor,
          color: state.isFocused ? "#0d9488" : base.color,
          "&:hover": {
            color: "#14b8a6",
          },
        }),
        placeholder: (base) => ({
          ...base,
          "&:hover": {
            color: "#14b8a6",
          },
        }),
        singleValue: (base) => ({
          ...base,
          "&:hover": {
            color: "#14b8a6",
          },
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
