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

  // Define inputSx to match other fields exactly
  const inputSx = {
    mt: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& .MuiInputBase-input": {
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: "10px 10px",
        color: "#000",
      },
      "& fieldset": { borderColor: "rgba(0,0,0,0.2)" },
      "&:hover fieldset": { borderColor: "rgba(0,0,0,0.4)" },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 0 1px ${theme.palette.secondary.main}`,
      },
      "& .MuiSvgIcon-root": { color: theme.palette.secondary.main },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(0,0,0,0.7)",
      "&.Mui-focused": { color: theme.palette.secondary.main },
      "&:not(.MuiInputLabel-shrink)": { transform: "translate(14px, 10px) scale(1)" },
      "&.MuiInputLabel-shrink": { transform: "translate(14px, -9px) scale(0.75)" },
    },
    ...sx, // Allow any additional overrides if passed
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
          slots={{
            textField: TextField,
          }}
          slotProps={{
            textField: {
              fullWidth,
              error: !!error,
              helperText: error?.message,
              sx: inputSx, // Apply consistent styling
              ...rest,
            },
            openPickerButton: {
              sx: { 
                color: theme.palette.secondary.main, // Secondary color for picker button
                "&:hover": { color: theme.palette.secondary.dark },
              },
            },
            day: {
              sx: {
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.secondary.main} !important`, // Secondary for selected day
                  color: '#fff !important',
                  '&:hover': {
                    backgroundColor: `${theme.palette.secondary.dark} !important`,
                  },
                  '&:focus': {
                    backgroundColor: `${theme.palette.secondary.main} !important`,
                  },
                },
              },
            },
            // Style the picker dialog for consistency, including time picker
            popper: {
              sx: {
                "& .MuiPickersDay-root": {
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "#fff",
                  },
                },
                "& .MuiPickersCalendarHeader-root": {
                  backgroundColor: theme.palette.secondary.light,
                },
                "& .MuiTimePickerToolbar-root": {
                  backgroundColor: theme.palette.secondary.main, // Secondary for time toolbar
                  color: "#fff",
                },
                "& .MuiPickersToolbarButton-root": {
                  color: "#fff",
                  "&.Mui-selected": {
                    backgroundColor: `${theme.palette.secondary.dark} !important`, // Secondary dark for selected time button
                    color: "#fff !important",
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.main,
                  },
                },
                /* --- FIX ADDED HERE --- */
                // Target the selected list item in the time view (e.g., the '03' and '20' in your image)
                "& .MuiMenuItem-root": {
                    "&.Mui-selected": {
                        backgroundColor: `${theme.palette.secondary.main} !important`, // Use secondary color
                        color: "#fff",
                        // Make sure hover is also overridden for consistency
                        "&:hover": {
                            backgroundColor: `${theme.palette.secondary.dark} !important`,
                        },
                    },
                },
                /* --- END FIX --- */
                
                // Additional for clock view (already correct)
                "& .MuiClock-root": {
                  "& .MuiClockPointer-root": {
                    backgroundColor: theme.palette.secondary.main,
                  },
                  "& .MuiClockPointer-thumb": {
                    backgroundColor: theme.palette.secondary.main,
                    borderColor: theme.palette.secondary.main,
                  },
                },
                "& .MuiClockNumber-root": {
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "#fff",
                  },
                },
              },
            },
            actionBar: {
              actions: ['clear', 'today', 'accept'],
            },
          }}
        />
      )}
    />
  );
};

export default DateTimePickerInput;