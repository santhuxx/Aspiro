"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import FutureJobPopup from "../components/FutureJobPopup";
import SideMenu from "../components/SideMenu";
import { Box, Typography, Container } from "@mui/material";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <NavBar />
      <SideMenu />
      {showPopup && <FutureJobPopup visible={showPopup} onClose={() => setShowPopup(false)} />}
      
      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h2" color="#333" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Typography variant="body1" color="#112F25">
          This is the home page of your website.
        </Typography>
      </Container>
    </Box>
  );
}
