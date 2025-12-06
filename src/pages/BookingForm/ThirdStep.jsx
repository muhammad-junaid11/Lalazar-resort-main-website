import React, { useState } from "react";
import { Box, Typography, Grid, Card, Button, useTheme } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const paymentAccounts = [
  { id: 1, name: "EasyPaisa", account: "2796871257", icon: <AccountBalanceWalletIcon /> },
  { id: 2, name: "JazzCash", account: "2796871257", icon: <AccountBalanceWalletIcon /> },
  { id: 3, name: "MasterCard", account: "2796871257", icon: <CreditCardIcon /> },
];

const ThirdStep = () => {
  const theme = useTheme();
  const [receipt, setReceipt] = useState(null);

  const handleUpload = (e) => {
    setReceipt(e.target.files[0]);
  };

  const previewData = {
    name: "Ali",
    checkInDate: "12/5/2025",
    checkOutDate: "12/7/2025",
    guests: "3",
    rooms: "2",
    address: "Jhelum",
    contactNo: "319836982698",
    advance: "PKR 5,400",
    totalAmount: "PKR 30,000",
  };

  const PreviewDetailRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', width: '150px' }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, color: 'black', flexGrow: 1 }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={4} sx={{ maxWidth: 1320, mx: "auto", mt: 4 }}>
      {/* LEFT SIDE - Booking Information & Upload Receipt */}
      <Grid size={{xs:12,md:6}}>
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
            boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          {Object.entries(previewData).map(([key, value]) => (
            <PreviewDetailRow
              key={key}
              label={key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())}
              value={value}
            />
          ))}

          {/* Upload Payment Receipt */}
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: 'black', mb: 2 }}>
              Upload Payment Receipt
            </Typography>
           <Button
  variant="contained"
  component="label"
  startIcon={<CloudUploadIcon sx={{ color: theme.palette.secondary.main }} />}
  sx={{
    borderRadius: 1,
    fontWeight: "bold",
    backgroundColor: "white",
    color: theme.palette.secondary.main,
    textTransform: 'none',
    padding: '8px 20px',
    border: `1px solid ${theme.palette.secondary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      "& .MuiSvgIcon-root": { color: "white" }, // Icon color on hover
    },
    "&:active": {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      "& .MuiSvgIcon-root": { color: "white" }, // Icon color on click
    },
  }}
>
  Upload Receipt
  <input type="file" hidden onChange={handleUpload} />
</Button>

            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
              PDF, JPG, PNG - Max 5Mb
            </Typography>
            {receipt && (
              <Typography sx={{ mt: 1, color: theme.palette.success.main, fontStyle: 'italic' }}>
                Uploaded: {receipt.name}
              </Typography>
            )}
            {!receipt && (
              <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                Please upload the receipt after making the advance payment.
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>

      {/* RIGHT SIDE - Payment Methods */}
      <Grid size={{xs:12,md:6}}>
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
                bgcolor: 'white',
                boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
              }}
            >
              <Box sx={{ fontSize: 32, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center' }}>
                {method.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: "bold", color: "black", mb: 0.5 }}>{method.name}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontWeight: "bold", color: "black", minWidth: '70px' }}>Name:</Typography>
                  <Typography sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}>Lalazar Resort</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontWeight: "bold", color: "black", minWidth: '70px' }}>Account:</Typography>
                  <Typography sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}>{method.account}</Typography>
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
