import React from 'react'
import HeroSection from '../../components/HeroSection'
import hotelBg from '../../assets/activities.webp'
import ActivitiesTypes from './ActivitiesTypes'
import CoreFeatures from '../Home/CoreFeatures'
function Activities() {
  return (
    <div>
       <HeroSection 
        title="Activities" 
        subtitle="Activities" 
        bgImage={hotelBg} 
      />
      <ActivitiesTypes/>
      <CoreFeatures/>
    </div>
  )
}

export default Activities
