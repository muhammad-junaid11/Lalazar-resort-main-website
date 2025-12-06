import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  MenuItem,
  Typography,
  Menu,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logo from "../assets/logo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { auth, db } from "../services/Firebase/Firebase"; // Ensure 'auth' and 'db' are correctly imported
import { collection, query, where, getDocs } from "firebase/firestore"; // Updated imports for querying

// Submenu for Rooms (Unchanged)
const roomsSubMenu = [
  { label: "Deluxe Room", to: "/rooms/deluxe" },
  { label: "Executive Room", to: "/rooms/executive" },
  { label: "Family Room", to: "/rooms/family" },
  { label: "Luxury Room", to: "/rooms/luxury" },
];

// Mobile Drawer Item (Unchanged)
const MobileNavItem = ({ to, children, setMobileOpen }) => (
  <MenuItem component={Link} to={to} onClick={() => setMobileOpen(false)}>
    {children}
  </MenuItem>
);

// Desktop Nav Item (Unchanged)
const NavItem = ({ to, children, selected, theme }) => (
  <Typography
    component={Link}
    to={to}
    sx={{
      color: theme.palette.primary.contrastText,
      textDecoration: "none",
      fontSize: "16px",
      pb: 0.5,
      borderBottom: selected
        ? `2px solid ${theme.palette.secondary.main}`
        : "2px solid transparent",
      ":hover": {
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        color: theme.palette.primary.contrastText,
      },
      transition: "border-bottom 0.3s ease",
    }}
  >
    {children}
  </Typography>
);

// Dropdown for Rooms (Unchanged)
const Dropdown = ({ selected, theme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        id="rooms-button"
        aria-controls={open ? "rooms-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={
          <KeyboardArrowDownIcon
            sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }}
          />
        }
        sx={{
          color: theme.palette.primary.contrastText,
          textTransform: "none",
          fontSize: "16px",
          padding: 0,
          minWidth: "auto",
          borderBottom: selected
            ? `2px solid ${theme.palette.secondary.main}`
            : "2px solid transparent",
          ":hover": {
            backgroundColor: "transparent",
            borderBottom: `2px solid ${theme.palette.secondary.main}`,
            color: theme.palette.primary.contrastText,
          },
          transition: "border-bottom 0.3s ease",
        }}
      >
        Rooms
      </Button>
      <Menu
        id="rooms-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "rooms-button" }}
      >
        {roomsSubMenu.map((item) => (
          <MenuItem
            key={item.to}
            onClick={handleClose}
            component={Link}
            to={item.to}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const Navbar = ({ mobileOpen, setMobileOpen }) => {
  const [userName, setUserName] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null); // New state for user dropdown menu
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();

  // 🚀 FIX: Use onAuthStateChanged to reliably track authentication state and fetch username by querying Firestore by email
  useEffect(() => {
    // 1. Set up the listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in. Query Firestore for the document where userEmail matches the user's email.
        try {
          console.log("Querying Firestore for userName with email:", user.email); // Add logging for debugging
          const q = query(collection(db, "users"), where("userEmail", "==", user.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Take the first matching document (assuming one per email)
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            const fetchedUserName = data.userName || user.email.split("@")[0] || "User";
            console.log("Fetched userName from Firestore:", fetchedUserName); // Confirm fetch success
            
            // Set the state and update localStorage with the correct name
            setUserName(fetchedUserName);
            localStorage.setItem("userName", fetchedUserName);
          } else {
            console.warn("No Firestore document found for email:", user.email); // Log if no doc found
            // No document found, use email prefix as fallback
            const defaultName = user.email.split("@")[0] || "User";
            setUserName(defaultName);
            localStorage.setItem("userName", defaultName);
          }
        } catch (err) {
          console.error("Failed to query userName from Firestore:", err); // Check console for this
          // Fallback to email prefix only
          const fallbackName = user.email.split("@")[0] || "User";
          setUserName(fallbackName);
          localStorage.setItem("userName", fallbackName);
        }
      } else {
        // User is signed out. Clear all session data.
        setUserName(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
      }
    });

    // 2. Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this listener is only set up once.

  const isSelected = (path) => location.pathname === path;

  // Updated handleLogout: Clears localStorage and sessionStorage, logs out, and navigates
  const handleLogout = () => {
    auth.signOut();
    // Clear all relevant data from localStorage and sessionStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    sessionStorage.clear(); // Clear all sessionStorage for completeness
    setUserName(null);
    setUserMenuAnchorEl(null); // Close the dropdown menu
    navigate("/");
  };

  // Handlers for the user dropdown menu
  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  return (
    <AppBar
      position="absolute"
      sx={{ background: "transparent", boxShadow: "none", px: { xs: 2, md: 12 } }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left: Logo + Nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, md: 5 } }}>
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{ height: { xs: 60, md: 130 }, width: "auto", mt: 1 }}
          />
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5, pl: 4 }}>
            <NavItem to="/" selected={isSelected("/")} theme={theme}>
              Home
            </NavItem>
            <NavItem to="/about" selected={isSelected("/about")} theme={theme}>
              About
            </NavItem>
            <NavItem
              to="/activities"
              selected={isSelected("/activities")}
              theme={theme}
            >
              Activities
            </NavItem>
            <Dropdown selected={isSelected("/rooms")} theme={theme} />
            <NavItem
              to="/services"
              selected={isSelected("/services")}
              theme={theme}
            >
              Services
            </NavItem>
            <NavItem
              to="/contact"
              selected={isSelected("/contact")}
              theme={theme}
            >
              Contact
            </NavItem>
          </Box>
        </Box>

        {/* Right: User Info or Sign In/Up */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {userName ? (
              <>
                <Button
                  id="user-menu-button"
                  aria-controls={Boolean(userMenuAnchorEl) ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(userMenuAnchorEl) ? "true" : undefined}
                  onClick={handleUserMenuClick}
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }}
                    />
                  }
                  sx={{
                    color: theme.palette.primary.contrastText,
                    textTransform: "none",
                    fontWeight: "bold",
                    padding: 0,
                    minWidth: "auto",
                    ":hover": {
                      backgroundColor: "transparent",
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  {userName}
                </Button>
                <Menu
                  id="user-menu"
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  MenuListProps={{ "aria-labelledby": "user-menu-button" }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/signin"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    border: `1px solid ${theme.palette.primary.contrastText}`,
                    textTransform: "none",
                    px: 2,
                    py: 0.5,
                    fontWeight: "bold",
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  sx={{
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.contrastText,
                    textTransform: "none",
                    px: 2,
                    py: 0.5,
                    fontWeight: "bold",
                    ":hover": { backgroundColor: theme.palette.grey[300] },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu (Unchanged) */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon sx={{ color: theme.palette.primary.contrastText }} />
          </IconButton>
        </Box>

        {/* Mobile Drawer (Unchanged) */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <MobileNavItem to="/" setMobileOpen={setMobileOpen}>
              Home
            </MobileNavItem>
            <MobileNavItem to="/about" setMobileOpen={setMobileOpen}>
              About
            </MobileNavItem>
            <MobileNavItem to="/activities" setMobileOpen={setMobileOpen}>
              Activities
            </MobileNavItem>
            {/* ... other mobile menu items ... */}
            <MobileNavItem to="/rooms" setMobileOpen={setMobileOpen}>
              Rooms
            </MobileNavItem>
            <MobileNavItem to="/services" setMobileOpen={setMobileOpen}>
              Services
            </MobileNavItem>
            <MobileNavItem to="/contact" setMobileOpen={setMobileOpen}>
              Contact
            </MobileNavItem>

            {userName ? (
              <MobileNavItem
                to="/"
                setMobileOpen={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
              >
                Logout
              </MobileNavItem>
            ) : (
              <>
                <MobileNavItem to="/signin" setMobileOpen={setMobileOpen}>
                  Sign In
                </MobileNavItem>
                <MobileNavItem to="/signup" setMobileOpen={setMobileOpen}>
                  Sign Up
                </MobileNavItem>
              </>
            )}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
