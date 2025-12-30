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
import { useForm } from "react-hook-form";
import RHFformProvider from "../../components/Form/RHFformProvider";
import TextFieldInput from "../../components/Form/TextFieldInput";
import SelectInput from "../../components/Form/SelectInput";
import toast from "react-hot-toast";
import { fetchCategories } from "../../services/dbServices/CategoryService";
import { fetchAvailableRooms, fetchRoomsByIds } from "../../services/dbServices/RoomService";

const useFetchRooms = (selectedCategoryId, selectedCityId, checkInDate, checkOutDate) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (!selectedCategoryId || !selectedCityId || !checkInDate || !checkOutDate) {
      setRooms([]);
      setLoading(false);
      return;
    }

    const loadRooms = async () => {
      try {
        const availableRooms = await fetchAvailableRooms(
          selectedCategoryId,
          selectedCityId,
          checkInDate,
          checkOutDate
        );
        setRooms(availableRooms);
      } catch (err) {
        console.error("Error loading rooms:", err);
        setError("Error loading rooms.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
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
  const [preselectedRoomsFetched, setPreselectedRoomsFetched] = useState(false);

  const { rooms: fetchedRooms, loading, error } = useFetchRooms(
    selectedCategoryId,
    selectedCityId,
    checkInDate,
    checkOutDate
  );

  const methods = useForm({
    defaultValues: { search: "", roomCategorySelect: selectedCategoryId || "" },
  });

  const { watch, control } = methods;
  const filters = watch();


  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      const formattedCats = cats.map(c => ({ label: c.categoryName, value: c.id }));
      setRoomOptions(formattedCats);
      if (!selectedCategoryId && formattedCats.length > 0) {
        setSelectedCategoryId(formattedCats[0].value);
      }
    };
    loadCategories();
  }, []);


  useEffect(() => {
    const fetchPreselectedRoomData = async () => {
      if (preselectedRoomsFetched) return;

      if (selectedRooms.length > 0) {
        const needsFetch = selectedRooms.some(r => !r.price || r.price === undefined);

        if (needsFetch) {
          try {
            const roomIds = selectedRooms.map(r => r.id);
            const fetchedData = await fetchRoomsByIds(roomIds);

            if (fetchedData && fetchedData.length > 0) {
              const allRooms = await import("../../services/dbServices/RoomService").then(m => m.fetchAllRooms());
              const enrichedRooms = fetchedData.map(fetchedRoom => {
                const fullRoom = allRooms.find(r => r.id === fetchedRoom.id);
                return fullRoom || fetchedRoom;
              });
              setSelectedRooms(enrichedRooms);
            }
          } catch (err) {
            console.error("Error fetching preselected rooms:", err);
            toast.error("Failed to load preselected room details");
          }
        }
      }

      setPreselectedRoomsFetched(true);
    };

    fetchPreselectedRoomData();
  }, [selectedRooms.length, preselectedRoomsFetched]);

  useEffect(() => {
    setSelectedCategoryId(filters.roomCategorySelect);
  }, [filters.roomCategorySelect]);


  const filteredRooms = useMemo(() => {
    if (!filters.search) return fetchedRooms;
    const s = filters.search.toLowerCase();
    return fetchedRooms.filter(
      r => r.title?.toLowerCase().includes(s) || r.hotelName?.toLowerCase().includes(s)
    );
  }, [filters.search, fetchedRooms]);

  const toggleRoomSelection = room => {
    const isSelected = selectedRooms.find(r => r.id === room.id);
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter(r => r.id !== room.id));
    } else {
      if (selectedRooms.length < maxRooms) {
        const roomWithAllData = {
          id: room.id,
          title: room.title,
          hotelName: room.hotelName,
          cityName: room.cityName,
          price: room.price,
          image: room.image,
          categoryId: room.categoryId,
          cityId: room.cityId,
          categoryName: room.categoryName,
          hotelId: room.hotelId,
          amenities: room.amenities || []
        };
        setSelectedRooms([...selectedRooms, roomWithAllData]);
      } else {
        toast.error(`You can only select ${maxRooms} room(s).`);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Grid container spacing={2}>
          {[1, 2, 3].map(i => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ display: "flex", height: 160, p: 1 }}>
                <Skeleton variant="rectangular" width={150} height={140} sx={{ borderRadius: 1 }} />
                <Box
                  sx={{
                    flex: 1,
                    pl: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
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
        {filteredRooms.map(room => {
          const isSelected = selectedRooms.some(r => r.id === room.id);
          return (
            <Grid item xs={12} md={4} key={room.id}>
              <Card
                sx={{
                  display: "flex",
                  height: 160,
                  p: 1,
                  position: "relative",
                  borderRadius: 1,
                  border: isSelected ? `2px solid ${theme.palette.secondary.main}` : "1px solid #ddd",

                }}
              >
                <CardMedia
                  component="img"
                  image={room.image}
                  sx={{ width: 150, borderRadius: 1, objectFit: "cover" }}
                />
                <Box
                  sx={{
                    flex: 1,
                    pl: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    zIndex: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                      {room.title}
                    </Typography>
                    <Typography sx={{ opacity: 0.7, fontSize: "0.8rem" }}>{room.hotelName}</Typography>
                    <Typography
                      sx={{ color: theme.palette.secondary.main, fontWeight: 600, mt: 1 }}
                    >
                      PKR {room.price}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{ width: "100px" }}
                    onClick={() => toggleRoomSelection(room)}
                  >
                    {isSelected ? "Selected" : "Book"}
                  </Button>
                </Box>
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: `${theme.palette.secondary.main}12`,
                      zIndex: 1,
                    }}
                  />
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
          <TextFieldInput
            name="search"
            control={control}
            placeholder="Search by hotel"
            sx={{ width: 200 }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{ color: filters.search ? theme.palette.secondary.main : "grey.500", mr: 1 }}
                />
              ),
            }}
          />
          <Box sx={{ width: 220 }}>
            <SelectInput
              name="roomCategorySelect"
              label="Room Category"
              control={control}
              options={roomOptions}
            />
          </Box>
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            borderBottom: `4px solid ${theme.palette.secondary.main}`,
            pb: 1,
            width: "fit-content",
          }}
        >
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
