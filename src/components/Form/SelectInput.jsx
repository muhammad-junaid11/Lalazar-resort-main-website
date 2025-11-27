import React from "react";
import { Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";

const SelectInput = ({ name, control, label, options = [], fullWidth = true, rules = {}, sx = {} }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          label={label}
          fullWidth={fullWidth}
          size="small"
          error={!!error}
          helperText={error ? error.message : ""}
          sx={sx}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default SelectInput;
