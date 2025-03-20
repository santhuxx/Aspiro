"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { AppBar, Toolbar, Button, Avatar, Menu, MenuItem, Typography, Box, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter(); // Initialize useRouter
  const menuItems = ["Home", "About Us", "Contact Us"];

  const handleNavigation = (item) => {
    if (item === "Home") {
      router.push("/home"); // Navigate to the home page
    }
    // Add navigation logic for other menu items if needed
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#133429" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left Side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/images/logo.png" alt="Logo" width={150} height={50} priority />
        </Box>

        {/* Center - Navigation Links */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleNavigation(item)} // Add onClick handler
              sx={{ color: "white", fontSize: "16px", "&:hover": { color: "#62f3c5" } }}
            >
              {item}
            </Button>
          ))}
        </Box>

        {/* Right Side - Profile/Login Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="contained" sx={{ backgroundColor: "#14523D", "&:hover": { backgroundColor: "#062b14" } }}>
            Login
          </Button>
          <Button variant="outlined" sx={{ borderColor: "white", color: "white", "&:hover": { backgroundColor: "#14523D" } }}>
            Sign Up
          </Button>
          <IconButton sx={{ color: "white" }}>
            <AccountCircle fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;