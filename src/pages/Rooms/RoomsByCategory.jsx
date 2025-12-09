import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Box, Grid, Card, CardMedia, Typography, Button, 
  CircularProgress, useTheme, Pagination, Divider 
} from "@mui/material";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";
import HeroSection from "../../components/HeroSection";

const toSlug = (text) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

import familyImg from "../../assets/Familyr.webp";
import luxuryImg from "../../assets/Luxuryr.webp";
import deluxeImg from "../../assets/Deluxer.webp";
import executiveImg from "../../assets/Executiver.webp";

// Mapping category slugs to local assets
const categoryImages = {
  "family-room": familyImg,
  "luxury-room": luxuryImg,
  "deluxe-room": deluxeImg,
  "executive-room": executiveImg,
};

// Function to capitalize the first letter of each word (e.g., "luxury room" -> "Luxury Room")
const capitalizeWords = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Fetch rooms from Firestore
const fetchRoomsByCategory = async (categorySlug) => {
  const roomsSnapshot = await getDocs(collection(db, "rooms"));
  const categoryMap = {};

  const roomsPromises = roomsSnapshot.docs.map(async (roomDoc) => {
    const data = roomDoc.data();
    const roomId = roomDoc.id;
    let categoryName = "N/A";

    if (categoryMap[data.categoryId]) {
      categoryName = categoryMap[data.categoryId];
    } else {
      const catRef = doc(db, "roomCategory", data.categoryId);
      const catSnap = await getDoc(catRef);
      if (catSnap.exists()) {
        categoryName = catSnap.data().categoryName;
        categoryMap[data.categoryId] = categoryName;
      }
    }

    // Only include rooms matching the current category slug
    if (toSlug(categoryName) === categorySlug.toLowerCase()) {
      return {
        id: roomId,
        categoryName, // The original database name (e.g., "Luxury Room")
        price: data.price,
        image: data.image || "https://via.placeholder.com/300x220",
      };
    }

    return null;
  });

  return (await Promise.all(roomsPromises)).filter(Boolean);
};

const RoomsByCategory = () => {
  const { categoryName } = useParams(); // slug from URL (e.g., "luxury-room")
  const theme = useTheme();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to hold the original, correctly capitalized category name from the database
  // Initialize with fallback from slug
  const [displayCategoryName, setDisplayCategoryName] = useState(capitalizeWords(categoryName.replace(/-/g, " "))); 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Set hero image based on category slug (local asset used) - this is immediate
  const heroImage = categoryImages[categoryName.toLowerCase()] || "https://via.placeholder.com/1400x400";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setCurrentPage(1); // reset page when category changes
        const fetchedRooms = await fetchRoomsByCategory(categoryName);
        setRooms(fetchedRooms);

        if (fetchedRooms.length > 0) {
            // Get the original category name from the first room and format it
            const rawCategoryName = fetchedRooms[0].categoryName;
            setDisplayCategoryName(capitalizeWords(rawCategoryName));
        } else {
            // If no rooms, keep the fallback (already set)
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load rooms. Check your network or database.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, [categoryName]);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  
  // Breadcrumb text (Home | Gallery)
  const breadcrumbText = `Gallery`;
  // Main title text (e.g., "Luxury Room") - now initialized immediately
  const mainTitle = displayCategoryName; 
  

  return (
    <Box>
      {/* Render HeroSection immediately, regardless of loading state */}
      <HeroSection
        subtitle={breadcrumbText} 
        title={mainTitle} 
        bgImage={heroImage} 
        appBarColor="transparent" 
      />

      <Box sx={{ p: 4, maxWidth: 1300, mx: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress color="secondary" />
            <Typography sx={{ ml: 2, color: "text.secondary" }}>
              Loading {categoryName.replace("-", " ")} rooms...
            </Typography>
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ p: 5 }}>
            {error}
          </Typography>
        ) : rooms.length === 0 ? (
          <Typography align="center" sx={{ p: 5 }}>
            No rooms found for "{displayCategoryName}"
          </Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="flex-start">
              {currentRooms.map((room) => (
                <Grid key={room.id} size={{xs:12,sm:6,md:3}}>
                  <Card
                    sx={{
                      width: "100%",
                      height: 350,
                      borderRadius: 0,
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={room.image} 
                      alt={room.categoryName}
                      sx={{ objectFit: "cover" }}
                    />
                    <Box sx={{ p: 2, flexGrow: 1, textAlign: "center" }}>


                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.secondary.main }}>
                        PKR {room.price.toLocaleString()} /-
                      </Typography>

                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          fontWeight: "bold",
                          borderColor: theme.palette.secondary.main,
                          color: theme.palette.secondary.main,
                          "&:hover": {
                            backgroundColor: theme.palette.secondary.main,
                            color: "#fff",
                            borderColor: theme.palette.secondary.main,
                          },
                        }}
                        onClick={() => console.log(`Book Room ID: ${room.id}`)}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" />
              </Box>
            )}
          </>
        )}
        <Divider sx={{ mt: 5, borderColor: "grey.300" }} />
      </Box>
    </Box>
  );
};

export default RoomsByCategory;