import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import RoomIcon from "@mui/icons-material/Room";
import logo from "../../assets/logo.jpg"; 

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ bgcolor: "white", pt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center">
          
          <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "center", md: "left" }}>
            <Box
              component="img"
              src={logo}
              alt="Lalazar Family Resort"
              sx={{
                width: 160,
                height: "auto",
                border: "4px solid black",
                p: 1,
                mx: { xs: "auto", md: 0 },
                display: "block",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "center", md: "left" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontFamily: "serif" }}
            >
              Pages
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["Services", "Rooms", "Contacts"].map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>


          <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "center", md: "left" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontFamily: "serif" }}
            >
              Get In Touch
            </Typography>

            <Typography sx={{ mb: 2, color: "grey.600" }}>
              Feel free to reach out to us for any inquiries.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <PhoneIcon sx={{ color: "secondary.main", fontSize: 34 }} /> {/* BIG ICON */}
              <Box>
                <Typography>0332 8888489</Typography>
                <Typography>0301 8132584</Typography>
                <Typography>0346 9669176</Typography>
              </Box>
            </Box>


            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <EmailIcon sx={{ color: "secondary.main" }} />
              <Typography>lalazarfamilyresortshogran@gmail.com</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <EmailIcon sx={{ color: "secondary.main" }} />
              <Typography>contact@lalazarfamilyresort.com</Typography>
            </Box>


            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <RoomIcon sx={{ color: "secondary.main" }} />
              <Typography>
                Shogran Rd, Shogran Kaghan, Mansehra, Khyber Pakhtunkhwa
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>


      <Box
        sx={{
          bgcolor: "secondary.main",
          textAlign: "center",
          py: 2,
          mt: 6,
        }}
      >
        <Typography sx={{ color: "white", fontWeight: 500 }}>
          Copyright & Design By @Lalazar Family Resort {currentYear}
        </Typography>
      </Box>
    </Box>
  );
};

export default FooterComponent;
