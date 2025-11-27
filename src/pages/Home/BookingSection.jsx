import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import DatePickerInput from "../../components/Form/DatePickerInput";
import GuestsInput from "./GuestsInput";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material/styles";

const BookingSection = ({ images }) => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const { control, handleSubmit } = useFormContext();

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const onSubmit = (data) => console.log("Search Data:", data);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "90vh", md: "100vh" },  // hero size
        overflow: "hidden",
      }}
    >
      {/* Background Images */}
      {images.map((img, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}

      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      {/* CONTENT */}
      <Box
        sx={{
          position: "relative", // ❗ changed from absolute → now part of normal layout
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          gap: 4,
          zIndex: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: theme.palette.common.white,
            textAlign: "center",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            fontSize: { xs: "2rem", md: "3.5rem" },
          }}
        >
          Luxury Living In <br /> The Heart Of <br /> Shogran
        </Typography>

        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: { xs: "95%", md: "80%", lg: "70%" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            backgroundColor: theme.palette.common.white,
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            alignItems: "center",
          }}
        >
          <DatePickerInput name="checkin" control={control} label="Check-in" sx={{ flex: 1 }} />
          <DatePickerInput name="checkout" control={control} label="Check-out" sx={{ flex: 1 }} />
          <GuestsInput name="guests" control={control} label="Guests" sx={{ flex: 1 }} />
          <Button type="submit" variant="contained" color="secondary" sx={{ px: 5, py: 2 }}>
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingSection;
