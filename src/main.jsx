import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider } from "@mui/material/styles";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Theme from './Theme/Theme.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={Theme}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
)
