import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  Container,
} from '@mui/material';

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";

import deluxe from '../../assets/deluxe.webp';
import family from '../../assets/family.webp';
import luxury from '../../assets/luxury.webp';
import executive from '../../assets/executive.webp';
import activities from '../../assets/img2.webp';
import contactBg from '../../assets/activities.webp';

// Map DB names → images
const imageMap = {
  "Deluxe Room": deluxe,
  "Luxury Room": luxury,
  "Executive Room": executive,
  "Family Room": family,
};

// --- Room Image Component ---
const RoomImage = ({ src, alt, height = '100%', borderRadius = '4px' }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: '100%',
      height: height,
      objectFit: 'cover',
      borderRadius: borderRadius,
      display: 'block',
    }}
  />
);

// --- Room Card Component ---
const RoomCard = ({ name, imageSrc }) => (
  <Box
    sx={{
      position: 'relative',
      height: '500px', // FIXED HEIGHT
      overflow: 'hidden',
      borderRadius: '4px',
      '&:hover .overlay': { backgroundColor: 'rgba(0,0,0,0.4)' },
    }}
  >
    <RoomImage src={imageSrc} alt={name} height="100%" />

    <Box
      className="overlay"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1, fontFamily: 'serif' }}>
        {name}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        sx={{
          width: '100%',
          maxWidth: '180px',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '4px',
          mt: 1,
          padding: '12px 18px', // bigger padding
          fontSize: '1rem', // bigger text
        }}
      >
        Select This Room
      </Button>
    </Box>
  </Box>
);

// --- Bottom Section (Other Activities) ---
const BottomSection = () => (
  <Box
    sx={{
      position: 'relative',
      height: '500px', // same as RoomCard
      overflow: 'hidden',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:hover .overlay': { backgroundColor: 'rgba(0,0,0,0.5)' },
    }}
  >
    <RoomImage src={activities} alt="Other Activities" height="100%" />

    <Box
      className="overlay"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 2,
        background:
          'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 600,
          fontFamily: 'serif',
          textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
          fontSize: '1.2rem',
        }}
      >
        Other Activities
      </Typography>
    </Box>
  </Box>
);

// --- Contact Banner ---
const ContactBanner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: '250px', // bigger banner
        mt: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
      }}
    >
      <RoomImage src={contactBg} alt="Contact" height="100%" borderRadius="0" />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: 2, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
          '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.9)', // slightly darker on hover
    },
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontWeight: 700,
            fontFamily: 'serif',
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Contact us now! <br/> <Box component="span" sx={{ fontSize: '1.3em' }}>0332 8888489</Box>
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          sx={{
            minWidth: '180px',
            padding: '14px 20px',
            fontSize: '1.1rem',
          }}
        >
          Contact
        </Button>
      </Box>
    </Box>
  );
};

// --- Main Component ---
const RoomsSection = () => {
  const theme = useTheme();
  const [roomData, setRoomData] = useState([]);

  // FETCH CATEGORIES FROM FIRESTORE
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "roomCategory"));

        const list = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().categoryName,
          image: imageMap[doc.data().categoryName] || deluxe, // default fallback
        }));

        setRoomData(list);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Title */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontFamily: '"Georgia",serif',
            color: theme.palette.secondary.main,
            fontSize: { xs: '2.5rem',sm:'3rem', md: '3.5rem' },
          }}
        >
          Our Rooms
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', fontWeight: 300 }}>
          Experience a haven of tranquility and indulgence in our curated rooms.
        </Typography>
      </Box>

      {/* GRID (preserve your layout exactly) */}
      <Grid container spacing={2}>
        {roomData.slice(0, 3).map((room) => (
          <Grid size={{ xs: 12, sm: 4 }} key={room.id}>
            <RoomCard name={room.name} imageSrc={room.image} />
          </Grid>
        ))}

        {roomData[3] && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <RoomCard name={roomData[3].name} imageSrc={roomData[3].image} />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 8 }}>
          <BottomSection />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ContactBanner />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomsSection;
