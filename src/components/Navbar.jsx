import React, { useState } from "react";
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
  Select,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logo from "../assets/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// Submenu for Rooms
const roomsSubMenu = [
  { label: "Deluxe Room", to: "/rooms/deluxe" },
  { label: "Executive Room", to: "/rooms/executive" },
  { label: "Family Room", to: "/rooms/family" },
  { label: "Luxury Room", to: "/rooms/luxury" },
];

// Mobile Drawer Item
const MobileNavItem = ({ to, children, setMobileOpen }) => (
  <MenuItem component={Link} to={to} onClick={() => setMobileOpen(false)}>
    {children}
  </MenuItem>
);

// Desktop Nav Item
const NavItem = ({ to, children, selected, theme }) => (
  <Typography
    component={Link}
    to={to}
    sx={{
      color: theme.palette.primary.contrastText, // text color from theme
      textDecoration: "none",
      fontSize: "16px",
      pb: 0.5,
      borderBottom: selected
        ? `2px solid ${theme.palette.secondary.main}`
        : `2px solid transparent`,
      ":hover": {
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        color: theme.palette.primary.contrastText, // keep text color
      },
      transition: "border-bottom 0.3s ease",
    }}
  >
    {children}
  </Typography>
);

// Dropdown for Rooms
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
  const [language, setLanguage] = useState("en");
  const location = useLocation();
  const theme = useTheme();

  const isSelected = (path) => location.pathname === path;

  return (
    <AppBar
      position="absolute"
      sx={{
        background: "transparent",
        boxShadow: "none",
        px: { xs: 2, md: 12 },
      }}
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 0, md: 5 } }}
        >
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

        {/* Right: Language + Mobile */}
        {/* Right: Sign In / Sign Up + Mobile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
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
                ":hover": {
                  backgroundColor: theme.palette.grey[300],
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon sx={{ color: theme.palette.primary.contrastText }} />
          </IconButton>
        </Box>

        {/* Mobile Drawer */}
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
            <MobileNavItem to="/rooms" setMobileOpen={setMobileOpen}>
              Rooms
            </MobileNavItem>
            <MobileNavItem to="/services" setMobileOpen={setMobileOpen}>
              Services
            </MobileNavItem>
            <MobileNavItem to="/contact" setMobileOpen={setMobileOpen}>
              Contact
            </MobileNavItem>
            <MobileNavItem to="/signin" setMobileOpen={setMobileOpen}>
              Sign In
            </MobileNavItem>
            <MobileNavItem to="/signup" setMobileOpen={setMobileOpen}>
              Sign Up
            </MobileNavItem>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
