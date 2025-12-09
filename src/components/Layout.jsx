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

    return () => unsubscribe();
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

  // Dropdown for desktop
  const Dropdown = ({ selected, theme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          cursor: "pointer", // Added for pointer cursor
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
        MenuListProps={{
          "aria-labelledby": "rooms-button",
        }}
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

  const MobileNavItem = ({ to, children, onClick }) => (
    <MenuItem
      component={to ? Link : "div"}
      to={to}
      onClick={onClick}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      {children}
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
          >
            <Box sx={{ width: 250, p: 2 }}>
              <MobileNavItem to="/" onClick={() => setMobileOpen(false)}>
                Home
              </MobileNavItem>
              <MobileNavItem to="/about" onClick={() => setMobileOpen(false)}>
                About
              </MobileNavItem>
              <MobileNavItem to="/activities" onClick={() => setMobileOpen(false)}>
                Activities
              </MobileNavItem>

              <Box>
                <Button
                  onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
                  sx={{
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    fontWeight: "bold",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Rooms
                </Button>
                {mobileRoomsOpen && (
                  <Box sx={{ pl: 2 }}>
                    {roomCategories.map((item) => (
                      <MobileNavItem
                        key={item.id}
                        to={`/rooms/${toSlug(item.categoryName)}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.categoryName}
                      </MobileNavItem>
                    ))}
                  </Box>
                )}
                {!mobileRoomsOpen && (
                  <Box sx={{ pl: 2, mt: 1 }}>
                    <Button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/rooms");
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Go to Rooms Main Page
                    </Button>
                  </Box>
                )}
              </Box>

              <MobileNavItem to="/services" onClick={() => setMobileOpen(false)}>
                Services
              </MobileNavItem>
              <MobileNavItem to="/contact" onClick={() => setMobileOpen(false)}>
                Contact
              </MobileNavItem>
              <MobileNavItem
                to="#"
                onClick={() => {
                  setMobileOpen(false);
                  handleBookNow();
                }}
              >
                Book Now
              </MobileNavItem>

              {userName ? (
                <MobileNavItem
                  to="/"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </MobileNavItem>
              ) : (
                <>
                  <MobileNavItem to="/signin" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </MobileNavItem>
                  <MobileNavItem to="/signup" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </MobileNavItem>
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
                {["Services", "Rooms", "Contacts"].map((item, i) => (
                  <Typography
                    key={i}
                    sx={{
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": { color: "secondary.main" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
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
