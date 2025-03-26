"use client";
import {Grid,Box,Container, Typography } from "@mui/material";
import NavBar from "@/app/components/NavBar";
import SideMenu from "@/app/components/SideMenu";
import SkillList from "../components/SkillList";

export default function SkillsPage() {
  return (
    <>
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <NavBar />
      <SideMenu />

      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h3" color="#333" gutterBottom>
          My Courses
        </Typography>
      </Container>

      </Box>
    </>

      
 
  );
}