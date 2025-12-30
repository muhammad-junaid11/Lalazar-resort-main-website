import React, { useMemo, useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CircularProgress, useTheme } from "@mui/material";
import toast from "react-hot-toast";
import { fetchCurrentUser } from "../../services/dbServices/UserService";
import { fetchAllRooms } from "../../services/dbServices/RoomService"; 

const paymentAccounts = [
  { id: 1, name: "EasyPaisa", account: "2796871257", icon: null },
  { id: 2, name: "JazzCash", account: "2796871257", icon: null },
  { id: 3, name: "MasterCard", account: "2796871257", icon: null },
];

const ThirdStep = ({ formData, selectedPayment, setSelectedPayment }) => {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState({});
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");
  const [roomsWithPrice, setRoomsWithPrice] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  
  useEffect(() => {
    const loadUser = async () => {
      setUserLoading(true);
      try {
        const user = await fetchCurrentUser();
        if (user) setUserDetails(user);
        else setUserError("Please sign in to view your details.");
      } catch (err) {
        console.error("Error loading user:", err);
        setUserError("Failed to load user details.");
      } finally {
        setUserLoading(false);
      }
    };
    loadUser();
  }, []);

  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setRoomsLoading(true);
        const selectedRooms = formData.secondStep.selectedRooms || [];
        
        if (selectedRooms.length === 0) {
          setRoomsWithPrice([]);
          setRoomsLoading(false);
          return;
        }

        console.log("Selected rooms in ThirdStep:", selectedRooms);

        
        const hasAllPrices = selectedRooms.every(r => 
          r.price !== undefined && 
          r.price !== null && 
          !isNaN(r.price) &&
          r.price > 0
        );
        
        if (hasAllPrices) {
          
          console.log("All rooms have price data");
          setRoomsWithPrice(selectedRooms);
          setRoomsLoading(false);
        } else {
          
          console.log("Fetching complete room data...");
          const allRooms = await fetchAllRooms();
          
          
          const enrichedRooms = selectedRooms.map(selectedRoom => {
            const fullRoom = allRooms.find(r => r.id === selectedRoom.id);
            if (fullRoom) {
              console.log(`Found complete data for room ${selectedRoom.id}:`, fullRoom);
              return fullRoom;
            }
            console.warn(`No complete data found for room ${selectedRoom.id}`);
            return selectedRoom;
          });
          
          console.log("Enriched rooms:", enrichedRooms);
          setRoomsWithPrice(enrichedRooms);
          setRoomsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
        toast.error("Failed to load room details");
        setRoomsLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [formData.secondStep.selectedRooms]);

  // Calculate amounts
  const { totalAmount, advance, stayNights } = useMemo(() => {
    const checkIn = formData?.firstStep?.checkInDate ? new Date(formData.firstStep.checkInDate) : null;
    const checkOut = formData?.firstStep?.checkOutDate ? new Date(formData.firstStep.checkOutDate) : null;
    const selectedRooms = roomsWithPrice || [];

    console.log("Calculating amounts with:", {
      checkIn,
      checkOut,
      rooms: selectedRooms,
      roomsCount: selectedRooms.length
    });

    if (!checkIn || !checkOut || selectedRooms.length === 0) {
      console.log("Missing data for calculation");
      return { totalAmount: 0, advance: 0, stayNights: 0 };
    }

    
    const diffTime = checkOut.getTime() - checkIn.getTime();
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
  
    if (nights < 1) nights = 1;

    console.log(`Stay duration: ${nights} night(s)`);

    
    const total = selectedRooms.reduce((sum, room) => {
      const roomPrice = room.price || 0;
      console.log(`Room ${room.title || room.id}: PKR ${roomPrice} × ${nights} nights`);
      return sum + (roomPrice * nights);
    }, 0);
    
    const adv = Math.round(total * 0.4);

    console.log("Final calculation:", { total, advance: adv, nights });

    return { totalAmount: total, advance: adv, stayNights: nights };
  }, [formData, roomsWithPrice]);

  const previewData = useMemo(
    () => ({
      name: userDetails.name || "",
      address: userDetails.address || "",
      contactNo: userDetails.contactNo || "",
      checkInDate: formData?.firstStep?.checkInDate
        ? new Date(formData.firstStep.checkInDate).toLocaleString()
        : "",
      checkOutDate: formData?.firstStep?.checkOutDate
        ? new Date(formData.firstStep.checkOutDate).toLocaleString()
        : "",
      guests: formData?.firstStep?.numGuests || "",
      rooms: formData?.firstStep?.numRooms || "",
      stayDuration: `${stayNights} night(s)`,
      advance: `PKR ${advance.toLocaleString()}`,
      totalAmount: `PKR ${totalAmount.toLocaleString()}`,
    }),
    [formData, userDetails, totalAmount, advance, stayNights]
  );

  const PreviewDetailRow = ({ label, value }) => (
    <Grid size={{xs:6,md:4}}>
      <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", color: "black" }}>{label}:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: "black" }}>{value}</Typography>
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
        Booking Information
      </Typography>

      <Box sx={{ p: 3, border: `1px solid rgba(0,0,0,0.1)`, borderRadius: 2, bgcolor: "white", mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          Please choose the method of payment:
        </Typography>

       
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {paymentAccounts.map((method) => (
            <Grid size={{xs:12,sm:6,md:4}} key={method.id}>
              <Card
                onClick={() => setSelectedPayment(method.id)}
                sx={{
                  borderRadius: 2,
                  border: selectedPayment === method.id ? `2px solid ${theme.palette.secondary.main}` : "1px solid rgba(0,0,0,0.1)",
                  p: 2,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  transition: "all 0.2s ease",
                }}
              >
                <Typography sx={{ fontWeight: "bold", color: "black" }}>{method.name}</Typography>
                <Typography sx={{ fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Account: {method.account}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

  
        {userLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading user details...</Typography>
          </Box>
        ) : userError ? (
          <Typography color="error" sx={{ mb: 2 }}>{userError}</Typography>
        ) : (
          <Grid container spacing={0.5}>
            {Object.entries(previewData).map(([key, value]) => (
              <PreviewDetailRow
                key={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                value={value}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ThirdStep;