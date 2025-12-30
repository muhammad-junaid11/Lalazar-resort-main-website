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
  Container,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import RoomIcon from "@mui/icons-material/Room";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../services/Firebase/Firebase";
import logo from "../assets/logo.jpg";
import Cookies from "js-cookie";
import { listenAuthUser } from "../services/dbServices/UserService";
import { fetchCategories } from "../services/dbServices/CategoryService";

const Layout = ({ children, navColor = "transparent" }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const [roomCategories, setRoomCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const toSlug = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

        const handleLogout = () => {
    auth.signOut();
    Cookies.remove("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("redirectAfterLogin");
    sessionStorage.clear();
    setUserName(null);
    setUserMenuAnchorEl(null);
    navigate("/");
  };
useEffect(() => {
  const unsubscribe = listenAuthUser(
    setUserName,
    setIsLoggedIn,
    handleLogout
  );

  const handleResize = () => {
    if (window.innerWidth >= theme.breakpoints.values.lg) {
      setMobileOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    unsubscribe();
    window.removeEventListener("resize", handleResize);
  };
}, [handleLogout, theme]);



  const handleUserMenuClick = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);
  const isSelected = (path) => location.pathname === path;

  const handleBookNow = () => {
    if (isLoggedIn) {
      navigate("/book");
    } else {
      localStorage.setItem("redirectAfterLogin", "/book");
      navigate("/signin");
    }
  };


  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await fetchCategories();
        setRoomCategories(Array.isArray(categories) ? categories : []);
      } catch (err) {
        console.error("Failed to fetch room categories", err);
        setRoomCategories([]);
      }
    };
    getCategories();
  }, []);

  const Dropdown = ({ selected }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) =>
      setAnchorEl(anchorEl ? null : event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <Box sx={{ display: "inline-block" }}>
        <Button
          id="rooms-button"
          aria-controls={open ? "rooms-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={
            <KeyboardArrowDownIcon sx={{ color: "#fff", fontSize: 20 }} />
          }
          sx={{
            color: "#fff",
            textTransform: "none",
            fontSize: "16px",
            padding: 0,
            minWidth: "auto",
            cursor: "pointer",
            borderBottom: selected
              ? `2px solid ${theme.palette.secondary.main}`
              : "2px solid transparent",
            ":hover": {
              backgroundColor: "transparent",
              borderBottom: `2px solid ${theme.palette.secondary.main}`,
              color: "#fff",
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
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          MenuListProps={{ "aria-labelledby": "rooms-button" }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/rooms");
            }}
          >
            All Rooms
          </MenuItem>
          {roomCategories.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => {
                handleClose();
                navigate(`/rooms/${toSlug(item.categoryName)}`);
              }}
            >
              {item.categoryName}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  };

  const NavItem = ({ to, children, selected }) => (
    <Typography
      component={Link}
      to={to}
      sx={{
        color: "#fff",
        textDecoration: "none",
        fontSize: "16px",
        pb: 0.5,
        borderBottom: selected
          ? `2px solid ${theme.palette.secondary.main}`
          : "2px solid transparent",
        ":hover": {
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
          color: "#fff",
        },
        transition: "border-bottom 0.3s ease",
      }}
    >
      {children}
    </Typography>
  );

  const MobileNavItem = ({ to, label, onClick }) => (
    <MenuItem
      component={to ? Link : "div"}
      to={to}
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        paddingY: 1,
        fontWeight: 500,
        fontSize: 16,
        color: "text.primary",
        textDecoration: "none",
        ":hover": {
          color: "secondary.main",
          backgroundColor: "transparent",
        },
      }}
    >
      {label}
    </MenuItem>
  );

  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="absolute"
        sx={{
          background:
            navColor === "transparent"
              ? "transparent"
              : theme.palette[navColor].main,
          boxShadow: "none",
          px: { xs: 2, md: 12 },
          py: { md: 1 },
          zIndex: theme.zIndex.appBar + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            minHeight: { xs: 80, md: "auto" },
          }}
        >
          {/* Logo & Desktop Nav */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0, md: 5 },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{
                height: { xs: 60, md: 70 },
                p: 0.5,
                width: "auto",
                mt: 1,
                border: "3px solid white",
                boxShadow: "0 0 10px rgba(255,255,255,0.4)",
              }}
            />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5, pl: 4 }}>
              <NavItem to="/" selected={isSelected("/")}>
                Home
              </NavItem>
              <NavItem to="/about" selected={isSelected("/about")}>
                About
              </NavItem>
              <NavItem to="/activities" selected={isSelected("/activities")}>
                Activities
              </NavItem>
              <Dropdown selected={isSelected("/rooms")} />
              <NavItem to="/services" selected={isSelected("/services")}>
                Services
              </NavItem>
              <NavItem to="/contact" selected={isSelected("/contact")}>
                Contact
              </NavItem>
              <Typography
                onClick={handleBookNow}
                sx={{
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "16px",
                  pb: 0.5,
                  borderBottom: isSelected("/book")
                    ? `2px solid ${theme.palette.secondary.main}`
                    : "2px solid transparent",
                  ":hover": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  },
                }}
              >
                Book Now
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {userName ? (
              <>
                <Button
                  onClick={handleUserMenuClick}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{ color: "#fff", fontSize: 20 }}
                    />
                  }
                >
                  {userName}
                </Button>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
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
                    color: "#fff",
                    border: "1px solid #fff",
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
                    backgroundColor: "#fff",
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

          {/* Mobile Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon sx={{ color: "#fff" }} />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            PaperProps={{
              sx: {
                width: "70vw",
                height: "100%",
                bgcolor: theme.palette.background.paper,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box
                  component="img"
                  src={logo}
                  alt="logo"
                  sx={{ height: 60, width: "auto" }}
                />
                <IconButton onClick={() => setMobileOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <MobileNavItem
                to="/"
                label="Home"
                onClick={() => setMobileOpen(false)}
              />
              <MobileNavItem
                to="/about"
                label="About"
                onClick={() => setMobileOpen(false)}
              />
              <MobileNavItem
                to="/activities"
                label="Activities"
                onClick={() => setMobileOpen(false)}
              />

              {/* Mobile Rooms Dropdown */}
              <Box sx={{ width: "100%" }}>
                <MobileNavItem
                  label="Rooms"
                  onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                </MobileNavItem>
                {mobileRoomsOpen && (
                  <Box
                    sx={{
                      pl: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <MobileNavItem
                      to="/rooms"
                      label="All Rooms"
                      onClick={() => setMobileOpen(false)}
                    />
                    {roomCategories.map((item) => (
                      <MobileNavItem
                        key={item.id}
                        to={`/rooms/${toSlug(item.categoryName)}`}
                        label={item.categoryName}
                        onClick={() => setMobileOpen(false)}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              <MobileNavItem
                to="/services"
                label="Services"
                onClick={() => setMobileOpen(false)}
              />
              <MobileNavItem
                to="/contact"
                label="Contact"
                onClick={() => setMobileOpen(false)}
              />
              <MobileNavItem
                label="Book Now"
                onClick={() => {
                  setMobileOpen(false);
                  handleBookNow();
                }}
              />

              {userName ? (
                <MobileNavItem
                  label="Logout"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                />
              ) : (
                <>
                  <MobileNavItem
                    to="/signin"
                    label="Sign In"
                    onClick={() => setMobileOpen(false)}
                  />
                  <MobileNavItem
                    to="/signup"
                    label="Sign Up"
                    onClick={() => setMobileOpen(false)}
                  />
                </>
              )}
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>

     
      <Box sx={{ flex: 1 }} key={location.pathname}>
        {children}
      </Box>

     
      <Box sx={{ bgcolor: "white", pt: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="center">
            <Grid
              size={{ xs: 12, md: 4 }}
              textAlign={{ xs: "center", md: "left" }}
            >
              <Box
                component="img"
                src={logo}
                alt="Lalazar Family Resort"
                sx={{
                  width: 160,
                  height: "auto",
                  border: "4px solid black",
                  p: 1,
                  mx: { xs: "auto", md: 0 },
                  display: "block",
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
              textAlign={{ xs: "center", md: "left" }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, fontFamily: "serif" }}
              >
                Pages
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  component={Link}
                  to="/services"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "text.primary",
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  Services
                </Typography>
                <Typography
                  component={Link}
                  to="/rooms"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "text.primary",
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  Rooms
                </Typography>
                <Typography
                  component={Link}
                  to="/contact"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "text.primary",
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  Contact
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
              textAlign={{ xs: "center", md: "left" }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, fontFamily: "serif" }}
              >
                Get In Touch
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <PhoneIcon sx={{ color: "secondary.main", fontSize: 34 }} />
                <Box>
                  <Typography>0332 8888489</Typography>
                  <Typography>0301 8132584</Typography>
                  <Typography>0346 9669176</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <EmailIcon sx={{ color: "secondary.main" }} />
                <Typography>lalazarfamilyresortshogran@gmail.com</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <EmailIcon sx={{ color: "secondary.main" }} />
                <Typography>contact@lalazarfamilyresort.com</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <RoomIcon sx={{ color: "secondary.main" }} />
                <Typography>
                  Shogran Rd, Shogran Kaghan, Mansehra, Khyber Pakhtunkhwa
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{ bgcolor: "secondary.main", textAlign: "center", py: 2, mt: 6 }}
        >
          <Typography sx={{ color: "white", fontWeight: 500 }}>
            Copyright & Design By @Lalazar Family Resort {currentYear}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
