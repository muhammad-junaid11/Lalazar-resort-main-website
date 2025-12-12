import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Button, 
  useTheme, 
  CircularProgress, 
  Pagination, 
  Divider,
  Chip,
} from "@mui/material";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useNavigate } from "react-router-dom";

const amenityIcons = {
  wifi: { icon: WifiIcon, label: "WiFi" },
  pool: { icon: PoolIcon, label: "Pool" },
  parking: { icon: LocalParkingIcon, label: "Parking" },
  breakfast: { icon: RestaurantIcon, label: "Breakfast" },
  gym: { icon: FitnessCenterIcon, label: "Gym" },
};

const getRoomData = async () => {
  const roomsSnapshot = await getDocs(collection(db, "rooms"));
  const hotelsSnapshot = await getDocs(collection(db, "hotel"));
  const citiesSnapshot = await getDocs(collection(db, "city"));
  const categoriesSnapshot = await getDocs(collection(db, "roomCategory"));

  const hotelMap = {};
  hotelsSnapshot.docs.forEach(doc => {
    hotelMap[doc.id] = { 
      name: doc.data().hotelName, 
      cityId: doc.data().cityId 
    };
  });

  const categoryMap = {};
  categoriesSnapshot.docs.forEach(doc => {
    categoryMap[doc.id] = doc.data().categoryName;
  });

  const cityMap = {};
  citiesSnapshot.docs.forEach(doc => {
    cityMap[doc.id] = doc.data().cityName;
  });

  const roomsPromises = roomsSnapshot.docs.map(async (roomDoc) => {
    const data = roomDoc.data();
    const roomId = roomDoc.id;

    const hotelInfo = hotelMap[data.hotelId] || { name: "Unknown Hotel", cityId: null };
    const cityName = cityMap[hotelInfo.cityId] || "Unknown City";

    return {
      id: roomId,
      name: data.roomName || categoryMap[data.categoryId] || "Room",
      categoryId: data.categoryId,
      hotelId: data.hotelId,
      categoryName: categoryMap[data.categoryId] || "Category",
      hotelName: hotelInfo.name,
      cityName,
      cityId: hotelInfo.cityId,
      price: data.price || 0,
      image: data.image || "https://via.placeholder.com/400x300",
      amenities: data.amenities || [],
    };
  });

  return Promise.all(roomsPromises);
};

const AllRooms = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await getRoomData();
        setRooms(fetchedRooms);
      } catch (err) {
        console.error(err);
        setError("Failed to load rooms. Check your network or database connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBookNow = (room) => {
    navigate(`/book?roomId=${room.id}&categoryId=${room.categoryId}&cityId=${room.cityId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentRooms = rooms.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 5, minHeight: "60vh" }}>
      <CircularProgress color="secondary" />
      <Typography sx={{ ml: 2, color: "text.secondary" }}>Loading available rooms...</Typography>
    </Box>
  );

  if (error) return (
    <Typography color="error" align="center" sx={{ p: 5 }}>{error}</Typography>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 1300, mx: "auto" }}>
      <Grid container spacing={3} justifyContent="center">
        {currentRooms.map((room) => (
          <Grid size={{xs:12,md:6,lg:3}} key={room.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia component="img" height="180" image={room.image} alt={room.name} sx={{ objectFit: "cover" }} />

              <CardContent sx={{ flexGrow: 1, p: 2.2 }}>
                <Chip label={room.categoryName} size="small" sx={{ mb: 1, bgcolor: theme.palette.secondary.main, color: "white", fontWeight: "bold" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {room.name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <HotelIcon sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">{room.hotelName}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">{room.cityName}</Typography>
                </Box>

                {room.amenities.length > 0 && (
                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    {room.amenities.slice(0, 4).map((amenity, index) => {
                      const key = amenity.toLowerCase();
                      const data = amenityIcons[key];
                      const Icon = data?.icon;
                      return Icon ? (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.5, bgcolor: "rgba(0,0,0,0.05)", borderRadius: 1 }}>
                          <Icon sx={{ fontSize: 16, color: theme.palette.secondary.main }} />
                          <Typography variant="caption">{data.label}</Typography>
                        </Box>
                      ) : null;
                    })}
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
                      PKR {room.price.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">per night</Typography>
                  </Box>

                  <Button variant="contained" color="secondary" onClick={() => handleBookNow(room)} sx={{ fontWeight: "bold", px: 2, py: 1, borderRadius: 2, textTransform: "none" }}>
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
          <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} color="secondary" />
        </Box>
      )}

      <Divider sx={{ mt: 5 }} />
    </Box>
  );
};

export default AllRooms;
