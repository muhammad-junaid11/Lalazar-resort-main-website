import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import hotelView from "../../assets/deluxe.jpg";

// --- FAQ Data ---
const faqData = [
  {
    id: "panel1",
    question: "What time is check-in and check-out?",
    answer:
      "Our standard check-in time is 3:00 PM, and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request and subject to availability.",
  },
  {
    id: "panel2",
    question: "Are pets allowed at the hotel?",
    answer:
      "We welcome pets at our hotel with prior notice. Additional fees may apply. Please check our pet policy for more details.",
  },
  {
    id: "panel3",
    question: "Is there complimentary Wi-Fi available?",
    answer:
      "Yes, we offer complimentary high-speed Wi-Fi access for all our guests throughout the property.",
  },
  {
    id: "panel4",
    question: "Are there any nearby attractions or points of interest?",
    answer:
      "Our concierge can provide information about local attractions, including popular landmarks, cultural sites, and recreational activities nearby.",
  },
];

const FaqSection = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState("panel2");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getIcon = (panelId) =>
    expanded === panelId ? (
      <RemoveIcon sx={{ color: "white" }} />
    ) : (
      <AddIcon sx={{ color: theme.palette.secondary.main }} />
    );

  return (
    <Box sx={{ display: "flex", alignItems: "stretch" }}>
      <Container
        maxWidth="lg"
        sx={{
          py: 0,
          mt: { xs: 5, sm: 8, md: 15 }, 
         mb: { xs: 5,md: 15 },// different margin-top per breakpoint
        }}
      >
        <Grid container spacing={4}>
          {/* FAQ Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Header */}
              <Box mb={3}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    mb: 1,
                    "&::before": {
                      content: '"\\2302"',
                      fontSize: "2rem",
                      color: theme.palette.secondary.main,
                    },
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 500,
                    fontFamily: "serif",
                    color: theme.palette.primary.main,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Get Answers
                </Typography>
              </Box>

              {/* Accordions */}
              <Box>
                {faqData.map((faq) => (
                  <Accordion
                    key={faq.id}
                    expanded={expanded === faq.id}
                    onChange={handleChange(faq.id)}
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: "rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                      mb: 1,
                      "&.Mui-expanded": {
                        borderColor: theme.palette.secondary.main,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={getIcon(faq.id)}
                      aria-controls={`${faq.id}-content`}
                      id={`${faq.id}-header`}
                      sx={{
                        bgcolor:
                          expanded === faq.id
                            ? theme.palette.secondary.main
                            : "white",
                        color:
                          expanded === faq.id
                            ? "white"
                            : theme.palette.text.primary,
                        "& .MuiAccordionSummary-content": { my: 1 },
                        "&:hover": {
                          bgcolor:
                            expanded === faq.id
                              ? theme.palette.secondary.dark
                              : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                      sx={{
                        bgcolor: "white",
                        borderTop: 1,
                        borderColor: "rgba(0,0,0,0.1)",
                        p: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Image Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={hotelView}
                alt="Hotel View"
                sx={{
                  width: "100%",
                  height: "450px",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FaqSection;
