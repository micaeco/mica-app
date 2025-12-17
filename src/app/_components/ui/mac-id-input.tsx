import * as React from "react";

import { cn } from "@app/_lib/utils";

export interface MacIdInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

const MacIdInput = React.forwardRef<HTMLInputElement, MacIdInputProps>(
  ({ className, onChange, onValueChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, "");

      const formattedValue = (sanitizedValue.slice(0, 12).match(/.{1,2}/g) || []).join(":");

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      if (onValueChange) {
        onValueChange(formattedValue);
      }
    };

    return (
      <input
        type="text"
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "font-mono uppercase",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        maxLength={17}
        placeholder="A1:B2:C3:D4:E5:F6"
        {...props}
      />
    );
  }
);

MacIdInput.displayName = "MacIdInput";

export { MacIdInput };
