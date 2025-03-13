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
import LockIcon from "@mui/icons-material/Lock";
import BuildIcon from "@mui/icons-material/Build";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const features = [
  {
    icon: <LockIcon sx={{ color: "#1976D2" }} />,
    title: "Adaptable performance",
    description:
      "Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.",
  },
  {
    icon: <BuildIcon sx={{ color: "#1976D2" }} />,
    title: "Built to last",
    description:
      "Experience unmatched durability that goes above and beyond with lasting investment.",
  },
  {
    icon: <ThumbUpIcon sx={{ color: "#1976D2" }} />,
    title: "Great user experience",
    description:
      "Integrate our product into your routine with an intuitive and easy-to-use interface.",
  },
  {
    icon: <AutoAwesomeIcon sx={{ color: "#1976D2" }} />,
    title: "Innovative functionality",
    description:
      "Stay ahead with features that set new standards, addressing your evolving needs better than the rest.",
  },
];

const Login: React.FC = () => {
  return (
    <Grid container sx={{ height: "100vh", backgroundColor: "#F7F9FC" }}>
      {/* Left Section - Features */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "left",
          padding: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976D2" }}>
          ✨ Sitemark
        </Typography>
        <Box sx={{ mt: 3, width: "70%" }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
            >
              <Box sx={{ mr: 2 }}>{feature.icon}</Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
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
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ width: "80%", maxWidth: 400 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
            Sign in
          </Typography>

          {/* Email Input */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
          />

          {/* Password Input */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
          />

          {/* Remember Me & Forgot Password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Typography variant="body2" sx={{ color: "#1976D2", cursor: "pointer" }}>
              Forgot your password?
            </Typography>
          </Box>

          {/* Sign-in Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #000, #333)",
              color: "white",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              mb: 2,
            }}
          >
            Sign in
          </Button>

          {/* Sign Up Option */}
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Don't have an account?{" "}
            <Typography
              component="span"
              sx={{ color: "#1976D2", fontWeight: "bold", cursor: "pointer" }}
            >
              Sign up
            </Typography>
          </Typography>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>or</Divider>

          {/* Social Login Buttons */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              mb: 1,
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Sign in with Facebook
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
