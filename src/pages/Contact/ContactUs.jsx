import React from 'react'
import HeroSection from '../../components/HeroSection'
import hotelBg from '../../assets/contact.webp'
import ContactCards from './ContactCards'
import GoogleMap from '../Home/GoogleMap'
function ContactUs() {
  return (
    <div>
      <HeroSection 
        title="Get In Touch" 
        subtitle="Contact Us" 
        bgImage={hotelBg} 
      />
      <ContactCards/>
      <GoogleMap height={500} />
    </div>
  )
}

export default ContactUs
