import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Popover,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PeopleIcon from "@mui/icons-material/People";

// 1. Helper function to calculate and format the display value
const getDisplayValue = (rooms) => {
  const numRooms = rooms.length;
  const numAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const numChildren = rooms.reduce((sum, room) => sum + room.children, 0);
  
  if (numRooms === 0) return "Select Guests";

  return `${numRooms} ROOMS • ${numAdults} ADULTS • ${numChildren} CHILDREN`;
};

const GuestsInput = ({ name, control, label, sx }) => {
  // State to control the visibility and position of the Popover
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Controller
      name={name}
      control={control}
      // Initialize with a default room structure
      defaultValue={[{ adults: 2, children: 0 }]} 
      render={({ field: { onChange, value } }) => (
        <Box sx={sx}>
          {/* Main Input Display (What the user clicks) */}
          <TextField
            label={label}
            value={getDisplayValue(value)} // Displays the summary
            onClick={handleClick}
            fullWidth
            readOnly
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Popover/Dropdown UI - The custom configuration panel */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Box sx={{ p: 2, minWidth: 350 }}>
              {/* --- Room Count Management --- */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Rooms
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (value.length > 1) {
                        onChange(value.slice(0, -1)); // Remove last room and update form value
                      }
                    }}
                    disabled={value.length === 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography component="span" sx={{ mx: 1, fontWeight: "bold" }}>
                    {value.length}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      // Add new room with default 2 adults
                      onChange([...value, { adults: 2, children: 0 }]); 
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Stack>
              <hr style={{ borderTop: "1px solid #ccc", borderBottom: "none" }} />

              {/* --- Individual Room Configuration Header --- */}
              <Stack direction="row" justifyContent="space-between" mt={2} mb={1}>
                <Typography sx={{ width: 60 }}></Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold", width: 100, textAlign: "center" }}>
                  Adults
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold", width: 100, textAlign: "center" }}>
                  Children
                </Typography>
              </Stack>

              {/* --- List of Rooms --- */}
              {value.map((room, index) => (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  my={1}
                  py={1}
                >
                  <Typography variant="body2" sx={{ width: 60, fontWeight: "bold" }}>
                    Room {index + 1}
                  </Typography>

                  {/* Adults Counter */}
                  <Stack direction="row" alignItems="center" sx={{ width: 100 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newRooms = [...value];
                        newRooms[index].adults = Math.max(1, room.adults - 1); // Min 1 adult
                        onChange(newRooms);
                      }}
                      disabled={room.adults === 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 0.5, width: 20, textAlign: "center" }}>
                      {room.adults}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newRooms = [...value];
                        newRooms[index].adults = room.adults + 1;
                        onChange(newRooms);
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {/* Children Counter */}
                  <Stack direction="row" alignItems="center" sx={{ width: 100 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newRooms = [...value];
                        newRooms[index].children = Math.max(0, room.children - 1);
                        onChange(newRooms);
                      }}
                      disabled={room.children === 0}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 0.5, width: 20, textAlign: "center" }}>
                      {room.children}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newRooms = [...value];
                        newRooms[index].children = room.children + 1;
                        onChange(newRooms);
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Box>
          </Popover>
        </Box>
      )}
    />
  );
};

export default GuestsInput;