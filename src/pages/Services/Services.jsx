import React from 'react'
import HeroSection from '../../components/HeroSection'
import hotelBg from '../../assets/activities.webp'
import ServicesFeatures from './ServicesFeatures'
import CoreFeatures from '../Home/CoreFeatures'
function Services() {
  return (
    <div>
      <HeroSection 
        title="What We Do" 
        subtitle="Services" 
        bgImage={hotelBg} 
      />
      <ServicesFeatures/>
      <CoreFeatures/>
    </div>
  )
}

export default Services
