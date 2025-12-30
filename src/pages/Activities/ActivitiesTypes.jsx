import React, { useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

import bonfireImage from '../../assets/bonfire.webp'; 
import trekkingImage from '../../assets/trekking.webp'; 
import siriPayeImage from '../../assets/siripaye.webp'; 

const activities = [
  {
    id: 1,
    title: 'Bonfire',
    description: 'A bonfire is a large, controlled fire usually held outdoors for warmth, light, cooking, or as part of social and cultural celebrations.',
    image: bonfireImage,
    imageOnRight: true,
    imageHeight: { xs: 200, md: 350 }, 
  },
  {
    id: 2,
    title: 'Trekking',
    description: 'Trekking is an adventurous outdoor activity that involves hiking through natural landscapes, often in remote or mountainous regions.',
    image: trekkingImage, 
    imageOnRight: false,
    imageHeight: { xs: 250, md: 400 },
  },
  {
    id: 3,
    title: 'Adventure Of Siri Paye',
    description: 'The adventure to Siri Paye, nestled in the Kaghan Valley of Pakistan, offers trekkers a breathtaking journey through lush meadows, dense forests, and stunning mountain vistas.',
    image: siriPayeImage,
    imageOnRight: true,
    imageHeight: { xs: 250, md: 400 },
  },
];

const ActivitiesTypes = () => {
  const theme = useTheme();
  const location = useLocation();
  const textContentPadding = 6;
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
        {activities.map((activity) => {
          const sectionId = activity.id === 2 ? 'trekking-section' : undefined; // ID for Trekking

          return (
            <Grid
              container
              spacing={0}
              alignItems="stretch"
              key={activity.id}
              direction={{ xs: 'column', md: activity.imageOnRight ? 'row' : 'row-reverse' }}
              id={sectionId}
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
                  minHeight: { md: activity.imageHeight.md }, 
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', md: '85%' },
                    mr: activity.imageOnRight ? 'auto' : 0,
                    ml: activity.imageOnRight ? 0 : 'auto',
                    px: { xs: 3, md: 0 },
                    pl: activity.imageOnRight ? { md: textContentPadding } : { md: 0 },
                    pr: activity.imageOnRight ? { md: 0 } : { md: textContentPadding },
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1.5 }}>
                    {activity.title}
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
                    {activity.description}
                  </Typography>
                </Box>
              </Grid>

              {/* Image */}
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src={activity.image}
                  alt={activity.title}
                  sx={{
                    width: '100%',
                    height: activity.imageHeight,
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

export default ActivitiesTypes;
