import React, { useState } from "react";
import { cn } from "../../utils/cn";
import Icon from "components/AppIcon";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      leftAdornment = null,
      rightAdornment = null,
      fieldClassName = "",
      ...props
    },
    ref
  ) => {
    const [fileName, setFileName] = useState("");

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input classes
    const baseInputClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Checkbox-specific styles
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // Radio button-specific styles
    if (type === "radio") {
      return (
        <input
          type="radio"
          className={cn(
            "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // File upload style (custom wrapper like your design)
    if (type === "file") {
      return (
        <div className="space-y-2">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium leading-none block text-foreground"
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}

          <div
            className={cn(
              "flex items-center justify-between w-full border-2 border-dashed border-[#E5E7EB] rounded-lg px-4 py-1.5 bg-white",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <span className="text-[#1F29378C] text-sm truncate max-w-[70%] font-medium">
              {props.filename || props.placeholder || "Upload file"}
            </span>
            <label className="cursor-pointer">
              <span className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm font-medium text-brand-gray-800 flex items-center gap-1">
                <Icon name="FolderOpen" size={16} /> Choose File
              </span>
              <input
                type="file"
                id={inputId}
                className="hidden"
                ref={ref}
                {...props}
              />
            </label>
          </div>

          {description && !error && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );
    }

    // Default: text/email/password/etc.
    const hasAdornment = !!leftAdornment || !!rightAdornment;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className={cn("relative", fieldClassName)}>
          {leftAdornment && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
              {leftAdornment}
            </div>
          )}

          <input
            type={type}
            className={cn(
              baseInputClasses,
              hasAdornment && leftAdornment && "pl-10",
              hasAdornment && rightAdornment && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />

          {rightAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
              {rightAdornment}
            </div>
          )}
        </div>

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
