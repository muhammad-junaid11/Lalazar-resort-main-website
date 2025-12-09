import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Layout from "./components/Layout";
import HomePage from "./pages/Home/HomePage";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import AboutUs from "./pages/AboutUs/AboutUs";
import Activities from "./pages/Activities/Activities";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/Contact/ContactUs";
import FirstStep from "./pages/BookingForm/FirstStep";
import BookingLayout from "./pages/BookingForm/BookingLayout";
import ProtectedRoute from "./pages/BookingForm/ProtectedRoute";
import Rooms from "./pages/Rooms/Rooms";
import RoomsByCategory from "./pages/Rooms/RoomsByCategory";
function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/activities"
          element={
            <Layout>
              <Activities />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactUs />
            </Layout>
          }
        />
         <Route
    path="/book"
    element={
      <ProtectedRoute>
        <Layout navColor="secondary">
          <BookingLayout />
        </Layout>
      </ProtectedRoute>
    }
  />
        { <Route path="/rooms" element={<Layout><Rooms /></Layout>} /> }
         <Route path="/rooms/:categoryName" element={<Layout><RoomsByCategory /></Layout>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
