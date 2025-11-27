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

import deluxe from '../../assets/deluxe.jpg';
import family from '../../assets/family.jpg';
import luxury from '../../assets/luxury.jpg';
import executive from '../../assets/executive.jpg';
import activities from '../../assets/activities.jpg';
import contactBg from '../../assets/ContactBg.jpg';

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
      height: '100%',
      minHeight: '200px',
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
        padding: 1.5,
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1, fontFamily: 'serif' }}>
        {name}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{
          width: '100%',
          maxWidth: '140px',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '2px',
          mt: 0.5,
          fontSize: '0.8rem',
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
      height: '100%',
      minHeight: '200px',
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
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 1.5,
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
        height: '150px',
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
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: 1, md: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Typography sx={{ color: 'white', fontWeight: 700, fontFamily: 'serif', fontSize: '1rem' }}>
          Contact us now! **0332 8888489**
        </Typography>

        <Button variant="contained" color="secondary" size="small" sx={{ minWidth: '100px' }}>
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
            fontWeight: 600,
            mb: 2,
            fontFamily: 'serif',
            color: theme.palette.secondary.main,
            fontSize: { xs: '2.5rem', md: '4rem' },
          }}
        >
          Our Rooms
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', fontWeight: 300 }}>
          Experience a haven of tranquility and indulgence in our curated rooms.
        </Typography>
      </Box>

      {/* GRID (unchanged) */}
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
