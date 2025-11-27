import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#07444d",
    },
    secondary: {
      main: "#f57c00", 
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default Theme;
