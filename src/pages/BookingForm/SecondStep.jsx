import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  useTheme,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";
import { useForm } from "react-hook-form";
import RHFformProvider from "../../components/Form/RHFformProvider";
import TextFieldInput from "../../components/Form/TextFieldInput";
import SelectInput from "../../components/Form/SelectInput";
import toast from "react-hot-toast";

// ------------------------------------------------------
// Fetch rooms hook (Corrected Loading Logic)
// ------------------------------------------------------
const useFetchRooms = (selectedCategoryId, selectedCityId, checkInDate, checkOutDate) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // Always start true
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset loading state whenever inputs change
    setLoading(true);

    if (!selectedCategoryId || !selectedCityId || !checkInDate || !checkOutDate) {
      setRooms([]);
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      setError(null);
      try {
        const catRef = doc(db, "roomCategory", selectedCategoryId);
        const catSnap = await getDoc(catRef);
        const foundCategoryName = catSnap.exists() ? catSnap.data().categoryName : "Room";

        const hotelSnapshot = await getDocs(collection(db, "hotel"));
        const hotelMap = {};
        hotelSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.cityId === selectedCityId) hotelMap[doc.id] = data.hotelName;
        });

        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        let fetchedRoomsData = roomsSnapshot.docs
          .filter((doc) => doc.data().categoryId === selectedCategoryId && hotelMap[doc.data().hotelId])
          .map((roomDoc) => {
            const data = roomDoc.data();
            return {
              id: roomDoc.id,
              title: data.roomName || foundCategoryName,
              hotel: hotelMap[data.hotelId] || "Hotel",
              price: data.price || 0,
              image: data.image || "https://via.placeholder.com/300x220",
            };
          });

        const bookingSnap = await getDocs(query(collection(db, "bookings"), where("status", "==", "Confirmed")));
        const userStart = new Date(checkInDate);
        const userEnd = new Date(checkOutDate);
        const bookedRoomIds = new Set();

        bookingSnap.docs.forEach((doc) => {
          const data = doc.data();
          const bStart = new Date(data.checkInDate.seconds * 1000);
          const bEnd = new Date(data.checkOutDate.seconds * 1000);
          if (userStart < bEnd && userEnd > bStart) {
            if (Array.isArray(data.roomId)) data.roomId.forEach((r) => bookedRoomIds.add(r));
            else bookedRoomIds.add(data.roomId);
          }
        });

        setRooms(fetchedRoomsData.filter((room) => !bookedRoomIds.has(room.id)));
      } catch (err) {
        setError("Error loading rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [selectedCategoryId, selectedCityId, checkInDate, checkOutDate]);

  return { rooms, loading, error };
};

const SecondStep = ({
  selectedRooms,
  setSelectedRooms,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedCityId,
  maxRooms,
  checkInDate,
  checkOutDate,
}) => {
  const theme = useTheme();
  const [roomOptions, setRoomOptions] = useState([]);
  const { rooms: fetchedRooms, loading, error } = useFetchRooms(selectedCategoryId, selectedCityId, checkInDate, checkOutDate);

  const methods = useForm({
    defaultValues: { search: "", roomCategorySelect: selectedCategoryId || "" },
  });

  const { watch, control, setValue } = methods;
  const filters = watch();

  useEffect(() => {
    const fetchCats = async () => {
      const snap = await getDocs(collection(db, "roomCategory"));
      const cats = snap.docs.map((d) => ({ label: d.data().categoryName, value: d.id }));
      setRoomOptions(cats);
      if (!selectedCategoryId && cats.length > 0) setSelectedCategoryId(cats[0].value);
    };
    fetchCats();
  }, []);

  useEffect(() => { setSelectedCategoryId(filters.roomCategorySelect); }, [filters.roomCategorySelect]);

  const filteredRooms = useMemo(() => {
    if (!filters.search) return fetchedRooms;
    const s = filters.search.toLowerCase();
    return fetchedRooms.filter(r => r.title.toLowerCase().includes(s) || r.hotel.toLowerCase().includes(s));
  }, [filters.search, fetchedRooms]);

  const toggleRoomSelection = (room) => {
    const isSelected = selectedRooms.find((r) => r.id === room.id);
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter((r) => r.id !== room.id));
    } else {
      if (selectedRooms.length < maxRooms) {
        setSelectedRooms([...selectedRooms, room]);
      } else {
        toast.error(`Rooms has already been chosen.`);
      }
    }
  };

  // ------------------------------------------------------
  // RENDER LOGIC (Corrected Priority)
  // ------------------------------------------------------
  const renderContent = () => {
    if (loading) {
      return (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid size={{xs:12,md:4}} key={i}>
              <Card sx={{ display: "flex", height: 160, p: 1 }}>
                <Skeleton variant="rectangular" width={150} height={140} sx={{ borderRadius: 1 }} />
                <Box sx={{ flex: 1, pl: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rectangular" width={100} height={30} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (error) return <Typography color="error">{error}</Typography>;

    if (fetchedRooms.length === 0) return <Typography>No rooms available for these dates.</Typography>;

    if (filteredRooms.length === 0) return <Typography>No rooms match the filters.</Typography>;

    return (
      <Grid container spacing={2}>
        {filteredRooms.map((room) => {
          const isSelected = selectedRooms.some((r) => r.id === room.id);
          return (
            <Grid size={{xs:12,md:4}} key={room.id}>
              <Card
                sx={{
                  display: "flex",
                  height: 160,
                  p: 1,
                  position: "relative",
                  borderRadius: 1,
                  border: isSelected ? `2px solid ${theme.palette.secondary.main}` : "1px solid #ddd",
                  transition: "all 0.3s ease",
                }}
              >
                <CardMedia component="img" image={room.image} sx={{ width: 150, borderRadius: 1, objectFit: "cover" }} />
                <Box sx={{ flex: 1, pl: 2, display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>{room.title}</Typography>
                    <Typography sx={{ opacity: 0.7, fontSize: "0.8rem" }}>{room.hotel}</Typography>
                    <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 600, mt: 1 }}>PKR {room.price}</Typography>
                  </Box>
                  <Button variant="outlined" color="secondary" size="small" sx={{ width: "100px" }} onClick={() => toggleRoomSelection(room)}>
                    {isSelected ? "Selected" : "Book"}
                  </Button>
                </Box>
                {isSelected && (
                  <Box sx={{ position: "absolute", inset: 0, bgcolor: `${theme.palette.secondary.main}12`, zIndex: 1 }} />
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <RHFformProvider methods={methods}>
      <Box sx={{ maxWidth: 1320, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextFieldInput name="search" control={control} placeholder="Search by hotel" sx={{ width: 200 }} 
            InputProps={{ startAdornment: <SearchIcon sx={{ color: filters.search ? theme.palette.secondary.main : "grey.500", mr: 1 }} /> }} 
          />
          <Box sx={{ width: 220 }}>
            <SelectInput name="roomCategorySelect" label="Room Category" control={control} options={roomOptions} />
          </Box>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
          Available Rooms
        </Typography>

        {renderContent()}

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>
          Selected Rooms: {selectedRooms.length} / {maxRooms}
        </Typography>
      </Box>
    </RHFformProvider>
  );
};

export default SecondStep;