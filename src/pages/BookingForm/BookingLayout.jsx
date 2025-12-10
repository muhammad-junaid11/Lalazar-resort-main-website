import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Divider,
} from "@mui/material";

import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../services/Firebase/Firebase";
import { useNavigate } from "react-router-dom";

const verticalSteps = [
  { label: "Booking Details", description: `Set your destination, dates, and number of guests.` },
  { label: "Select Room", description: 'Choose your preferred room type, view, and rate.' },
  { label: "Review & Payment", description: `Review summary and confirm booking with payment.` },
];

// Payment options for Step 3
const paymentAccounts = [
  { id: 1, name: "EasyPaisa", account: "2796871257", icon: null },
  { id: 2, name: "JazzCash", account: "2796871257", icon: null },
  { id: 3, name: "MasterCard", account: "2796871257", icon: null },
];

const VerticalLinearStepper = ({ theme, activeStep }) => {
  const verticalStepperSx = {
    "& .MuiStepIcon-root": { fontSize: "2rem" },
    "& .MuiStepLabel-root .Mui-completed": { color: theme.palette.secondary.main },
    "& .MuiStepLabel-root .Mui-active": { color: theme.palette.secondary.main },
    "& .MuiStepLabel-label.Mui-active": { color: theme.palette.secondary.main, fontWeight: "bold" },
    "& .MuiStepLabel-label": { fontWeight: "bold", color: theme.palette.text.primary },
    "& .MuiStepIcon-root.Mui-completed": { color: theme.palette.secondary.main },
    "& .MuiStepIcon-root.Mui-active": { color: theme.palette.secondary.main },
  };

  return (
    <Box sx={{ width: 300, mr: 5, mt: 2.5, p: 3, border: `1px solid ${theme.palette.secondary.main}`, borderRadius: 2, height: 'fit-content' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Book a Hotel</Typography>
      <Stepper activeStep={activeStep} orientation="vertical" sx={verticalStepperSx}>
        {verticalSteps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={index === verticalSteps.length - 1 ? <Typography variant="caption">Final Step</Typography> : null}
            >
              {step.label}
            </StepLabel>
            <Box sx={{ pl: 4, mt: 1 }}>
              <Typography variant="body2" color="text.primary">{step.description}</Typography>
            </Box>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const BookingLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstStep: {},
    secondStep: {
      selectedCategoryId: null,
      selectedRooms: [],
    },
    thirdStep: {},
  });

  // Lifted states
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleNext = () => {
    if (step === 1) {
      const required = ["checkInDate", "checkOutDate", "numGuests", "numRooms", "city"];
      for (let field of required) {
        if (!formData.firstStep[field]) {
          alert(`Please enter a value for the ${field} field to continue.`);
          return;
        }
      }
    }

    if (step === 2) {
      if (formData.secondStep.selectedRooms.length !== Number(formData.firstStep.numRooms)) {
        alert(`Please select exactly ${formData.firstStep.numRooms} room(s) to proceed.`);
        return;
      }
    }

    if (step === 3) {
      if (!selectedPayment) {
        alert("Please select a payment method before proceeding!");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateStepData = (stepName, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepName]: {
        ...prev[stepName],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be signed in to make a booking!");
        return;
      }

      // Fetch user email dynamically
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserEmail(userDoc.data().userEmail || userDoc.data().email || "");
      }

      const { checkInDate, checkOutDate, numGuests } = formData.firstStep;
      const roomIds = formData.secondStep.selectedRooms.map((r) => r.id);

      const paymentMethodMap = {
        1: "EasyPaisa",
        2: "JazzCash",
        3: "MasterCard",
      };
      const paymentMethodName = paymentMethodMap[selectedPayment];

      if (!paymentMethodName) {
        alert("Please select a payment method before submitting!");
        return;
      }

      // Create booking doc
      const bookingRef = await addDoc(collection(db, "bookings"), {
        checkInDate,
        checkOutDate,
        paymentMethod: paymentMethodName,
        persons: Number(numGuests),
        roomId: roomIds,
        status: "pending",
        userId: user.uid,
      });

      // Create payment doc
      await addDoc(collection(db, "payment"), {
        bookingId: bookingRef.id,
        label: "Advance 1",
        paidAmount: 0,
        paymentDate: serverTimestamp(),
        paymentType: paymentMethodName,
        receiptPath: receipt || "",
        status: "Pending",
      });

      // Show confirmation page
      setShowConfirmation(true);
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("Failed to submit booking. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FirstStep
            defaultValues={formData.firstStep}
            onChange={(data) => setFormData((prev) => ({ ...prev, firstStep: data }))}
          />
        );

      case 2:
        return (
          <SecondStep
            selectedCategoryId={formData.secondStep.selectedCategoryId}
            setSelectedCategoryId={(id) => updateStepData('secondStep', 'selectedCategoryId', id)}
            selectedRooms={formData.secondStep.selectedRooms}
            setSelectedRooms={(rooms) => updateStepData('secondStep', 'selectedRooms', rooms)}
            selectedCityId={formData.firstStep.city}
            maxRooms={Number(formData.firstStep.numRooms)}
            checkInDate={formData.firstStep.checkInDate}
            checkOutDate={formData.firstStep.checkOutDate}
          />
        );

      case 3:
        return (
          <ThirdStep 
            formData={formData} 
            selectedPayment={selectedPayment} 
            setSelectedPayment={setSelectedPayment} 
            receipt={receipt}
            setReceipt={setReceipt}
          />
        );

      default:
        return null;
    }
  };

  if (showConfirmation) {
    return (
      <Box
        sx={{
          mt: 30,
          mb:10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Thank You for Choosing Lalazar Resort!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          We will contact you through your email: <strong>{userEmail}</strong>
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            "&:hover": { backgroundColor: theme.palette.secondary.dark },
            color: "#fff",
            fontWeight: "bold",
            px: 5,
            py: 1.5,
            borderRadius: 2,
          }}
          onClick={() => navigate("/")}
        >
          Close
        </Button>
        <Divider sx={{ width: "50%", mb: 2,mt:9 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: { xs: 2, sm: 4 }, minHeight: "100vh", width: "100%" }}>
      <Box sx={{ width: "100%", maxWidth: 1300, mt: 15, display: 'flex' }}>
        <VerticalLinearStepper theme={theme} activeStep={step - 1} />

        <Box sx={{ flexGrow: 1, maxWidth: 1000 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 600, fontFamily: "serif" }} />
          </Box>

          <Box sx={{ mb: 3 }}>{renderStep()}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            {step > 1 ? (
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                  color: "white",
                  fontWeight: "bold",
                  py: 1.2,
                  px: 5,
                  borderRadius: 2,
                }}
              >
                Back
              </Button>
            ) : <Box />}

            {step < totalSteps ? (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                  color: "white",
                  fontWeight: "bold",
                  py: 1.2,
                  px: 5,
                  borderRadius: 2,
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                  color: "white",
                  fontWeight: "bold",
                  py: 1.2,
                  px: 5,
                  borderRadius: 2,
                }}
              >
                Submit
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.2)" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default BookingLayout;
