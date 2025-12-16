import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";

import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
import LocalLaundryServiceOutlinedIcon from "@mui/icons-material/LocalLaundryServiceOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";

const featuresData = [
  { icon: RestaurantOutlinedIcon, text: "Restaurant" },
  { icon: SecurityOutlinedIcon, text: "24/7 Security" },
  { icon: LocalParkingOutlinedIcon, text: "Free Parking" },
  { icon: LocalLaundryServiceOutlinedIcon, text: "Full-service laundry" },
  { icon: ChildCareOutlinedIcon, text: "Child-friendly" },
  { icon: PetsOutlinedIcon, text: "Pet Friendly" },
  { icon: WifiOutlinedIcon, text: "High Speed WiFi" },
];

const FeatureCard = ({ Icon, text, theme }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(2),
      height: "100%",
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: "120px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        position: "relative",
        marginBottom: theme.spacing(1),
      }}
    >
      <Icon
        sx={{
          fontSize: 48,
          color: theme.palette.secondary.main, // UPDATED
          zIndex: 2,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70px",
          height: "2px",
          backgroundColor: theme.palette.secondary.main, // UPDATED
          zIndex: 1,
        }}
      />
    </Box>

    <Typography
      variant="subtitle1"
      align="center"
      sx={{ color: theme.palette.text.secondary, mt: 2 }}
    >
      {text}
    </Typography>
  </Box>
);

const CoreFeatures = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[50],
        padding: theme.spacing(8, 2),
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: theme.spacing(6),
          textAlign: { xs: "center", md: "left" },
          position: "relative",
        }}
      >
        <ApartmentOutlinedIcon
          sx={{
            fontSize: 40,
            color: theme.palette.secondary.main, // UPDATED
            marginBottom: theme.spacing(1),
            display: { xs: "block", md: "inline-block" },
            margin: { xs: "0 auto", md: "0" },
          }}
        />
        <Typography
          variant="h3"
          component="h2"
          sx={{ color: theme.palette.text.primary, mb: 2 }}
        >
          Core Features
        </Typography>

        <Box
          sx={{
            width: "100px",
            height: "3px",
            backgroundColor: theme.palette.secondary.main, // UPDATED
            marginBottom: theme.spacing(1),
            margin: { xs: "0 auto 8px auto", md: "0 0 8px 0" },
          }}
        />
      </Box>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {featuresData.map((feature, index) => (
          <Grid
            size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FeatureCard
              Icon={feature.icon}
              text={feature.text}
              theme={theme}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoreFeatures;
