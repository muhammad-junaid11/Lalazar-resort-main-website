import React, { useEffect } from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

import accommodationsImage from "../../assets/executive.webp";
import outdoorViewsImage from "../../assets/outdoor.webp";
import cuisineImage from "../../assets/cuisine.webp";
import kidsAreaImage from "../../assets/playful.webp";

const ServicesFeaturesArr = [
  {
    id: 1,
    title: 'Comfortable Accomodations',
    description: 'Experience unparalleled comfort in our inviting rooms. Relax, unwind, and enjoy a stay designed with your peace and relaxation in mind.',
    image: accommodationsImage, 
    imageOnRight: true,
    imageHeight: { xs: 250, md: 500 },
    buttonText: 'Reserve Now',
  },
  {
    id: 2,
    title: 'Outdoor Views',
    description: 'Wake up to stunning vistas and let the natural beauty outside enhance your stay. Every moment here is a visual delight.',
    image: outdoorViewsImage, 
    imageOnRight: false,
    imageHeight: { xs: 250, md: 500 },
    buttonText: 'Contact Us',
  },
  {
    id: 3,
    title: 'Delicious Cuisine',
    description: 'Indulge in a culinary experience like no other. Our delicious cuisine features fresh, locally sourced ingredients and innovative recipes.',
    image: cuisineImage, 
    imageOnRight: true,
    imageHeight: { xs: 250, md: 500 },
    buttonText: 'Our Menu',
  },
  {
    id: 4,
    title: 'Play Area For Kids',
    description: 'Rock on with our climbing area! Kids can climb, conquer, and create unforgettable memories in a safe and fun environment.',
    image: kidsAreaImage, 
    imageOnRight: false,
    imageHeight: { xs: 250, md: 500 },
    buttonText: 'Contact Us',
  },
];

const ServicesFeatures = () => {
  const theme = useTheme();
  const textContentPadding = 6;
  const location = useLocation();

  // Scroll to section if navigated with state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8f8f8' }}>
      <Container maxWidth="lg" disableGutters>
        {ServicesFeaturesArr.map((feature) => {
          let sectionId;
          if (feature.title === "Delicious Cuisine") sectionId = "cuisine-section";
          if (feature.title === "Play Area For Kids") sectionId = "play-area-section";

          return (
            <Grid
              container
              spacing={0}
              alignItems="stretch"
              key={feature.id}
              direction={{ xs: 'column', md: feature.imageOnRight ? 'row' : 'row-reverse' }}
              id={sectionId} // Add IDs for Cuisine & Play Area
            >
              {/* Text Content */}
              <Grid
                item
                size={{ xs: 12, md: 6 }}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  bgcolor: 'white',
                  py: { xs: 4, md: 0 },
                  minHeight: { md: feature.imageHeight.md },
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', md: '85%' },
                    mr: feature.imageOnRight ? 'auto' : 0,
                    ml: feature.imageOnRight ? 0 : 'auto',
                    px: { xs: 3, md: 0 },
                    pl: feature.imageOnRight ? { md: textContentPadding } : { md: 0 },
                    pr: feature.imageOnRight ? { md: 0 } : { md: textContentPadding },
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'left' }}>
                    {feature.description}
                  </Typography>

                  {feature.buttonText && (
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        color: 'white',
                        '&:hover': { bgcolor: theme.palette.secondary.dark },
                        borderRadius: 0,
                        py: 1.5,
                        px: 3,
                        fontWeight: 'bold',
                        width: 'fit-content',
                      }}
                    >
                      {feature.buttonText}
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Image */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src={feature.image}
                  alt={feature.title}
                  sx={{
                    width: '100%',
                    height: feature.imageHeight,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </Container>
    </Box>
  );
};

export default ServicesFeatures;
