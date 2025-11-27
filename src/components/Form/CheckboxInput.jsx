import React from "react";
import { Controller } from "react-hook-form";
import { FormControlLabel, Checkbox } from "@mui/material";

const CheckboxInput = ({ name, control, label, rules = {}, sx = {} }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} checked={field.value || false} />}
          label={label}
          sx={sx}
        />
      )}
    />
  );
};

export default CheckboxInput;
