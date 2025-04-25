"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useMedia } from "react-use";

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

  const isMobile = useMedia("(max-width: 767px)", false);

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
          cursor: "pointer",
          backgroundColor: "transparent",
          borderRadius: "0.5rem",
          borderColor: "#e2e8f0",
          borderWidth: isMobile ? "1px" : "2px",
          boxShadow: "none",
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
          borderRadius: "0.625rem",
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
          borderRadius: "0.375rem",
          cursor: "pointer",
          backgroundColor: state.isFocused ? "#e6fffa" : "transparent",
          color: state.isFocused ? "#0d9488" : base.color,
          "&:active": {
            backgroundColor: "#ccfbf1",
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
