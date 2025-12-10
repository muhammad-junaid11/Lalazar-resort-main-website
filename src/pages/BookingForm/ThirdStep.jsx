import React, { useMemo, useEffect, useState } from "react";
import { Box, Typography, Grid, Card, Button, useTheme, CircularProgress } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../services/Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const paymentAccounts = [
  { id: 1, name: "EasyPaisa", account: "2796871257", icon: null },
  { id: 2, name: "JazzCash", account: "2796871257", icon: null },
  { id: 3, name: "MasterCard", account: "2796871257", icon: null },
];

const ThirdStep = ({ formData, selectedPayment, setSelectedPayment }) => {
  const theme = useTheme();
  const [receipt, setReceipt] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");

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

  const handleUpload = (e) => setReceipt(e.target.files[0]);

  const { totalAmount, advance, stayDays } = useMemo(() => {
    const checkIn = formData?.firstStep?.checkInDate ? new Date(formData.firstStep.checkInDate) : null;
    const checkOut = formData?.firstStep?.checkOutDate ? new Date(formData.firstStep.checkOutDate) : null;
    const selectedRooms = formData?.secondStep?.selectedRooms || [];

    if (!checkIn || !checkOut || selectedRooms.length === 0) return { totalAmount: 0, advance: 0, stayDays: 0 };

    const diffTime = checkOut.getTime() - checkIn.getTime();
    let fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (fullDays < 0) fullDays = 0;

    const total = selectedRooms.reduce((sum, room) => sum + room.price * fullDays, 0);
    const adv = Math.round(total * 0.4);

    return { totalAmount: total, advance: adv, stayDays: fullDays };
  }, [formData]);

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
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: "bold", color: "black", width: "150px" }}>{label}:</Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, color: "black", flexGrow: 1 }}>{value}</Typography>
    </Box>
  );

  return (
    <Grid container spacing={4} sx={{ maxWidth: 1320, mx: "auto", mt: 4 }}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
          Booking Information
        </Typography>

        <Box sx={{ p: 3, border: `1px solid rgba(0,0,0,0.1)`, borderRadius: 2, bgcolor: "white", boxShadow: "0px 2px 10px rgba(0,0,0,0.05)" }}>
          {userLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading user details...</Typography>
            </Box>
          ) : userError ? (
            <Typography color="error" sx={{ mb: 2 }}>{userError}</Typography>
          ) : (
            Object.entries(previewData).map(([key, value]) => (
              <PreviewDetailRow
                key={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                value={value}
              />
            ))
          )}

          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "black", mb: 2 }}>Upload Payment Receipt</Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon sx={{ color: theme.palette.secondary.main }} />}
              sx={{
                borderRadius: 1,
                fontWeight: "bold",
                backgroundColor: "white",
                color: theme.palette.secondary.main,
                textTransform: "none",
                padding: "8px 20px",
                border: `1px solid ${theme.palette.secondary.main}`,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "white",
                  "& .MuiSvgIcon-root": { color: "white" },
                },
              }}
            >
              Upload Receipt
              <input type="file" hidden onChange={handleUpload} />
            </Button>

            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", fontSize: "0.8rem" }}>
              PDF, JPG, PNG - Max 5Mb
            </Typography>
            {receipt ? (
              <Typography sx={{ mt: 1, color: theme.palette.success.main, fontStyle: "italic" }}>Uploaded: {receipt.name}</Typography>
            ) : (
              <Typography sx={{ mt: 1, color: "text.secondary" }}>Please upload the receipt after making the advance payment.</Typography>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, borderBottom: `4px solid ${theme.palette.secondary.main}`, pb: 1, width: "fit-content" }}>
          Payment Methods
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {paymentAccounts.map((method) => (
            <Card
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              sx={{
                borderRadius: 2,
                border: selectedPayment === method.id 
                        ? `2px solid ${theme.palette.secondary.main}` 
                        : "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                cursor: "pointer",
                bgcolor: "white",
                boxShadow: selectedPayment === method.id 
                            ? "0px 4px 10px rgba(0,0,0,0.15)"
                            : "0px 2px 5px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ fontSize: 32, color: theme.palette.secondary.main }}>{method.icon}</Box>
              <Box>
                <Typography sx={{ fontWeight: "bold", color: "black", mb: 0.5 }}>{method.name}</Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                  <Typography sx={{ fontWeight: "bold", color: "black", minWidth: "70px" }}>Name:</Typography>
                  <Typography sx={{ fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Lalazar Resort</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                  <Typography sx={{ fontWeight: "bold", color: "black", minWidth: "70px" }}>Account:</Typography>
                  <Typography sx={{ fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>{method.account}</Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ThirdStep;
