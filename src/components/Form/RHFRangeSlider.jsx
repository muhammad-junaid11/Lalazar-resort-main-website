import React from "react";
import { Box, Typography, Slider } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFRangeSlider({ name, label, min = 0, max = 10000, step = 100 }) {
    const { control } = useFormContext();

    return (
        <Box sx={{ my: 2 }}>
            {label && (
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {label}
                </Typography>
            )}

            <Controller
                name={name}
                control={control}
                defaultValue={[min, max]}
                render={({ field }) => (
                    <Slider
                        {...field}
                        value={field.value}
                        onChange={(_, value) => field.onChange(value)}
                        min={min}
                        max={max}
                        step={step}
                        valueLabelDisplay="auto"
                    />
                )}
            />
        </Box>
    );
}
