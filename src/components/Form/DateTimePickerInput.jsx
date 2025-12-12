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

  // Input styles aligned with other TextField / SelectInput
  const inputSx = {
    mt: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "rgba(255,255,255,0.08)", 
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0,0,0,0.4)",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
      },
      "& .MuiInputBase-input": {
        color: "#000",
        padding: "16px 10px", // Increased vertical padding to center the input text vertically
      },
      "& .MuiSelect-select": { color: "#000" },
      "& .MuiSvgIcon-root": { color: theme.palette.secondary.main },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(0,0,0,0.7)",
      "&.Mui-focused": { color: theme.palette.secondary.main },
      "&:not(.MuiInputLabel-shrink)": { transform: "translate(14px, 10px) scale(1)" },
      "&.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
    },
    ...sx,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          label={label}
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
      )}
    />
  );
};

export default DateTimePickerInput;