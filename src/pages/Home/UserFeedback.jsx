import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, useTheme } from '@mui/material';

// Sample Feedback Data
const feedbackData = [
  {
    id: 1,
    name: 'Ayesha R.',
    comment:
      "Absolutely loved my stay! The ambiance was cozy, the staff was attentive, and every detail was perfect. I’ll definitely be coming back for another visit.",
  },
  {
    id: 2,
    name: 'Maria B.',
    comment:
      "A truly wonderful stay! The attention to detail was impressive, from the clean rooms to the prompt service. Highly recommend for a relaxing getaway.",
  },
  {
    id: 3,
    name: 'Ahmed K.',
    comment:
      "Fantastic experience! The staff went above and beyond to ensure our comfort. The amenities were top-notch, and the location was perfect for exploring.",
  },
];

const UserFeedback = () => {
  const theme = useTheme();
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  // Auto-advance feedback every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex((prevIndex) => (prevIndex + 1) % feedbackData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentFeedback = feedbackData[currentFeedbackIndex];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Section Header */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
                fontWeight: 600,
            mb: 2,
            fontFamily: 'serif',
            color: theme.palette.secondary.main,
            fontSize: { xs: '2.5rem', md: '4rem' },
          }}
        >
          User Feedback
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            color: 'text.secondary',
            fontWeight: 300,
          }}
        >
          Our valuable feedback below. We are eager to hear about your experience and how we can make your stay even more exceptional.
        </Typography>
      </Box>

      {/* Feedback Card */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: { xs: 3, md: 4 },
            height: '220px', // FIXED height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontFamily: 'serif',
              color: theme.palette.secondary.main,
            }}
          >
            {currentFeedback.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              overflow: 'hidden', // prevent overflow
              textOverflow: 'ellipsis',
            }}
          >
            {currentFeedback.comment}
          </Typography>
        </Paper>
      </Box>

      {/* Pagination Dots */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
        }}
      >
        {feedbackData.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor:
                index === currentFeedbackIndex
                  ? theme.palette.secondary.main
                  : 'text.disabled',
              mx: 0.5,
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onClick={() => setCurrentFeedbackIndex(index)}
          />
        ))}
      </Box>
    </Container>
  );
};

export default UserFeedback;
