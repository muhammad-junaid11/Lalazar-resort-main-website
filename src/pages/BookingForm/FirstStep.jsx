import React, { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { DateRange } from "react-date-range";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase"; 

import RHFformProvider from "../../components/Form/RHFformProvider";
import DatePickerInput from "../../components/Form/DatePickerInput";
import SelectInput from "../../components/Form/SelectInput";
import TextFieldInput from "../../components/Form/TextFieldInput";

const FirstStep = ({ onChange, defaultValues = {} }) => {
  const theme = useTheme();
  const [cityOptions, setCityOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);

  const methods = useForm({
    defaultValues: {
      checkInDate: null,
      checkOutDate: null,
      numGuests: "",
      numRooms: "",
      roomCategory: "",
      city: "",
      airportTransfer: false,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const checkInDate = methods.watch("checkInDate");
  const checkOutDate = methods.watch("checkOutDate");

  // Fetch cities and room categories from Firebase
  useEffect(() => {
    const fetchCities = async () => {
      const snapshot = await getDocs(collection(db, "city"));
      const cities = snapshot.docs.map((doc) => ({
        label: doc.data().cityName,
        value: doc.id,
      }));
      setCityOptions(cities);
    };

    const fetchRoomCategories = async () => {
      const snapshot = await getDocs(collection(db, "roomCategory"));
      const categories = snapshot.docs.map((doc) => ({
        label: doc.data().categoryName,
        value: doc.id,
      }));
      setRoomOptions(categories);
    };

    fetchCities();
    fetchRoomCategories();
  }, []);

  // Update parent formData whenever any field changes
  useEffect(() => {
    const subscription = methods.watch((value) => {
      onChange && onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [methods, onChange]);

  // Auto-adjust checkout if it's before check-in
  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      methods.setValue(
        "checkOutDate",
        new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
      );
    }
  }, [checkInDate, checkOutDate, methods]);

  const dateRangeSelection = useMemo(
    () => [
      {
        startDate: checkInDate || new Date(),
        endDate:
          checkOutDate ||
          (checkInDate
            ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
            : new Date()),
        key: "selection",
      },
    ],
    [checkInDate, checkOutDate]
  );

  const inputSx = {
    mt: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& .MuiInputBase-input": {
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: "10px 10px",
        color: "#000",
      },
      "& fieldset": { borderColor: "rgba(0,0,0,0.2)" },
      "&:hover fieldset": { borderColor: "rgba(0,0,0,0.4)" },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 0 1px ${theme.palette.secondary.main}`,
      },
      "& .MuiSvgIcon-root": { color: theme.palette.secondary.main },
    },
    "& .MuiSelect-select": { color: "#000", padding: "16.5px 14px" },
    "& .MuiInputLabel-root": {
      color: "rgba(0,0,0,0.7)",
      "&.Mui-focused": { color: theme.palette.secondary.main },
      "&:not(.MuiInputLabel-shrink)": { transform: "translate(14px, 10px) scale(1)" },
      "&.MuiInputLabel-shrink": { transform: "translate(14px, -9px) scale(0.75)" },
    },
  };

  return (
    <RHFformProvider methods={methods}>
      <Grid container spacing={0.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Select check-in and check-out
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
            <DatePickerInput
              name="checkInDate"
              label="Check-in Date"
              rules={{ required: "Check-in date is required" }}
              minDate={new Date()}
              sx={inputSx}
              control={methods.control}
            />

            <DatePickerInput
              name="checkOutDate"
              label="Check-out Date"
              rules={{ required: "Check-out date is required" }}
              minDate={
                checkInDate
                  ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
                  : new Date()
              }
              disabled={!checkInDate}
              sx={inputSx}
              control={methods.control}
            />

            <TextFieldInput
              name="numGuests"
              label="Select how many guests"
              type="number"
              inputProps={{ min: 1, max: 8 }}
              rules={{
                required: "Number of guests is required",
                min: { value: 1, message: "At least 1 guest" },
                max: { value: 8, message: "Maximum 8 guests" },
              }}
              sx={inputSx}
            />

            <TextFieldInput
              name="numRooms"
              label="How many rooms"
              type="number"
              inputProps={{ min: 1, max: 8 }}
              rules={{
                required: "Number of rooms is required",
                min: { value: 1, message: "At least 1 room" },
                max: { value: 8, message: "Maximum 8 rooms" },
              }}
              sx={inputSx}
            />

            <SelectInput
              name="city"
              label="Choose city"
              options={cityOptions}
              rules={{ required: "City is required" }}
              sx={inputSx}
            />

            <SelectInput
              name="roomCategory"
              label="Choose room category"
              options={roomOptions}
              rules={{ required: "Room category is required" }}
              sx={inputSx}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 0,
              transform: "scale(1.2)",
              pointerEvents: "none",
            }}
          >
            <DateRange
              ranges={dateRangeSelection}
              editableDateInputs={false}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
              minDate={new Date()}
              rangeColors={[theme.palette.secondary.main]}
              showDateDisplay={false}
              onChange={() => {}}
            />
          </Box>
        </Grid>
      </Grid>
    </RHFformProvider>
  );
};

export default FirstStep;
