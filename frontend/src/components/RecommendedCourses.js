"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ArrowForward, RemoveCircle } from "@mui/icons-material";

const RecommendedCourses = () => {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      name: "JavaScript Basics",
      platforms: ["Codecademy", "Udemy"],
      youtube: [
        "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      ],
    },
    {
      name: "React for Beginners",
      platforms: ["Scrimba", "Udemy"],
      youtube: [
        "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        "https://www.youtube.com/watch?v=bMknfKXIFA8",
      ],
    },
    {
      name: "Node.js Basics",
      platforms: ["Udemy", "Coursera"],
      youtube: [
        "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
      ],
    },
    {
      name: "MongoDB Basics",
      platforms: ["MongoDB University", "Udemy"],
      youtube: [
        "https://www.youtube.com/watch?v=FwMwO8pXfq0",
        "https://www.youtube.com/watch?v=oSIv-E60NiU",
      ],
    },
  ];

  const handleOpen = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  return (
    <Box
      sx={{
        background: "#B5CFB4",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        maxWidth: "500px",
      }}
    >
      <Typography color="black" variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
        Recommended Courses
      </Typography>
      <List>
        {courses.map((course, index) => (
          <ListItem
            key={index}
            sx={{
              color: "black",  
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              paddingY: 1,
            }}
          >
            <ListItemText primaryTypographyProps={{ variant:"h8"}} primary={course.name} sx={{ flexGrow: 1 }} />

            {/* Show Recommended Platforms */}
            <IconButton color="primary" onClick={() => handleOpen(course)}>
              <ArrowForward />
            </IconButton>

            {/* Remove Course (UI Only) */}
            <IconButton color="error">
              <RemoveCircle />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Dialog Box for Recommendations */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Recommended Learning Resources</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                {selectedCourse.name}
              </Typography>
              <Typography variant="subtitle1">Platforms:</Typography>
              <ul>
                {selectedCourse.platforms.map((platform, i) => (
                  <li key={i}>{platform}</li>
                ))}
              </ul>
              <Typography variant="subtitle1">YouTube Links:</Typography>
              <ul>
                {selectedCourse.youtube.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecommendedCourses;