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
import { auth, db } from "../services/Firebase/Firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import logo from "../assets/logo.jpg";
import Cookies from "js-cookie";

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
    text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      const token = Cookies.get("userToken");
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().userName || "User");
          localStorage.setItem("userName", userDoc.data().userName || "User");
        }
      } else {
        if (token) handleLogout();
      }
    });

    // Close mobile drawer automatically on large screens
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
  }, []);

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

  const handleUserMenuClick = (event) => setUserMenuAnchorEl(event.currentTarget);
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

  // Fetch room categories dynamically
  useEffect(() => {
    const fetchRoomCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "roomCategory"));
        const categories = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoryName: doc.data().categoryName,
        }));
        setRoomCategories(categories);
      } catch (err) {
        console.error("Failed to fetch room categories", err);
      }
    };
    fetchRoomCategories();
  }, []);

  const Dropdown = ({ selected, theme }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
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
            cursor: "pointer",
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
            backgroundColor: "transparent",
            minHeight: { xs: 80, md: "auto" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0, md: 5 },
              backgroundColor: "transparent",
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
                bgcolor: "transparent",
              }}
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

              <Typography
                onClick={handleBookNow}
                sx={{
                  cursor: "pointer",
                  color: theme.palette.primary.contrastText,
                  textDecoration: "none",
                  fontSize: "16px",
                  pb: 0.5,
                  borderBottom: isSelected("/book")
                    ? `2px solid ${theme.palette.secondary.main}`
                    : "2px solid transparent",
                  ":hover": {
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                    color: theme.palette.primary.contrastText,
                  },
                  transition: "border-bottom 0.3s ease",
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
                  id="user-menu-button"
                  aria-controls={Boolean(userMenuAnchorEl) ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(userMenuAnchorEl) ? "true" : undefined}
                  onClick={handleUserMenuClick}
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{
                        color: theme.palette.primary.contrastText,
                        fontSize: 20,
                      }}
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
                  onClick={() => localStorage.removeItem("redirectAfterLogin")}
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

          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon sx={{ color: theme.palette.primary.contrastText }} />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
  anchor="right"
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
  PaperProps={{
    sx: {
      width: "70vw",        // 70% of viewport width
      height: "100%",
      bgcolor: theme.palette.background.paper,
      // position: "relative",  <-- REMOVE THIS
    },
  }}
  BackdropProps={{
    sx: {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  }}
>
 <Box sx={{ p: 2 }}>
  {/* Logo + Close Button */}
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
    <Box component="img" src={logo} alt="logo" sx={{ height: 60, width: "auto" }} />
    <IconButton onClick={() => setMobileOpen(false)}>
      <CloseIcon />
    </IconButton>
  </Box>

  {/* Main Items */}
  <MobileNavItem to="/" label="Home" onClick={() => setMobileOpen(false)} />
  <MobileNavItem to="/about" label="About" onClick={() => setMobileOpen(false)} />
  <MobileNavItem to="/activities" label="Activities" onClick={() => setMobileOpen(false)} />

  {/* Rooms Dropdown */}
{/* Rooms Dropdown */}
<Box sx={{ width: "100%" }}>
  <MobileNavItem
    label="Rooms"
    onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
    sx={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    }}
  >
    <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
  </MobileNavItem>

  {mobileRoomsOpen && (
    <Box sx={{ pl: 3, display: "flex", flexDirection: "column", gap: 0.5 }}>
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


  <MobileNavItem to="/services" label="Services" onClick={() => setMobileOpen(false)} />
  <MobileNavItem to="/contact" label="Contact" onClick={() => setMobileOpen(false)} />
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
      <MobileNavItem to="/signin" label="Sign In" onClick={() => setMobileOpen(false)} />
      <MobileNavItem to="/signup" label="Sign Up" onClick={() => setMobileOpen(false)} />
    </>
  )}
</Box>

          </Drawer>
        </Toolbar>
      </AppBar>

      {/* Page content */}
      <Box sx={{ flex: 1 }} key={location.pathname}>
        {children}
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "white", pt: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="center">
            <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "center", md: "left" }}>
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

            <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "center", md: "left" }}>
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
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    sx={{
      cursor: "pointer",
      
      textDecoration: "none",
      color: "text.primary",
      transition: "0.3s",
      "&:hover": { color: "secondary.main" },
    }}
  >
    Services
  </Typography>
  <Typography
    component={Link}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    to="/rooms"
    sx={{
      cursor: "pointer",
      textDecoration: "none",
      color: "text.primary",
      transition: "0.3s",
      "&:hover": { color: "secondary.main" },
    }}
  >
    Rooms
  </Typography>
  <Typography
    component={Link}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    to="/contact"
    sx={{
      cursor: "pointer",
      textDecoration: "none",
      color: "text.primary",
      transition: "0.3s",
      "&:hover": { color: "secondary.main" },
    }}
  >
    Contact
  </Typography>
</Box>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "center", md: "left" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, fontFamily: "serif" }}
              >
                Get In Touch
              </Typography>
              <Typography sx={{ mb: 2, color: "grey.600" }}>
                Feel free to reach out to us for any inquiries.
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
          sx={{
            bgcolor: "secondary.main",
            textAlign: "center",
            py: 2,
            mt: 6,
          }}
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
