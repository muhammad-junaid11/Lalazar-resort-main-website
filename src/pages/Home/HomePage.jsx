import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import { FormProvider, useForm } from "react-hook-form";
import BookingSection from "./BookingSection";
import WelcomeSection from "./WelcomeSection";
import CoreFeatures from "./CoreFeatures";
import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import img3 from "../../assets/img3.webp";
import img4 from "../../assets/img4.webp";
import img5 from "../../assets/img5.webp";
import RoomsSection from "./RoomsSection";
import UserFeedback from "./UserFeedback";
import FaqSection from "./FaqSesction";
import HotelPlans from "./HotelPlans";
import FooterComponent from "./FooterComponent";
import GoogleMap from "./GoogleMap";

const images = [img1,img2,img3,img4,img5];

const HomePage = () => {
  // const [mobileOpen, setMobileOpen] = useState(false);

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
        {/* <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /> */}
        <BookingSection images={images} />
        <WelcomeSection/>
        <CoreFeatures/>
        <RoomsSection/>
        <UserFeedback/>
        <FaqSection/>
        <GoogleMap height={500} />
        <HotelPlans/>
        {/* <FooterComponent/> */}
      </Box>
    </FormProvider>
  );
};

export default HomePage;
