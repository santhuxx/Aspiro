"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter();
  const menuItems = ["Home", "About Us", "Contact Us", "Login", "Sign Up"];
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (item) => {
    const path = item.toLowerCase().replace(/\s+/g, "");
    router.push(`/${path}`);
    setMobileOpen(false);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#133429" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left Side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/images/logo.png" alt="Logo" width={150} height={50} priority />
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: "block", md: "none" }, color: "white" }}
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Center - Navigation Links (Hidden on Small Screens) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {menuItems.slice(0, 3).map((item, index) => (
            <Button
              key={index}
              onClick={() => handleNavigation(item)}
              sx={{ color: "white", fontSize: "16px", "&:hover": { color: "#62f3c5" } }}
            >
              {item}
            </Button>
          ))}
        </Box>

        {/* Right Side - Profile/Login Buttons (Hidden on Small Screens) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
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

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <List sx={{ width: 250, backgroundColor: "#1A4538", height: "100%" }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item)}>
                <ListItemText primary={item} sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ backgroundColor: "white" }} />
          <ListItem disablePadding>
            <ListItemButton>
              <AccountCircle sx={{ color: "white", mr: 2 }} />
              <ListItemText primary="Profile" sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
