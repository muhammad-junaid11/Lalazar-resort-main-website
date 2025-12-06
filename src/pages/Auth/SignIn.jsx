import React, { useState } from "react"; // Added useState for loading state
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  Link,
  CircularProgress, // Added for loading indicator
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextFieldInput from "../../components/Form/TextFieldInput";
import bgImage from "../../assets/img1.webp";
import logo from "../../assets/logo.jpg";
import Cookies from "js-cookie";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../services/Firebase/Firebase";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const SignIn = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isResetLoading, setIsResetLoading] = useState(false); // Loading state for forgot password
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      userEmail: "",
      password: "",
    },
  });

  const inputSx = {
    mt: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& .MuiInputBase-input": {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "#fff",
        padding: "10px 10px",
        "&:-webkit-autofill": {
          backgroundColor: "rgba(255,255,255,0.08) !important",
          WebkitBoxShadow:
            "0 0 0 1000px rgba(255,255,255,0.08) inset !important",
          WebkitTextFillColor: "#fff !important",
          transition: "background-color 5000s ease-in-out 0s",
        },
      },
      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 0 1px ${theme.palette.secondary.main}`,
      },
      "& .MuiInputAdornment-root": {
        background: "transparent",
        height: "100%",
        margin: 0,
        "& .MuiSvgIcon-root": { color: theme.palette.secondary.main },
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.7)",
      "&.Mui-focused": { color: theme.palette.secondary.main },
      "&:not(.MuiInputLabel-shrink)": {
        transform: "translate(10px, 10px) scale(1)",
      },
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
        color: "rgba(255,255,255,0.7)",
      },
      '&.MuiInputLabel-root[data-shrink="false"]': {
        transform: "translate(10px, 10px) scale(1)",
      },
    },
  };

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.userEmail,
      data.password
    );
    const user = userCredential.user;

    // Store user token
 const token = await user.getIdToken();
Cookies.set("userToken", token, { expires: 1, sameSite: "Lax" }); 

    alert("Signed in successfully!");

    // Only redirect if user clicked Book Now before
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin"); // clear after redirect
      navigate(redirectPath);
    } else {
      navigate("/"); // default home page
    }
  } catch (error) {
    console.error("Sign in error:", error);
    alert("Failed to sign in. Check your credentials.");
  } finally {
    setIsLoading(false);
  }
};


  const handleForgotPassword = async () => {
    const email = getValues("userEmail")?.trim();
    if (!email) return alert("Please enter your email first!");

    setIsResetLoading(true); // Start loading
    try {
      console.log(`Attempting to send password reset email to: ${email}`);
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully (per Firebase).");
      alert(
        `Password reset email sent to ${email}. If you don't see it, check your spam folder or ensure your Firebase project is configured for email sending.`
      );
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else {
        alert(error.message || "Failed to send reset email.");
      }
    } finally {
      setIsResetLoading(false); // Stop loading
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          // backdropFilter: "blur(6px)",
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: "18px",
          width: { xs: "90%", sm: "400px" },
          zIndex: 1,
          background: "rgba(50, 53, 29, 0.7)",
          backdropFilter: "blur(7px) saturate(170%)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
            gap: 1, // spacing between logo and text
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: { xs: 70, sm: 50 },
              height: "auto",
              borderRadius: "10px",
              border: "2px solid rgba(254, 255, 253, 0.4)",
              p: "0.5px",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.secondary.main,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Lalazar Resort
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{ color: "#fff", textAlign: "center", mb: 3, fontWeight: 400 }}
        >
          Login
        </Typography>

        {/* <Box sx={{ textAlign: "center", mb: 3 }}>
          <PersonOutlineIcon
            sx={{ fontSize: "4rem", color: "rgba(255,255,255,0.7)" }}
          />
        </Box> */}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextFieldInput
              name="userEmail"
              control={control}
              label="Email"
              type="email"
              rules={{ required: "Email is required" }}
              sx={inputSx}
            />

            <TextFieldInput
              name="password"
              control={control}
              label="Password"
              type="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 8 characters",
                },
              }}
              sx={inputSx}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
                disabled={isResetLoading}
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {isResetLoading && (
                  <CircularProgress size={14} sx={{ color: "#fff" }} />
                )}
                Forgot your password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                borderRadius: "25px",
                backgroundColor: theme.palette.secondary.main,
                color: "#fff",
                py: 1.2,
                textTransform: "none",
                "&:hover": { backgroundColor: theme.palette.secondary.dark },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Login"
              )}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography sx={{ color: "#fff", fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/signup")}
              sx={{
                color: theme.palette.secondary.main,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
