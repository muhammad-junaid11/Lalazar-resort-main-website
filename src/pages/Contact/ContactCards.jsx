import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphoneOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined';
import { useTheme } from '@mui/material/styles';

// --- Contact Data Array ---
const contactData = [
  {
    id: 1,
    title: 'Email Address',
    content: ['lalazarfamilyresortshogran@gmail.com', 'contact@lalazarfamilyresort.com'],
    icon: EmailIcon,
  },
  {
    id: 2,
    title: 'Phone Number',
    content: ['0332 8888489', '0301 8132584', '0346 9669176'],
    icon: PhoneIphoneIcon,
  },
  {
    id: 3,
    title: 'Location',
    content: ['Shogran Rd, Shogran Kaghan,', 'Mansehra, Khyber', 'Pakhtunkhwa'],
    icon: LocationOnIcon,
  },
];

// --- Component Definition ---
const ContactCards = () => {
  const theme = useTheme();
  // Using theme.palette.secondary.main for the orange color
  const secondary = theme.palette.secondary.main; 

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {contactData.map((item) => {
            const IconComponent = item.icon;

            return (
              <Grid item size={{xs:12,md:4}} key={item.id}>
                <Box
                  sx={{
                    bgcolor: 'white',
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    // Styles adjusted to match the floating, subtle look from the image
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: '0 0 40px rgba(0, 0, 0, 0.05)', // Increased shadow
                    height: '100%',
                    transition: '0.3s',
                    '&:hover': {
                        boxShadow: `0 0 50px ${secondary}30`, // Subtle hover effect
                        transform: 'translateY(-5px)',
                    }
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ mb: 4, position: 'relative' }}>
                    <IconComponent
                      sx={{
                        color: secondary,
                        // Increased icon size to match the image
                        fontSize: { xs: 80, md: 100 }, 
                        fontWeight: 300,
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      // Increased font weight for prominence
                      fontWeight: 600, 
                      color: 'text.primary',
                      mb: 2,
                      // For that high-end look, often use a serif font for titles
                      fontFamily: 'Georgia, serif', 
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Content */}
                  <Box>
                    {item.content.map((line, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          fontSize: '1rem',
                          lineHeight: 1.6,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactCards;