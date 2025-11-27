import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import { FormProvider, useForm } from "react-hook-form";
import BookingSection from "./BookingSection";
import WelcomeSection from "./WelcomeSection";
import CoreFeatures from "./CoreFeatures";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import RoomsSection from "./RoomsSection";
import UserFeedback from "./UserFeedback";
import FaqSection from "./FaqSesction";
import HotelPlans from "./HotelPlans";
import FooterComponent from "./FooterComponent";

const images = [img1, img2, img3];

const HomePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      checkin: null,
      checkout: null,
      guests: [{ adults: 2, children: 0 }],
    },
  });

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: "100%", position: "relative"}}>
        <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <BookingSection images={images} />
        <WelcomeSection/>
        <CoreFeatures/>
        <RoomsSection/>
        <UserFeedback/>
        <FaqSection/>
        <HotelPlans/>
        <FooterComponent/>
      </Box>
    </FormProvider>
  );
};

export default HomePage;
