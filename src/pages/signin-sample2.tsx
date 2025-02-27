import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

const Login: React.FC = () => {
  return (
    <Grid container sx={{ height: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Left Section - Illustration */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F4F7FE",
          padding: 4,
        }}
      >
        <Box component="img" src="/illustration.png" alt="Illustration" sx={{ width: "60%" }} />
      </Grid>

      {/* Right Section - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          {/* Logo & Heading */}
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Welcome to Modernize
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
            Your Admin Dashboard
          </Typography>

          {/* Social Login Buttons */}
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ textTransform: "none", borderRadius: "8px" }}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{ textTransform: "none", borderRadius: "8px" }}
            >
              Sign in with FB
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ mb: 3 }}>or sign in with</Divider>

          {/* Username Input */}
          <TextField fullWidth label="Username" variant="outlined" margin="normal" />

          {/* Password Input */}
          <TextField fullWidth label="Password" variant="outlined" margin="normal" type="password" />

          {/* Remember Me & Forgot Password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormControlLabel control={<Checkbox />} label="Remember this Device" />
            <Typography variant="body2" sx={{ color: "#1976D2", cursor: "pointer" }}>
              Forgot Password?
            </Typography>
          </Box>

          {/* Sign-in Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#5A67D8",
              color: "white",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              mb: 2,
            }}
          >
            Sign In
          </Button>

          {/* Sign Up Option */}
          <Typography variant="body2" align="center">
            New to Modernize?{" "}
            <Typography component="span" sx={{ color: "#5A67D8", fontWeight: "bold", cursor: "pointer" }}>
              Create an account
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
