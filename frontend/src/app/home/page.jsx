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

    <NavBar />
    <SideMenu />
      <Box
        sx={{
          backgroundImage: `url('/images/Home_back.png')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Add the "Find best Institutes" text in the top-left */}
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: 180,
            left: 50,
            fontFamily: "Mplus 1p",
            fontWeight: "bold",
            fontSize: "55px",
            color: "#112F25",
            lineHeight: 1.2,
          }}
        >
          Find best
          <br />
          Institutes
        </Typography>
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: 330,
            left: 54,
            fontFamily: "Instrument Sans",
            fontWeight: "bold",
            fontSize: "10px",
            color: "#453C3C",
            lineHeight: 1.2,
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting <br/>
          industry. Lorem Ipsum has been the industry's standard dummy text<br/>
          ever since the 1500s, when an unknown printer took a galley of<br/> 
          type and scrambled it to make a type specimen book.
        </Typography>

        <Container sx={{ textAlign: "left", py: 10  }}>
          <Link href="/institutes" passHref>
            <Typography variant="body1" color="#112F25" sx={{ textDecoration: "underline", cursor: "pointer" }}>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/><br/><br/><br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            Find Institutes
            </Typography>
          </Link>
        </Container>

        {/* Ask for email if not entered yet */}
        {!emailEntered ? (
          <Container sx={{ textAlign: "center", py: 10, mt: 50 }}>
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
      </Box>
    </>
  );
}
