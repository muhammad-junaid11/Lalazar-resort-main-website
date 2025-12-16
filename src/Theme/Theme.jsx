import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#f57c00",
    },
    secondary: {
      main: "#f57c00",
    },
    text: {
      primary: "#111111",
      secondary: "#555555",
    },
    background: {
      default: "#ffffff",
    },
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",

    // Hero / Slider Heading
    h2: {
      fontFamily: "serif",
      fontWeight: 700,
      fontSize: "3.8rem",
      lineHeight: 1.2,
      "@media (max-width:900px)": {
        fontSize: "3rem",
      },
      "@media (max-width:600px)": {
        fontSize: "2.5rem",
      },
    },

    // Section Headings (e.g., Welcome, Core Features)
    h3: {
      fontFamily: "serif",
      fontWeight: 700,
      fontSize: "2.4rem",
      lineHeight: 1.25,
      "@media (max-width:900px)": {
        fontSize: "2rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1.7rem",
      },
    },

    // Subheadings / Feature Names
    subtitle1: {
      fontFamily: "serif",
      fontWeight: 600,
      fontSize: "1.1rem",
      lineHeight: 1.3,
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },

    // Body text
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
      color: "#555555",
    },

    h4: {
      fontFamily: "serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "serif",
      fontWeight: 500,
    },
  },

  components: {
    // Optional: force plain <h1>-<h6> to use theme fonts
    MuiCssBaseline: {
      styleOverrides: {
        h1: { fontFamily: "serif" },
        h2: { fontFamily: "serif" },
        h3: { fontFamily: "serif" },
        h4: { fontFamily: "serif" },
        h5: { fontFamily: "serif" },
        h6: { fontFamily: "serif" },
      },
    },
  },
});

export default Theme;
