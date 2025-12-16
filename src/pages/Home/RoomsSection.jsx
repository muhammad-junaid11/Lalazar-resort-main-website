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

import { useNavigate } from "react-router-dom";

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
const RoomCard = ({ name, imageSrc, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'relative',
      height: '500px',
      overflow: 'hidden',
      borderRadius: '4px',
      cursor: 'pointer',
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
      <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: "bold" }}>
        {name}
      </Typography>
      <Button
  variant="contained"
  sx={{
    backgroundColor: '#F58220',
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    borderRadius: '4px',
    padding: '10px 15px',
    fontSize: '0.8rem',
    textDecoration: 'underline',
    alignSelf: 'flex-start', // <-- prevents full width stretch
    '&:hover': {
      backgroundColor: (theme) => theme.palette.secondary.dark, // automatically darker variant
    },
  }}
>
  Select This Room
</Button>

    </Box>
  </Box>
);

// --- Bottom Section (Other Activities) ---
const BottomSection = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'relative',
      height: '500px',
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
        variant="h5"
        sx={{ color: 'white', fontWeight: "bold", mb: 2 }}
      >
        Other Activities
      </Typography>
    </Box>
  </Box>
);

// --- Contact Banner ---
const ContactBanner = ({ onClick }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '250px',
        mt: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
      }}
    >
      {/* Darker default background */}
      <RoomImage src={contactBg} alt="Contact" height="100%" borderRadius="0" />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', // darker default
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: 2, md: 8 },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            flexShrink: 0
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </Box>

          <Box>
            <Typography variant="h4" component="div" sx={{ color: 'white', fontFamily: 'serif', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'center', lg: 'baseline' }, gap: 1, lineHeight: 1.2 }}>
              <span style={{ fontWeight: 'bold' }}>Contact us now!</span>
              <span style={{ fontWeight: '400', textDecoration: 'underline', textUnderlineOffset: '4px' }}>0332 8888489</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1, fontSize: '0.9rem' }}>
              Get support anytime — 24/7 our staff is ready for you.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={onClick}
          sx={{
            backgroundColor: '#F58220',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '10px 25px',
            fontSize: '1rem',
            minWidth: '140px',
            textDecoration: 'underline',
           '&:hover': {
      backgroundColor: (theme) => theme.palette.secondary.dark, // automatically darker variant
    },
          }}
        >
          CONTACT
        </Button>
      </Box>
    </Box>
  );
};

// --- Main Component ---
const RoomsSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "roomCategory"));
        const list = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().categoryName,
          image: imageMap[doc.data().categoryName] || deluxe,
        }));
        setRoomData(list);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleRoomClick = (room) => {
    const slug = room.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/rooms/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivitiesClick = () => {
    navigate("/activities");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    navigate("/contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" sx={{ mb: 2, color: theme.palette.secondary.main }}>
          Our Rooms
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary' }}>
          Experience a haven of tranquility and indulgence in our curated rooms.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {roomData.slice(0, 3).map((room) => (
          <Grid size={{ xs: 12, sm: 4 }} key={room.id}>
            <RoomCard
              name={room.name}
              imageSrc={room.image}
              onClick={() => handleRoomClick(room)}
            />
          </Grid>
        ))}

        {roomData[3] && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <RoomCard
              name={roomData[3].name}
              imageSrc={roomData[3].image}
              onClick={() => handleRoomClick(roomData[3])}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 8 }}>
          <BottomSection onClick={handleActivitiesClick} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ContactBanner onClick={handleContactClick} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoomsSection;
