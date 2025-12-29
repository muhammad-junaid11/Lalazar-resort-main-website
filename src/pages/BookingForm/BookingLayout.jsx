import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Divider,
  useMediaQuery,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { auth, db } from "../../services/Firebase/Firebase";

import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import toast, { Toaster } from "react-hot-toast";
import { getUserEmail } from "../../services/dbServices/UserService";
import { createBooking } from "../../services/dbServices/BookingService";
import { createPayment } from "../../services/dbServices/PaymentService";


const verticalSteps = [
  {
    label: "Booking Details",
    description: `Set your destination, dates, and number of guests.`,
  },
  {
    label: "Select Room",
    description: "Choose your preferred room type, view, and rate.",
  },
  {
    label: "Review & Payment",
    description: `Review summary and confirm booking with payment.`,
  },
];

const AdaptiveStepper = ({ theme, activeStep }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const stepperSx = {
    "& .MuiStepIcon-root": { 
      fontSize: isMobile ? "1.5rem" : "2rem",
      color: theme.palette.grey[300],
    },
    "& .MuiStepLabel-root .Mui-completed": {
      color: theme.palette.secondary.main,
    },
    "& .MuiStepLabel-root .Mui-active": { color: theme.palette.secondary.main },
    "& .MuiStepLabel-label.Mui-active": {
      color: theme.palette.secondary.main,
      fontWeight: "bold",
    },
    "& .MuiStepLabel-label": {
      fontWeight: "bold",
      color: theme.palette.text.primary,
      fontSize: isMobile ? "0.75rem" : "0.9rem",
    },
    "& .MuiStepIcon-root.Mui-completed": {
      color: theme.palette.secondary.main,
    },
    "& .MuiStepIcon-root.Mui-active": { color: theme.palette.secondary.main },
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 300,
        mr: isMobile ? 0 : 5,
        mb: isMobile ? 4 : 0,
        mt: 2.5,
        p: isMobile ? 2 : 3,
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 2,
        height: "fit-content",
      }}
    >
      {!isMobile && (
        <Typography variant="h5" sx={{ mb: 2 }}>
          Book a Hotel
        </Typography>
      )}

      <Stepper
        activeStep={activeStep}
        orientation={isMobile ? "horizontal" : "vertical"}
        sx={stepperSx}
        alternativeLabel={isMobile}
      >
        {verticalSteps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                !isMobile ? (
                  <Typography
                    variant="caption"
                    color="text.primary"
                    sx={{ mt: 0, display: "block", lineHeight: 1.2 }}
                  >
                    {step.description}
                  </Typography>
                ) : null
              }
            >
              {isMobile ? `${index + 1}- ${step.label}` : step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const BookingLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const query = new URLSearchParams(location.search);
  const preselectedRoomId = query.get("roomId");
  const preselectedCategoryId = query.get("categoryId");
  const preselectedCityId = query.get("cityId");

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstStep: {
      city: preselectedCityId || "",
      checkInDate: null,
      checkOutDate: null,
      numGuests: "",
      numRooms: "",
      _errors: [],
    },
    secondStep: {
      selectedCategoryId: preselectedCategoryId || null,
      selectedRooms: preselectedRoomId ? [{ id: preselectedRoomId }] : [],
      _errors: [],
    },
    thirdStep: {
      selectedPayment: null,
      _errors: [],
    },
  });

  const [receipt, setReceipt] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    const required = ["checkInDate", "checkOutDate", "numGuests", "numRooms", "city"];
    const emptyFields = required.filter((field) => !formData.firstStep[field]);
    if (emptyFields.length > 0) {
      setFormData((prev) => ({
        ...prev,
        firstStep: { ...prev.firstStep, _errors: emptyFields },
      }));
      toast.error("Please fill all fields before proceeding!");
      return false;
    } else {
      setFormData((prev) => ({
        ...prev,
        firstStep: { ...prev.firstStep, _errors: [] },
      }));
      return true;
    }
  };

  const validateStep2 = () => {
    const numRoomsRequired = Number(formData.firstStep.numRooms);
    const selectedCount = formData.secondStep.selectedRooms.length;

    if (selectedCount === 0) {
      toast.error("Please select room before proceeding");
      return false;
    }

    if (selectedCount < numRoomsRequired) {
      toast.error(`Please select at least ${numRoomsRequired} room(s) as you specified`);
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      secondStep: { ...prev.secondStep, _errors: [] },
    }));
    return true;
  };

  const validateStep3 = () => {
    if (!formData.thirdStep.selectedPayment) {
      setFormData((prev) => ({
        ...prev,
        thirdStep: { ...prev.thirdStep, _errors: ["selectedPayment"] },
      }));
      toast.error("Please select a payment method!");
      return false;
    } else {
      setFormData((prev) => ({
        ...prev,
        thirdStep: { ...prev.thirdStep, _errors: [] },
      }));
      return true;
    }
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateStepData = (stepName, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepName]: { ...prev[stepName], [key]: value },
    }));
  };

const handleSubmit = async () => {
  if (!validateStep3()) return;

  try {
    setIsSubmitting(true); // ✅ start loading

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to make a booking!");
      setIsSubmitting(false);
      return;
    }

    const userEmail = await getUserEmail(user.uid);
    setUserEmail(userEmail);

    const { checkInDate, checkOutDate, numGuests } = formData.firstStep;
    const roomIds = formData.secondStep.selectedRooms.map((r) => r.id);

    const paymentMethodMap = { 1: "EasyPaisa", 2: "JazzCash", 3: "MasterCard" };
    const paymentMethodName =
      paymentMethodMap[formData.thirdStep.selectedPayment];

    const roomsWithPrice = formData.secondStep.selectedRooms;
    const diffTime =
      new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();

    let stayNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (stayNights < 1) stayNights = 1;

    const totalAmount = roomsWithPrice.reduce((sum, room) => {
      const roomPrice = room.price || 0;
      return sum + roomPrice * stayNights;
    }, 0);

    const advance = Math.round(totalAmount * 0.4);

    const bookingId = await createBooking(user.uid, {
      checkInDate,
      checkOutDate,
      persons: Number(numGuests),
      roomId: roomIds,
      paymentMethod: paymentMethodName,
    });

    await createPayment(
      bookingId,
      paymentMethodName,
      receipt,
      totalAmount,
      advance
    );

    setShowConfirmation(true);
    toast.success("Booking submitted successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit booking. Please try again.");
  } finally {
    setIsSubmitting(false); // ✅ stop loading
  }
};


  const renderStep = () => {
    switch (step) {
      case 1:
        return <FirstStep defaultValues={formData.firstStep} onChange={(data) => setFormData((prev) => ({ ...prev, firstStep: data }))} />;
      case 2:
        return (
          <SecondStep
            selectedCategoryId={formData.secondStep.selectedCategoryId}
            setSelectedCategoryId={(id) => updateStepData("secondStep", "selectedCategoryId", id)}
            selectedRooms={formData.secondStep.selectedRooms}
            setSelectedRooms={(rooms) => updateStepData("secondStep", "selectedRooms", rooms)}
            selectedCityId={formData.firstStep.city}
            maxRooms={Number(formData.firstStep.numRooms)}
            checkInDate={formData.firstStep.checkInDate}
            checkOutDate={formData.firstStep.checkOutDate}
            errors={formData.secondStep._errors}
          />
        );
      case 3:
        return (
          <ThirdStep
            formData={formData}
            selectedPayment={formData.thirdStep.selectedPayment}
            setSelectedPayment={(val) => updateStepData("thirdStep", "selectedPayment", val)}
            receipt={receipt}
            setReceipt={setReceipt}
            errors={formData.thirdStep._errors}
          />
        );
      default:
        return null;
    }
  };

  const navButtonSx = {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": { backgroundColor: theme.palette.secondary.dark },
    color: "white",
    fontWeight: "bold",
    py: 0.8,
    px: 3,
    fontSize: "0.85rem",
    borderRadius: 1.5,
    textTransform: "none",
  };

  if (showConfirmation)
    return (
      <Box sx={{ mt: 30, mb: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Thank You for Choosing Lalazar Resort!</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>We will contact you through your email: <strong>{userEmail}</strong></Typography>
        <Button variant="contained" sx={{ ...navButtonSx, py: 1.2, px: 5 }} onClick={() => navigate("/")}>Close</Button>
        <Divider sx={{ width: "50%", mb: 2, mt: 9 }} />
      </Box>
    );

  return (
    <>
      <Toaster position="top-right" />
      <Box sx={{ display: "flex", justifyContent: "center", p: { xs: 2, sm: 4 }, minHeight: "100vh", width: "100%" }}>
        <Box sx={{ width: "100%", maxWidth: 1300, mt: 15, display: "flex", flexDirection: isMobile ? "column" : "row" }}>
          <AdaptiveStepper theme={theme} activeStep={step - 1} />
          <Box sx={{ flexGrow: 1, maxWidth: 1000 }}>
            <Box sx={{ mb: 3 }}>{renderStep()}</Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              {step > 1 ? (
                <Button variant="contained" onClick={handleBack} sx={navButtonSx}>Back</Button>
              ) : <Box />}
              {step < totalSteps ? (
                <Button variant="contained" onClick={handleNext} sx={navButtonSx}>Next</Button>
              ) : (
                <Button
  variant="contained"
  onClick={handleSubmit}
  sx={navButtonSx}
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <CircularProgress size={20} sx={{ color: "white" }} />
  ) : (
    "Submit"
  )}
</Button>

              )}
            </Box>
            <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.2)" }} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BookingLayout;