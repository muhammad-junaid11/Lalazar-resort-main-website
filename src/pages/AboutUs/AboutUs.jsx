import React from "react";
import CoreFeatureAbout from "./CoreFeatureAbout";
import WelcomeSection from "../Home/WelcomeSection";
import aboutHeroImage from '../../assets/hotelBg.webp' 
import ChooseUs from "./ChooseUs";
import HeroSection from "../../components/HeroSection";

const AboutUs = () => {
  return <div>
      <HeroSection 
        title="About Us" 
        subtitle="About Us" 
        bgImage={aboutHeroImage} 
      />
    <WelcomeSection/>
    <CoreFeatureAbout/>
    <ChooseUs/>

  </div>;
};

export default AboutUs;
