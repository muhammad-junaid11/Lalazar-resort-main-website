import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Card, CardMedia, CardContent,
  Button, useTheme, CircularProgress, Pagination, Divider, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/Firebase/Firebase";
import { fetchAllRooms } from "../../services/dbServices/RoomService";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const amenityIcons = {
  wifi: { icon: WifiIcon, label: "WiFi" },
  pool: { icon: PoolIcon, label: "Pool" },
  parking: { icon: LocalParkingIcon, label: "Parking" },
  breakfast: { icon: RestaurantIcon, label: "Breakfast" },
  gym: { icon: FitnessCenterIcon, label: "Gym" },
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
        const roomsData = await fetchAllRooms();
        setRooms(roomsData);
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
    const url = `/book?roomId=${room.id}&categoryId=${room.categoryId}&cityId=${room.cityId}`;
    if (!auth.currentUser) {
      localStorage.setItem("redirectAfterLogin", url);
      navigate("/signin");
    } else {
      navigate(url);
    }
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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} justifyContent="center">
        {currentRooms.map((room) => (
          <Grid key={room.id} size={{xs:!2,sm:6,md:6,lg:3}}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, overflow: "hidden",
                        transition: "transform 0.3s, box-shadow 0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: "0px 6px 20px rgba(0,0,0,0.1)" }}}>
              <CardMedia component="img" height="160" image={room.image} alt={room.name} sx={{ objectFit: "cover" }} />
              <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 2.2 } }}>
                <Chip label={room.categoryName} size="small" variant="outlined" sx={{ mb: 1, color: theme.palette.secondary.main, borderColor: theme.palette.secondary.main, fontWeight: "bold", fontSize: { xs: 10, sm: 11, md: 12 }}} />
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <HotelIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">{room.hotelName}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">{room.cityName}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MonetizationOnIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">PKR {room.price.toLocaleString()} per night</Typography>
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
                  <Button variant="outlined" color="secondary" onClick={() => handleBookNow(room)} sx={{ fontWeight: "bold", px: { xs: 1, sm: 1.5 }, py: { xs: 0.8, sm: 1 }, borderRadius: 2, textTransform: "none", fontSize: { xs: 12, sm: 13 }}}>
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} color="secondary" />
        </Box>
      )}

      <Divider sx={{ mt: 5 }} />
    </Box>
  );
};

export default AllRooms;
