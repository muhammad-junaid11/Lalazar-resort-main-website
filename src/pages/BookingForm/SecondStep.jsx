import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  useTheme,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { useForm } from "react-hook-form";
import RHFformProvider from "../../components/Form/RHFformProvider";
import TextFieldInput from "../../components/Form/TextFieldInput";
import CheckboxInput from "../../components/Form/CheckboxInput";

const rooms = [
  { id: 1, title: "Shogran", hotel: "Jamnu Bagh", price: 250, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", amenities: ["wifi", "pool", "breakfast"] },
  { id: 2, title: "Naran", hotel: "5 star hotel", price: 180, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", amenities: ["parking", "wifi"] },
  { id: 3, title: "Urban Loft", hotel: "The Artline", price: 300, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", amenities: ["gym", "wifi", "breakfast"] },
];

const amenityIcons = { wifi: WifiIcon, pool: PoolIcon, parking: LocalParkingIcon, breakfast: RestaurantIcon, gym: FitnessCenterIcon };

export const SecondStep = ({ selectedRoom, setSelectedRoom }) => {
  const theme = useTheme();
  const methods = useForm({ defaultValues: { search: "", priceRange: [null, null], amenities: {} } });
  const { watch } = methods;
  const filters = watch();

  const [priceOpen, setPriceOpen] = useState(false);
  const priceRef = useRef(null);

  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const amenitiesRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (priceRef.current && !priceRef.current.contains(event.target)) setPriceOpen(false);
      if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) setAmenitiesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [minPrice, maxPrice] = filters.priceRange;

  // Compute available amenities dynamically
  const availableAmenities = useMemo(() => {
    const amenitiesSet = new Set();
    rooms
      .filter(r => (minPrice == null || r.price >= minPrice) && (maxPrice == null || r.price <= maxPrice))
      .forEach(r => r.amenities.forEach(a => amenitiesSet.add(a)));
    return Array.from(amenitiesSet);
  }, [minPrice, maxPrice]);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    let result = rooms;
    result = result.filter(r => (minPrice == null || r.price >= minPrice) && (maxPrice == null || r.price <= maxPrice));
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(s) || r.hotel.toLowerCase().includes(s));
    }
    const selectedAmenities = Object.keys(filters.amenities).filter(key => filters.amenities[key]);
    if (selectedAmenities.length > 0) {
      result = result.filter(r => selectedAmenities.every(a => r.amenities.includes(a)));
    }
    return result;
  }, [filters, minPrice, maxPrice]);

  return (
    <RHFformProvider methods={methods}>
      <Box sx={{ maxWidth: 1320, mx: "auto" }}>
        {/* FILTER BAR */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4, alignItems: "center" }}>
          {/* Search */}
          <TextFieldInput
            name="search"
            control={methods.control}
            placeholder="Search by hotel name"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: filters.search ? theme.palette.secondary.main : "grey.500" }} />,
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: filters.search ? theme.palette.secondary.main : "#ccc",
                },
              },
            }}
            sx={{ width: 200, minWidth: 200 }}
          />

          {/* Price Range */}
          <ClickAwayListener onClickAway={() => setPriceOpen(false)}>
            <Box ref={priceRef} sx={{ width: 200, minWidth: 200, position: "relative" }}>
              <Box
                onClick={() => setPriceOpen(prev => !prev)}
                sx={{
                  border: `1px solid ${priceOpen ? theme.palette.secondary.main : "#ccc"}`,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  minHeight: 40,
                  alignItems: "center",
                }}
              >
                <span>{minPrice != null || maxPrice != null ? `$${minPrice ?? ""} - $${maxPrice ?? ""}` : "Price range"}</span>
              </Box>

              {priceOpen && (
                <Box sx={{ position: "absolute", top: "100%", left: 0, right: 0, mt: 1, p: 1, bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 1, zIndex: 10, display: "flex", gap: 1 }}>
                  <TextFieldInput name="priceRange.0" control={methods.control} placeholder="Min" type="number" sx={{ flex: 1 }} />
                  <TextFieldInput name="priceRange.1" control={methods.control} placeholder="Max" type="number" sx={{ flex: 1 }} />
                </Box>
              )}
            </Box>
          </ClickAwayListener>

          {/* Amenities Dropdown */}
          <ClickAwayListener onClickAway={() => setAmenitiesOpen(false)}>
            <Box ref={amenitiesRef} sx={{ width: 300, minWidth: 200, position: "relative" }}>
              <Box
                onClick={() => setAmenitiesOpen(prev => !prev)}
                sx={{
                  border: `1px solid ${Object.values(filters.amenities).some(v => v) || amenitiesOpen ? theme.palette.secondary.main : "#ccc"}`,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  cursor: "pointer",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                  color: Object.values(filters.amenities).some(v => v) ? theme.palette.secondary.main : "text.secondary",
                }}
              >
                Choose amenities
              </Box>
              {amenitiesOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    mt: 1,
                    p: 1,
                    bgcolor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    zIndex: 10,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {availableAmenities.map(a => (
                    <CheckboxInput
                      key={a}
                      name={`amenities.${a}`}
                      control={methods.control}
                      label={a.charAt(0).toUpperCase() + a.slice(1)}
                      sx={{
                        "& .Mui-checked": {
                          color: theme.palette.secondary.main,
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </ClickAwayListener>
        </Box>

        {/* ROOMS LIST */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
          Available Rooms ({filteredRooms.length})
        </Typography>

        <Grid container spacing={2}>
          {filteredRooms.map(room => (
            <Grid key={room.id} item size={{xs:12}}>
              <Card
                sx={{
                  display: "flex",
                  height: 210,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: selectedRoom?.id === room.id ? `3px solid ${theme.palette.secondary.main}` : "2px solid #eee",
                  transition: "0.3s",
                }}
              >
                <CardMedia component="img" image={room.image} sx={{ width: 260, objectFit: "cover" }} />
                <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>{room.title}</Typography>
                    <Typography sx={{ opacity: 0.7, mt: 0.5 }}>{room.hotel}</Typography>
                    <Typography sx={{ color: theme.palette.secondary.main, fontWeight: "bold", fontSize: "1.6rem", mt: 2 }}>${room.price}/night</Typography>
                  </Box>

                  {/* Amenities + Book Now inline */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {room.amenities.map(a => {
                        const Icon = amenityIcons[a];
                        return (
                          <Box key={a} sx={{ p: "3px 10px", bgcolor: theme.palette.secondary.light, borderRadius: "20px", display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Icon sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: 12 }}>{a.charAt(0).toUpperCase() + a.slice(1)}</Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ fontWeight: "bold", px: 2, py: 0.7 }}
                      onClick={() => setSelectedRoom(room)}
                    >
                      {selectedRoom?.id === room.id ? "Selected" : "Book Now"}
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </RHFformProvider>
  );
};

export default SecondStep;
