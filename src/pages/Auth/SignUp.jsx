import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  Link,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db, serverTimestamp, auth } from "../../services/Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import TextFieldInput from "../../components/Form/TextFieldInput";
import SelectInput from "../../components/Form/SelectInput";
import DatePickerInput from "../../components/Form/DatePickerInput";
import bgImage from "../../assets/img1.webp";

const SignUp = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      userName: "",
      userEmail: "",
      password: "",
      number: "",
      address: "",
      dob: null,
      gender: "",
    },
  });

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const inputSx = {
    mt: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& .MuiInputBase-input": {
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: "10px 10px",
        color: "#fff",
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
      "& .MuiInputAdornment-root": { marginTop: "0 !important" },
      "& .MuiSvgIcon-root": { color: theme.palette.secondary.main },
    },
    "& .MuiSelect-select": { color: "#fff", padding: "16.5px 14px" },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.7)",
      "&.Mui-focused": { color: theme.palette.secondary.main },
      "&:not(.MuiInputLabel-shrink)": {
        transform: "translate(14px, 10px) scale(1)",
      },
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
        color: "rgba(255,255,255,0.7)",
      },
    },
    "& .MuiInputBase-root": {
      "&.MuiInputBase-adornedEnd": {
        "& .MuiInputBase-input": { paddingRight: "0 !important" },
      },
    },
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.userEmail, data.password);

      await addDoc(collection(db, "users"), {
        userName: data.userName,
        userEmail: data.userEmail,
        password: data.password,
        number: data.number,
        address: data.address,
        dob: data.dob ? new Date(data.dob) : null,
        gender: data.gender,
        createdAt: serverTimestamp(),
      });

      console.log("User registered successfully!");
      navigate("/signin");
    } catch (error) {
      console.error("Error registering user:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            background: "rgba(0,0,0,0.60)",
            // backdropFilter: "blur(6px)",
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: "18px",
            width: { xs: "90%", sm: "450px", md: "800px" },
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
              gap: 1, 
            }}
          >
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
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={0.5} columnSpacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="userName"
                  control={control}
                  size="small"
                  label="Name"
                  rules={{
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="userEmail"
                  control={control}
                  size="small"
                  label="Email"
                  type="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="password"
                  control={control}
                  size="small"
                  label="Password"
                  type="password"
                  rules={{
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{6,}$/,
                      message:
                        "Password must be at least 6 characters and include uppercase, lowercase, number, and special character",
                    },
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="number"
                  control={control}
                  size="small"
                  label="Phone Number"
                  rules={{
                    required: "Phone Number is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Phone Number cannot contain letters",
                    },
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextFieldInput
                  name="address"
                  control={control}
                  size="small"
                  label="Address"
                  rules={{ required: "Address is required" }}
                  sx={inputSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DatePickerInput
                  name="dob"
                  control={control}
                  size="small"
                  label="Date of Birth"
                  rules={{ required: "Date of Birth is required" }}
                  sx={inputSx}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SelectInput
                  name="gender"
                  control={control}
                  size="small"
                  label="Gender"
                  options={genderOptions}
                  rules={{ required: "Gender is required" }}
                  sx={{
                    ...inputSx,
                    "& .MuiMenuItem-root:hover": {
                      backgroundColor: theme.palette.secondary.main + "22",
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    borderRadius: "25px",
                    backgroundColor: theme.palette.secondary.main,
                    color: "#fff",
                    py: 1.1,
                    px: 6,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography sx={{ color: "#fff", fontSize: "0.875rem" }}>
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/signin")}
                sx={{
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default SignUp;
