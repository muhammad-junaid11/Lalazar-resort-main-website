import React, { useMemo, useEffect, useState } from "react";
import { Box, Typography, Grid, Card, Button, useTheme } from "@mui/material";
import Cookies from "js-cookie"; // make sure you have js-cookie installed
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/Firebase/Firebase";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const paymentAccounts = [
  { id: 1, name: "EasyPaisa", account: "2796871257", icon: null },
  { id: 2, name: "JazzCash", account: "2796871257", icon: null },
  { id: 3, name: "MasterCard", account: "2796871257", icon: null },
];

const ThirdStep = ({ formData }) => {
  const theme = useTheme();
  const [receipt, setReceipt] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [roomCategoryName, setRoomCategoryName] = useState("");

useEffect(() => {
  const fetchUser = async () => {
    try {
      const uid = Cookies.get("userUID"); // Correct UID from cookie
      if (!uid) return;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserDetails({
          name: data.userName || "",
          address: data.address || "",
          contactNo: data.number || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };
  fetchUser();
}, []);


  // Fetch Room Category Name
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const categoryId = formData?.firstStep?.roomCategory;
        if (!categoryId) return;

        const docRef = doc(db, "roomCategory", categoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setRoomCategoryName(docSnap.data().categoryName);
      } catch (err) {
        console.error("Error fetching room category:", err);
      }
    };
    fetchCategoryName();
  }, [formData]);

  const handleUpload = (e) => {
    setReceipt(e.target.files[0]);
  };

  const previewData = useMemo(
    () => ({
      name: userDetails.name || "",
      address: userDetails.address || "",
      contactNo: userDetails.contactNo || "",
      checkInDate: formData?.firstStep?.checkInDate
        ? new Date(formData.firstStep.checkInDate).toLocaleDateString()
        : "",
      checkOutDate: formData?.firstStep?.checkOutDate
        ? new Date(formData.firstStep.checkOutDate).toLocaleDateString()
        : "",
      guests: formData?.firstStep?.numGuests || "",
      rooms: formData?.firstStep?.numRooms || "",
      roomCategory:
        roomCategoryName || formData?.secondStep?.selectedRoom?.title || "",
      advance: "PKR 5,400",
      totalAmount: "PKR 30,000",
    }),
    [formData, userDetails, roomCategoryName]
  );

  const PreviewDetailRow = ({ label, value }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography
        variant="body1"
        sx={{ fontWeight: "bold", color: "black", width: "150px" }}
      >
        {label}:
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, color: "black", flexGrow: 1 }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={4} sx={{ maxWidth: 1320, mx: "auto", mt: 4 }}>
      {/* LEFT SIDE - Booking Information & Upload Receipt */}
      <Grid item xs={12} md={6}>
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
          Booking Information
        </Typography>

        <Box
          sx={{
            p: 3,
            border: `1px solid rgba(0,0,0,0.1)`,
            borderRadius: 2,
            bgcolor: "white",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {Object.entries(previewData).map(([key, value]) => (
            <PreviewDetailRow
              key={key}
              label={key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              value={value}
            />
          ))}

          {/* Upload Payment Receipt */}
          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "black", mb: 2 }}
            >
              Upload Payment Receipt
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={
                <CloudUploadIcon sx={{ color: theme.palette.secondary.main }} />
              }
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

            <Typography
              variant="body2"
              sx={{ mt: 1, color: "text.secondary", fontSize: "0.8rem" }}
            >
              PDF, JPG, PNG - Max 5Mb
            </Typography>
            {receipt ? (
              <Typography
                sx={{
                  mt: 1,
                  color: theme.palette.success.main,
                  fontStyle: "italic",
                }}
              >
                Uploaded: {receipt.name}
              </Typography>
            ) : (
              <Typography sx={{ mt: 1, color: "text.secondary" }}>
                Please upload the receipt after making the advance payment.
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>

      {/* RIGHT SIDE - Payment Methods */}
      <Grid item xs={12} md={6}>
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
          Payment Methods
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {paymentAccounts.map((method) => (
            <Card
              key={method.id}
              sx={{
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                bgcolor: "white",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ fontSize: 32, color: theme.palette.secondary.main }}>
                {method.icon}
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: "bold", color: "black", mb: 0.5 }}
                >
                  {method.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      minWidth: "70px",
                    }}
                  >
                    Name:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, color: "rgba(0,0,0,0.7)" }}
                  >
                    Lalazar Resort
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      minWidth: "70px",
                    }}
                  >
                    Account:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, color: "rgba(0,0,0,0.7)" }}
                  >
                    {method.account}
                  </Typography>
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
