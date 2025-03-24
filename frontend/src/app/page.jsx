"use client";

import { useState } from "react";
import NavBar from "@/app/components/NavBar";
import SideMenu from "@/app/components/SideMenu";
import { Box, Typography, Container } from "@mui/material";
import Link from "next/link";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <NavBar />
      <SideMenu />
      
      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h2" color="#333" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Typography variant="body1" color="#112F25">
          This is the home page of your website.
        </Typography>
        <Link href="/institutes" passHref>
          <Typography variant="body1" color="#112F25" sx={{ textDecoration: "underline", cursor: "pointer" }}>
            Institutes
          </Typography></Link>
        
      </Container>
    </Box>
    </>
  );
}
