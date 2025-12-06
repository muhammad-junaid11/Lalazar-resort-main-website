import React from "react";
import { Box } from "@mui/material";

const GoogleMap = ({ width = "100%", height = 450, borderRadius = 2 }) => {
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6565.226225191076!2d73.467143!3d34.639216!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de028aba10c91b%3A0x19a6ebf46bb2a187!2sShogran%20Rd%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1764672580668!5m2!1sen!2sus";

  return (
    <Box
      component="iframe"
      src={mapUrl}
      width={width}
      height={height}
      sx={{ border: 0, borderRadius: borderRadius }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Map"
    />
  );
};

export default GoogleMap;
