import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  Pagination,
  Divider,
  Chip,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";
import HeroSection from "../../components/HeroSection";
import { auth } from "../../services/Firebase/Firebase";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import familyImg from "../../assets/Familyr.webp";
import luxuryImg from "../../assets/Luxuryr.webp";
import deluxeImg from "../../assets/Deluxer.webp";
import executiveImg from "../../assets/Executiver.webp";

const amenityIcons = {
  wifi: { icon: WifiIcon, label: "WiFi" },
  pool: { icon: PoolIcon, label: "Pool" },
  parking: { icon: LocalParkingIcon, label: "Parking" },
  breakfast: { icon: RestaurantIcon, label: "Breakfast" },
  gym: { icon: FitnessCenterIcon, label: "Gym" },
};

const categoryImages = {
  "family-room": familyImg,
  "luxury-room": luxuryImg,
  "deluxe-room": deluxeImg,
  "executive-room": executiveImg,
};

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const fetchRoomsByCategory = async (categorySlug) => {
  const roomsSnapshot = await getDocs(collection(db, "rooms"));
  const hotelsSnapshot = await getDocs(collection(db, "hotel"));
  const citiesSnapshot = await getDocs(collection(db, "city"));
  const categoriesSnapshot = await getDocs(collection(db, "roomCategory"));

  const hotelMap = {};
  hotelsSnapshot.docs.forEach((doc) => {
    hotelMap[doc.id] = {
      name: doc.data().hotelName,
      cityId: doc.data().cityId,
    };
  });

  const cityMap = {};
  citiesSnapshot.docs.forEach((doc) => {
    cityMap[doc.id] = doc.data().cityName;
  });

  const categoryMap = {};
  categoriesSnapshot.docs.forEach((doc) => {
    categoryMap[doc.id] = doc.data().categoryName;
  });

  const roomsPromises = roomsSnapshot.docs.map(async (roomDoc) => {
    const data = roomDoc.data();
    const roomId = roomDoc.id;

    const hotelInfo = hotelMap[data.hotelId] || {
      name: "Unknown Hotel",
      cityId: null,
    };
    const cityName = cityMap[hotelInfo.cityId] || "Unknown City";
    const categoryName = categoryMap[data.categoryId] || "Category";

    if (toSlug(categoryName) === categorySlug.toLowerCase()) {
      return {
        id: roomId,
        name: data.roomName || categoryName,
        categoryId: data.categoryId,
        hotelId: data.hotelId,
        categoryName,
        hotelName: hotelInfo.name,
        cityName,
        cityId: hotelInfo.cityId,
        price: data.price || 0,
        image: data.image || "https://via.placeholder.com/400x300",
        amenities: data.amenities || [],
      };
    }
    return null;
  });

  return (await Promise.all(roomsPromises)).filter(Boolean);
};

const RoomsByCategory = () => {
  const { categoryName } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCategoryName, setDisplayCategoryName] = useState(
    capitalizeWords(categoryName.replace(/-/g, " "))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const heroImage =
    categoryImages[categoryName.toLowerCase()] ||
    "https://via.placeholder.com/1400x400";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const fetchedRooms = await fetchRoomsByCategory(categoryName);
        setRooms(fetchedRooms);

        if (fetchedRooms.length > 0) {
          setDisplayCategoryName(capitalizeWords(fetchedRooms[0].categoryName));
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

  const handleBookNow = (room) => {
    if (!auth.currentUser) {
      // Save redirect in localStorage
      localStorage.setItem(
        "redirectAfterLogin",
        `/book?roomId=${room.id}&categoryId=${room.categoryId}&cityId=${room.cityId}`
      );
      navigate("/signin");
    } else {
      navigate(
        `/book?roomId=${room.id}&categoryId=${room.categoryId}&cityId=${room.cityId}`
      );
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentRooms = rooms.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  return (
    <Box>
      <HeroSection
        subtitle="Gallery"
        title={displayCategoryName}
        bgImage={heroImage}
        appBarColor="transparent"
      />

      <Box sx={{ p: 4, maxWidth: 1300, mx: "auto" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 5,
              minHeight: "60vh",
            }}
          >
            <CircularProgress color="secondary" />
            <Typography sx={{ ml: 2, color: "text.secondary" }}>
              Loading {displayCategoryName} rooms...
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
            <Grid container spacing={3} justifyContent="center">
              {currentRooms.map((room) => (
                <Grid key={room.id} item xs={12} md={6} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={room.image}
                      alt={room.name}
                      sx={{ objectFit: "cover" }}
                    />

                    <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 2.2 } }}>
                      <Chip
                        label={room.categoryName}
                        size="small"
                        variant="outlined"
                        sx={{
                          mb: 1,
                          color: theme.palette.secondary.main,
                          borderColor: theme.palette.secondary.main,
                          fontWeight: "bold",
                          fontSize: { xs: 10, sm: 11, md: 12 }
                        }}
                      />

                      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                        <HotelIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 13 } }}>{room.hotelName}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 13 } }}>{room.cityName}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <MonetizationOnIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 13 } }}>PKR {room.price.toLocaleString()} per night</Typography>
                      </Box>

                      {room.amenities.length > 0 && (
                        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                          {room.amenities.slice(0, 4).map((amenity, index) => {
                            const key = amenity.toLowerCase();
                            const data = amenityIcons[key];
                            const Icon = data?.icon;
                            return Icon ? (
                              <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.5, bgcolor: "rgba(0,0,0,0.03)", borderRadius: 1 }}>
                                <Icon sx={{ fontSize: { xs: 14, sm: 16 }, color: theme.palette.secondary.main }} />
                                <Typography variant="caption" sx={{ fontSize: { xs: 9, sm: 10 } }}>{data.label}</Typography>
                              </Box>
                            ) : null;
                          })}
                        </Box>
                      )}

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          onClick={() => handleBookNow(room)} 
                          sx={{ fontWeight: "bold", px: { xs: 1, sm: 1.5 }, py: { xs: 0.8, sm: 1 }, borderRadius: 2, textTransform: "none", fontSize: { xs: 12, sm: 13 } }}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="secondary"
                />
              </Box>
            )}
          </>
        )}
        <Divider sx={{ mt: 5 }} />
      </Box>
    </Box>
  );
};

export default RoomsByCategory;
