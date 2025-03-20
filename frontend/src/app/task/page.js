"use client";

import { Typography, Container, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";


const TaskPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <NavBar />
        <SideMenu />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Learning Journal
        </Typography>
        <Typography variant="body1">
          Welcome to your learning journal! Here, you can track your progress, add notes, and reflect on your learning journey.
        </Typography>
      </Box>
    </Container>
  );
};

export default TaskPage;