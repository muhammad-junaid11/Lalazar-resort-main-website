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
  autoComplete,
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
          value={field.value ?? ""}  // ⭐ Important fix
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth}
          size="small"
          error={!!error}
          helperText={error ? error.message : ""}
          sx={sx}
          autoComplete={autoComplete}
          {...rest}
        />
      )}
    />
  );
};

export default TextFieldInput;
