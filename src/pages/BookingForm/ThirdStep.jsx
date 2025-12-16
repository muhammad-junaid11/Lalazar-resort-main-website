import React, { useMemo, useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CircularProgress, useTheme } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../services/Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

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

  // Fetch user details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          setUserLoading(true);
          setUserError("");
          try {
            const uid = user.uid;
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserDetails({
                name: data.userName || "Not available",
                address: data.address || "Not available",
                contactNo: data.number || "Not available",
              });
            } else {
              setUserError("User details not found.");
            }
          } catch (err) {
            console.error("Error fetching user:", err);
            setUserError("Failed to load user details.");
          } finally {
            setUserLoading(false);
          }
        };
        fetchUser();
      } else {
        setUserDetails({ name: "Guest", address: "Not available", contactNo: "Not available" });
        setUserError("Please sign in to view your details.");
        setUserLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch full room details
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await Promise.all(
          (formData.secondStep.selectedRooms || []).map(async (r) => {
            if (r.price) return r; // Already has price
            const roomDoc = await getDoc(doc(db, "rooms", r.id));
            if (roomDoc.exists()) return { id: r.id, ...roomDoc.data() };
            return null;
          })
        );
        setRoomsWithPrice(rooms.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch room details:", err);
      }
    };
    fetchRooms();
  }, [formData.secondStep.selectedRooms]);

  const { totalAmount, advance, stayDays } = useMemo(() => {
    const checkIn = formData?.firstStep?.checkInDate ? new Date(formData.firstStep.checkInDate) : null;
    const checkOut = formData?.firstStep?.checkOutDate ? new Date(formData.firstStep.checkOutDate) : null;
    const selectedRooms = roomsWithPrice || [];

    if (!checkIn || !checkOut || selectedRooms.length === 0) return { totalAmount: 0, advance: 0, stayDays: 0 };

    const diffTime = checkOut.getTime() - checkIn.getTime();
    let fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (fullDays < 0) fullDays = 0;

    const total = selectedRooms.reduce((sum, room) => sum + (room.price || 0) * fullDays, 0);
    const adv = Math.round(total * 0.4);

    return { totalAmount: total, advance: adv, stayDays: fullDays };
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
      stayDuration: `${stayDays} full day(s)`,
      advance: `PKR ${advance.toLocaleString()}`,
      totalAmount: `PKR ${totalAmount.toLocaleString()}`,
    }),
    [formData, userDetails, totalAmount, advance, stayDays]
  );

  const PreviewDetailRow = ({ label, value }) => (
    <Grid size={{xs:6,md:4}}>
      <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", color: "black" }}>{label}:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: "black" }}>{value}</Typography>
      </Box>
    </Grid>
  );

  const handlePaymentSelection = (id) => {
    setSelectedPayment(id);
  };

  const validatePayment = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method before proceeding");
      return false;
    }
    return true;
  };

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
        Booking Information
      </Typography>

      <Box sx={{ p: 3, border: `1px solid rgba(0,0,0,0.1)`, borderRadius: 2, bgcolor: "white", mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          Please choose the method of payment:
        </Typography>

        {/* Payment methods in row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
  {paymentAccounts.map((method) => (
    <Grid size={{xs:!2,sm:6,md:4}} key={method.id}>
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
