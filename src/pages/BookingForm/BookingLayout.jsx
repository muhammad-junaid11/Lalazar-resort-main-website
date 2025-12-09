import React, { useState } from "react";
import { Box, Typography, Button, Stepper, Step, StepLabel, useTheme, Paper, Divider } from "@mui/material";

import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

// Descriptions for the Vertical Stepper (same as before)
const verticalSteps = [
    {
        label: "Booking Details",
        description: `Set your destination, dates, and number of guests.`,
    },
    {
        label: "Select Room",
        description:
            'Choose your preferred room type, view, and rate.',
    },
    {
        label: "Review & Payment",
        description: `Review summary and confirm booking with payment.`,
    },
];

// Helper Component for Vertical Stepper (same as before)
const VerticalLinearStepper = ({ theme, activeStep }) => {
    // Custom style overrides for the vertical stepper to match the theme color
    const verticalStepperSx = {
        "& .MuiStepIcon-root": {
            fontSize: "2rem",
        },
        // Completed step icon color (secondary.main)
        "& .MuiStepLabel-root .Mui-completed": {
            color: theme.palette.secondary.main,
        },
        // Active step icon color (secondary.main)
        "& .MuiStepLabel-root .Mui-active": {
            color: theme.palette.secondary.main,
        },
        // Active step label text color (secondary.main)
        "& .MuiStepLabel-label.Mui-active": {
            color: theme.palette.secondary.main,
            fontWeight: "bold",
        },
        // Default step label text color
        "& .MuiStepLabel-label": {
            fontWeight: "bold",
            color: theme.palette.text.primary, // Ensure step labels are dark/readable
        },
        // Completed step icon fill color
        "& .MuiStepIcon-root.Mui-completed": {
            color: theme.palette.secondary.main,
        },
        // Active step icon fill color
        "& .MuiStepIcon-root.Mui-active": {
            color: theme.palette.secondary.main,
        },
    };

    return (
        // Border of theme color and padding
        <Box sx={{ 
            width: 300, 
            mr: 5, 
            mt: 2.5,
            p: 3, 
            // ⭐ Border color set to secondary.main
            border: `1px solid ${theme.palette.secondary.main}`, 
            borderRadius: 2, 
            height: 'fit-content', 
        }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Book a Hotel
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical" sx={verticalStepperSx}>
                {verticalSteps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === verticalSteps.length - 1 ? (
                                    <Typography variant="caption">Final Step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <Box sx={{ pl: 4, mt: 1 }}>
                            {/* ⭐ Changed color to textPrimary for high contrast */}
                            <Typography variant="body2" color="text.primary"> 
                                {step.description}
                            </Typography>
                        </Box>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

const BookingLayout = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [formData, setFormData] = useState({
        firstStep: {},
        secondStep: {},
        thirdStep: {},
    });

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
            if (!formData.secondStep.selectedRoom) {
                alert("Please select a room to proceed");
                return;
            }
        }

        setStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = () => {
        console.log("Final Booking Data:", formData);
        alert("Booking submitted!");
    };

    const renderStep = () => {
        // Extract the selected category ID from the first step's data
        const selectedCategoryId = formData.firstStep.roomCategory;

        switch (step) {
            case 1:
                return (
                    <FirstStep
                        defaultValues={formData.firstStep}
                        onChange={(data) =>
                            setFormData((prev) => ({ ...prev, firstStep: data }))
                        }
                    />
                );
            case 2:
                return (
                    <SecondStep
                        // ⭐ NEW PROP: Pass the selected category ID
                        selectedCategoryId={selectedCategoryId} 
                        selectedRoom={formData.secondStep.selectedRoom}
                        setSelectedRoom={(room) =>
                            setFormData((prev) => ({
                                ...prev,
                                secondStep: { ...prev.secondStep, selectedRoom: room },
                            }))
                        }
                    />
                );
            case 3:
                return <ThirdStep formData={formData} />; 

            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                p: { xs: 2, sm: 4 },
                minHeight: "100vh",
                width: "100%",
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 1300, mt: 15, display: 'flex' }}>
                
                {/* Vertical Stepper on the left (with themed border) */}
                <VerticalLinearStepper theme={theme} activeStep={step - 1} />
                
                <Box sx={{ flexGrow: 1, maxWidth: 1000 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 600, fontFamily: "serif" }}>
                            {/* Empty box for alignment */}
                        </Typography>
                    </Box>

                    {/* Step Content */}
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
                        ) : (
                            <Box />
                        )}

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
                    
                    {/* Divider is correctly placed below the buttons */}
                    <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.2)" }} />
                </Box>
            </Box>
        </Box>
    );
};

export default BookingLayout;