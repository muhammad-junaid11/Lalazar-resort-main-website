import React from "react";
import { Controller } from "react-hook-form";
import { TextField, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerInput = ({ 
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
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          label={label}
          onChange={(date) => field.onChange(date)}
          enableAccessibleFieldDOMStructure={false} // <-- important fix for MUI X v6+
          slots={{
            textField: TextField,
          }}
          slotProps={{
            textField: {
              fullWidth: fullWidth,
              error: !!error,
              helperText: error?.message,
              sx: sx,
              ...rest,
            },
            openPickerButton: {
              sx: { 
                color: theme.palette.secondary.main,
              },
            },
            day: {
              sx: {
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.secondary.main} !important`,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: `${theme.palette.secondary.dark} !important`,
                  },
                  '&:focus': {
                    backgroundColor: `${theme.palette.secondary.main} !important`,
                  },
                },
              },
            },
          }}
        />
      )}
    />
  );
};

export default DatePickerInput;
