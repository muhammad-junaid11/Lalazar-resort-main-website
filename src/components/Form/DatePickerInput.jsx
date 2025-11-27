// /src/components/form/DatePickerInput.jsx
import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerInput = ({ name, control, label, rules = {}, sx = {}, fullWidth = true, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          label={label}
          inputFormat="dd/MM/yyyy"
          onChange={(date) => field.onChange(date)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth={fullWidth}
              size="small"
              error={!!error}
              helperText={error ? error.message : ""}
              sx={sx}
              {...rest}
            />
          )}
        />
      )}
    />
  );
};

export default DatePickerInput;
