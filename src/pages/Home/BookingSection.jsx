import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/Firebase/Firebase";

const BookingSection = ({ images }) => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      5000
    );
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "90vh", md: "100vh" },
        overflow: "hidden",
      }}
    >
      {/* Background images */}
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

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
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

        <Box
          sx={{
            width: "100%", 
            maxWidth: { xs: "90%", sm: "70%", md: "600px" },
            textAlign: "center",
          }}
        >
         <Typography
  variant="h2"
  sx={{ color: theme.palette.common.white }}
>
  Luxury Living In The Heart Of Shogran
</Typography>

        </Box>

        {/* Book Now Button */}
        <Button
          variant="contained"
          color="secondary"
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            color: "white",
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: 2,
          }}
          onClick={() => {
            if (isLoggedIn) {
              navigate("/book");
            } else {
              localStorage.setItem("redirectAfterLogin", "/book");
              navigate("/signin");
            }
          }}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );
};

export default BookingSection;
