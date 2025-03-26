"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const SideMenu = () => {
  const [open, setOpen] = useState(false); // State to toggle menu visibility
  const router = useRouter(); // Initialize useRouter

  const handleNavigation = (path) => {
    setOpen(false); // Close menu
    router.push(path); // Navigate to specified page
  };

  return (
    <>
      {/* Menu Button */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: 80,
          left: 20,
          color: "#112F25",
          zIndex: 1000,
          cursor: "pointer", // Ensure cursor changes to pointer on hover
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* MUI Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#1A4538",
            color: "white",
          },
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => handleNavigation("/Courses")}
            sx={{ cursor: "pointer" }} // Cursor as pointer for clickable items
          >
            <ListItemText primary="My courses" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/skills")}
            sx={{ cursor: "pointer" }} // Cursor as pointer for clickable items
          >
            <ListItemText primary="My Skills" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/task")}
            sx={{ cursor: "pointer" }} // Cursor as pointer for clickable items
          >
            <ListItemText primary="My learning journal" />
          </ListItem>
          <ListItem
            button
            onClick={() => setOpen(false)}
            sx={{ cursor: "pointer" }} // Cursor as pointer for clickable items
          >
            <ListItemText primary="My progress" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SideMenu;
