import React from "react";
import { Controller } from "react-hook-form";
import { TextField, useTheme } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const DateTimePickerInput = ({ 
  name, 
  control, 
  label, 
  rules = {}, 
  sx = {}, 
  fullWidth = true, 
  ...rest 
}) => {
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        // This checks if a date has actually been selected
        const hasValue = field.value !== null && field.value !== undefined;

        const inputSx = {
          mt: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.08)",
            "& fieldset": { borderColor: "rgba(0,0,0,0.2)" },
            "&:hover fieldset": { borderColor: "rgba(0,0,0,0.4)" },
            "&.Mui-focused fieldset": { borderColor: theme.palette.secondary.main },
            
            // Targets the actual text inside the input
            "& .MuiInputBase-input": {
              // Forced color when value exists, otherwise black/default
              color: hasValue ? `${theme.palette.secondary.main} !important` : "#000",
              WebkitTextFillColor: hasValue ? `${theme.palette.secondary.main} !important` : "#000", 
              padding: "18.5px 14px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0,0,0,0.7)",
            "&.Mui-focused": { color: theme.palette.secondary.main },
            "&:not(.MuiInputLabel-shrink)": {
              top: "50%",
              transform: "translate(14px, -50%) scale(1)",
            },
            "&.MuiInputLabel-shrink": {
              top: "0",
              transform: "translate(14px, -6px) scale(0.75)",
            },
          },
          ...sx,
        };

        return (
          <DateTimePicker
            {...field}
            label={label}
            // Ensure the value is passed correctly to trigger the color change
            value={field.value || null} 
            onChange={(dateTime) => field.onChange(dateTime)}
            ampm={true}
            enableAccessibleFieldDOMStructure={false}
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                fullWidth,
                error: !!error,
                helperText: error?.message,
                sx: inputSx,
                size: "small",
                ...rest,
              },
              openPickerButton: {
                sx: { 
                  color: theme.palette.secondary.main, 
                  "&:hover": { color: theme.palette.secondary.dark },
                },
              },
            }}
          />
        );
      }}
    />
  );
};

export default DateTimePickerInput;