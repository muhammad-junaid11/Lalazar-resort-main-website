import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  Button, 
  useTheme, 
  CircularProgress, 
  Pagination, 
  Divider,
  Chip 
} from "@mui/material";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase"; // Your Firebase path

const getRoomData = async () => {
  const roomsSnapshot = await getDocs(collection(db, "rooms"));
  const categoryMap = {};

  const roomsPromises = roomsSnapshot.docs.map(async (roomDoc) => {
    const data = roomDoc.data();
    const roomId = roomDoc.id;
    const categoryId = data.categoryId;

    let categoryName = "N/A";

    if (categoryMap[categoryId]) {
      categoryName = categoryMap[categoryId];
    } else {
      const categoryRef = doc(db, "roomCategory", categoryId);
      const categorySnap = await getDoc(categoryRef);
      if (categorySnap.exists()) {
        categoryName = categorySnap.data().categoryName;
        categoryMap[categoryId] = categoryName;
      }
    }

    return {
      id: roomId,
      categoryName,
      price: data.price,
      image: data.image || "https://via.placeholder.com/300x220",
    };
  });

  return Promise.all(roomsPromises);
};

const AllRooms = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await getRoomData();
        setRooms(fetchedRooms);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load rooms. Check your network or database connection.");
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
      <CircularProgress color="secondary" />
      <Typography sx={{ ml: 2, color: "text.secondary" }}>
        Loading available rooms...
      </Typography>
    </Box>
  );

  if (error) return (
    <Typography color="error" align="center" sx={{ p: 5 }}>
      {error}
    </Typography>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 1300, mx: "auto" }}>
      <Grid container spacing={3} justifyContent="center">
        {currentRooms.map((room) => (
          <Grid key={room.id} size={{xs:12,sm:6,md:3}}>
            <Card
              sx={{
                width: "100%",
                height: 350, // fixed height for all cards
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
                height="180" // fixed height
                image={room.image}
                alt={room.categoryName}
                sx={{ objectFit: "cover" }}
              />
              <Box sx={{ p: 2, flexGrow: 1, textAlign: "center" }}>
                <Chip 
                  label={room.categoryName} 
                  variant="outlined" 
                  color="secondary" 
                  sx={{ mb: 1, fontWeight: "bold" }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ fontWeight: 700, mb: 2, color: theme.palette.secondary.main }}
                >
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
      <Divider sx={{ mt: 5, borderColor: "grey.300" }} />
    </Box>
  );
};

export default AllRooms;
