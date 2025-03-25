"use client";

import { useState, useEffect } from "react";
import NavBar from "@/app/components/NavBar";
import SideMenu from "@/app/components/SideMenu";
import FutureJobPopup from "@/app/components/FutureJobPopup";
import { Box, Typography, Container, TextField, Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const [email, setEmail] = useState(""); // Temporary email state
  const [emailEntered, setEmailEntered] = useState(false); // To check if email has been entered
  const [isClient, setIsClient] = useState(false); // Track if the app is running client-side

  useEffect(() => {
    setIsClient(true); // Set to true after the component is mounted (client-side)
  }, []);

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      setEmailEntered(true); // Show popup after email is entered
    } else {
      alert("Please enter a valid email.");
    }
  };

  if (!isClient) {
    return null; // Return null to prevent server-side mismatch
  }

  return (
    <>
      <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
        <NavBar />
        <SideMenu />

        <Container sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h2" color="#333" gutterBottom>
              Welcome to the Home Page
            </Typography>
          <Link href="/institutes" passHref>
            <Typography variant="body1" color="#112F25" sx={{ textDecoration: "underline", cursor: "pointer" }}>
              Find Institutes
            </Typography>
          </Link>
        </Container>
        
        {/* Ask for email if not entered yet */}
        {!emailEntered ? (
          <Container sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="body1" color="#112F25">
              Please enter your email to proceed.
            </Typography>
            <TextField
              label="Enter your email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mt: 2, mb: 3 }}
            />
            <Button variant="contained" onClick={handleEmailSubmit} sx={{ minWidth: 150 }}>
              Submit Email
            </Button>
          </Container>
        ) : (
          <FutureJobPopup
            visible={showPopup}
            onClose={() => setShowPopup(false)}
            email={email} // Pass email as prop to FutureJobPopup
          />
        )}
        
        {/* Show after email is entered */}
        
        
      </Box>
    </>
  );
}
