import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";

import { useForm } from "react-hook-form";
import RHFformProvider from "../../components/Form/RHFformProvider";
import TextFieldInput from "../../components/Form/TextFieldInput";
import SelectInput from "../../components/Form/SelectInput";

const amenityIcons = {
  wifi: WifiIcon,
  pool: PoolIcon,
  parking: LocalParkingIcon,
  breakfast: RestaurantIcon,
  gym: FitnessCenterIcon,
};

// ------------------------------------------------------
// Check overlap function
// ------------------------------------------------------
const isOverlapping = (userStart, userEnd, bookedStart, bookedEnd) => {
  return userStart < bookedEnd && userEnd > bookedStart;
};

// ------------------------------------------------------
// Fetch rooms hook
// ------------------------------------------------------
const useFetchRooms = (selectedCategoryId, selectedCityId, checkInDate, checkOutDate) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCategoryId || !selectedCityId) {
      setRooms([]);
      return;
    }
    if (!checkInDate || !checkOutDate) return;

    const fetchRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Fetch category name
        const catRef = doc(db, "roomCategory", selectedCategoryId);
        const catSnap = await getDoc(catRef);
        const foundCategoryName = catSnap.exists()
          ? catSnap.data().categoryName
          : "Selected Category";

        // 2) Fetch hotels in selected city
        const hotelSnapshot = await getDocs(collection(db, "hotel"));
        const hotelMap = {};
        hotelSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.cityId === selectedCityId) hotelMap[doc.id] = data.hotelName;
        });

        // 3) Fetch rooms
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        let fetchedRoomsData = roomsSnapshot.docs
          .filter(
            (doc) =>
              doc.data().categoryId === selectedCategoryId &&
              hotelMap[doc.data().hotelId]
          )
          .map((roomDoc) => {
            const data = roomDoc.data();
            return {
              id: roomDoc.id,
              title: data.roomName || foundCategoryName,
              hotelId: data.hotelId,
              hotel: hotelMap[data.hotelId] || "Hotel Not Found",
              price: data.price || 0,
              image: data.image || "https://via.placeholder.com/300x220",
              amenities: data.amenities || [],
            };
          });

        // 4) Remove booked rooms
        const bookingSnap = await getDocs(
          query(collection(db, "bookings"), where("status", "==", "Confirmed"))
        );

        const userStart = new Date(checkInDate);
        const userEnd = new Date(checkOutDate);

        const bookedRoomIds = new Set();

        bookingSnap.docs.forEach((doc) => {
          const data = doc.data();
          const bookedStart = new Date(data.checkInDate.seconds * 1000);
          const bookedEnd = new Date(data.checkOutDate.seconds * 1000);

          if (isOverlapping(userStart, userEnd, bookedStart, bookedEnd)) {
            if (Array.isArray(data.roomId)) {
              data.roomId.forEach((r) => bookedRoomIds.add(r));
            } else {
              bookedRoomIds.add(data.roomId);
            }
          }
        });

        fetchedRoomsData = fetchedRoomsData.filter(
          (room) => !bookedRoomIds.has(room.id)
        );

        setRooms(fetchedRoomsData);
      } catch (err) {
        console.error("Error fetching rooms or bookings:", err);
        setError("Error loading rooms.");
        setRooms([]);
      }

      setLoading(false);
    };

    fetchRooms();
  }, [selectedCategoryId, selectedCityId, checkInDate, checkOutDate]);

  return { rooms, loading, error };
};

// ------------------------------------------------------
// SecondStep Component
// ------------------------------------------------------
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

  // Fetch room categories & set default to Deluxe
  useEffect(() => {
    const fetchRoomCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "roomCategory"));
        const categories = snapshot.docs.map((doc) => ({
          label: doc.data().categoryName,
          value: doc.id,
        }));
        setRoomOptions(categories);

        if (!selectedCategoryId) {
          const deluxe = categories.find(
            (c) => c.label.toLowerCase() === "deluxe"
          );
          if (deluxe) {
            setSelectedCategoryId(deluxe.value);
          } else if (categories.length > 0) {
            setSelectedCategoryId(categories[0].value);
          }
        }
      } catch (err) {
        setRoomOptions([]);
      }
    };

    fetchRoomCategories();
  }, []);

  const { rooms: fetchedRooms, loading, error } = useFetchRooms(
    selectedCategoryId,
    selectedCityId,
    checkInDate,
    checkOutDate
  );

  const methods = useForm({
    defaultValues: {
      search: "",
      priceRange: ["", ""],
      roomCategorySelect: selectedCategoryId || "",
    },
  });

  const { watch, control, setValue } = methods;
  const filters = watch();

  useEffect(() => {
    setValue("roomCategorySelect", selectedCategoryId || "");
  }, [selectedCategoryId]);

  useEffect(() => {
    const cat = watch("roomCategorySelect") || null;
    setSelectedCategoryId(cat);
  }, [watch("roomCategorySelect")]);

  const [minPrice, maxPrice] = filters.priceRange.map((p) =>
    p !== "" ? parseFloat(p) : null
  );

  const filteredRooms = useMemo(() => {
    let result = fetchedRooms;
    if (minPrice != null) result = result.filter((r) => r.price >= minPrice);
    if (maxPrice != null) result = result.filter((r) => r.price <= maxPrice);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.hotel.toLowerCase().includes(s)
      );
    }
    return result;
  }, [filters, fetchedRooms]);

  const toggleRoomSelection = (room) => {
    const isSelected = selectedRooms.find((r) => r.id === room.id);
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter((r) => r.id !== room.id));
    } else {
      if (selectedRooms.length < maxRooms) {
        setSelectedRooms([...selectedRooms, room]);
      } else {
        alert(`You can select only ${maxRooms} room(s). Remove one to add another.`);
      }
    }
  };

  return (
    <RHFformProvider methods={methods}>
      <Box sx={{ maxWidth: 1320, mx: "auto" }}>
        {/* FILTER BAR */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4, alignItems: "center" }}>
          <TextFieldInput
            name="search"
            control={control}
            placeholder="Search by hotel"
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: filters.search ? theme.palette.secondary.main : "grey.500" }} />
              ),
            }}
            sx={{ width: 200, minWidth: 200 }}
          />

          <Box sx={{ width: 220, minWidth: 220 }}>
            <SelectInput
              name="roomCategorySelect"
              label="Room Category"
              control={control}
              options={roomOptions}
              value={selectedCategoryId || ""}
            />
          </Box>
        </Box>

        {/* ROOMS LIST */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
          Available Rooms ({filteredRooms.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", p: 5 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : filteredRooms.length === 0 ? (
          <Typography>No rooms found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredRooms.map((room) => (
              <Grid key={room.id} size={{xs:12,md:4}}>
                <Card sx={{ display: "flex", height: 160, borderRadius: 1, p: 1, border: selectedRooms.find((r) => r.id === room.id) ? `2px solid ${theme.palette.secondary.main}` : "1px solid #ddd" }}>
                  <CardMedia component="img" image={room.image} sx={{ width: 150, objectFit: "cover", borderRadius: 1 }} />
                  <Box sx={{ flex: 1, pl: 2, pr: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {room.title}
                      </Typography>
                      <Typography sx={{ opacity: 0.7, mt: 0.3, fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {room.hotel}
                      </Typography>
                      <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 600, fontSize: "1rem", mt: 1 }}>
                        PKR {room.price}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ width: "100px", fontSize: "0.75rem", p: "3px 6px", mt: 1 }}
                      onClick={() => toggleRoomSelection(room)}
                    >
                      {selectedRooms.find((r) => r.id === room.id) ? "Selected" : "Book"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>
          Selected Rooms: {selectedRooms.length} / {maxRooms}
        </Typography>
      </Box>
    </RHFformProvider>
  );
};

export default SecondStep;
