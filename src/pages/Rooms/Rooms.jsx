import React, { useEffect, useState } from "react";
import rooms from "../../assets/rooms.webp"
import HeroSection from "../../components/HeroSection";
import AllRooms from "./AllRooms";

function Rooms() {


  return (
    <div>
      <HeroSection 
             title="  Room Grid" 
             subtitle="Room Grid" 
             bgImage={rooms} 
           />
           <AllRooms/>
    </div>
  );
}

export default Rooms;
