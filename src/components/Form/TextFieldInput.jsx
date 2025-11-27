import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const TextFieldInput = ({
  name,
  control,
  label,
  placeholder,
  fullWidth = true,
  rules = {},
  sx = {},
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth}
          size="small"
          error={!!error}
          helperText={error ? error.message : ""}
          sx={sx}
          {...rest}
        />
      )}
    />
  );
};

export default TextFieldInput;
