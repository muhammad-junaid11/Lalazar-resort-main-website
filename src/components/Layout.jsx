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
import { auth, db } from "../services/Firebase/Firebase"; // make sure paths are correct
import { collection, query, where, getDocs } from "firebase/firestore";
import logo from "../assets/logo.jpg"; // adjust path
import Cookies from "js-cookie";

const Layout = ({ children,navColor = "transparent"}) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Navbar logic
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "users"),
            where("userEmail", "==", user.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            const fetchedUserName =
              data.userName || user.email.split("@")[0] || "User";
            setUserName(fetchedUserName);
            localStorage.setItem("userName", fetchedUserName);
          } else {
            const defaultName = user.email.split("@")[0] || "User";
            setUserName(defaultName);
            localStorage.setItem("userName", defaultName);
          }
        } catch (err) {
          const fallbackName = user.email.split("@")[0] || "User";
          setUserName(fallbackName);
          localStorage.setItem("userName", fallbackName);
        }
      } else {
        setUserName(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
      }
    });

    return () => unsubscribe();
  }, []);

const handleLogout = () => {
  auth.signOut();
  Cookies.remove("userToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("redirectAfterLogin"); // clear pending redirects
  sessionStorage.clear();
  setUserName(null);
  setUserMenuAnchorEl(null);
  navigate("/");
};


  const handleUserMenuClick = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);
  const isSelected = (path) => location.pathname === path;

  // Rooms dropdown
  const roomsSubMenu = [
    { label: "Deluxe Room", to: "/rooms/deluxe" },
    { label: "Executive Room", to: "/rooms/executive" },
    { label: "Family Room", to: "/rooms/family" },
    { label: "Luxury Room", to: "/rooms/luxury" },
  ];

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

  const MobileNavItem = ({ to, children, setMobileOpen }) => (
    <MenuItem component={Link} to={to} onClick={() => setMobileOpen(false)}>
      {children}
    </MenuItem>
  );

  // Footer
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="absolute"
        sx={{
          background: navColor === "transparent" ? "transparent" : theme.palette[navColor].main,
          boxShadow: "none",
          px: { xs: 2, md: 12 },
          py:{md:1},
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
                p:0.5,
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
              <NavItem
                to="/about"
                selected={isSelected("/about")}
                theme={theme}
              >
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

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {userName ? (
              <>
                <Button
                  id="user-menu-button"
                  aria-controls={
                    Boolean(userMenuAnchorEl) ? "user-menu" : undefined
                  }
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

      {/* Page content */}
      <Box
        sx={{
          flex: 1,
          // ❌ REMOVE the padding/margin compensation here. We move it to HomePage.jsx
        }}
        key={location.pathname}  // ⭐ ADD THIS: Forces remounting of children on path change
      >
        {children}
      </Box>

      {/* Footer */}
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
