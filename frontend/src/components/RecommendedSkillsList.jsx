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

const RecommendedSkillsList = () => {
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skills = [
    {
      name: "JavaScript",
      courses: [
        "JavaScript Basics - Codecademy",
        "Modern JavaScript from the Beginning - Udemy",
      ],
      youtube: [
        "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      ],
    },
    {
      name: "React",
      courses: [
        "React for Beginners - Scrimba",
        "The Complete React Guide - Udemy",
      ],
      youtube: [
        "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        "https://www.youtube.com/watch?v=bMknfKXIFA8",
      ],
    },
    {
      name: "Node.js",
      courses: [
        "Node.js Basics - Udemy",
        "The Complete Node.js Developer Course - Udemy",
      ],
      youtube: [
        "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
      ],
    },
    {
      name: "MongoDB",
      courses: [
        "MongoDB Basics - MongoDB University",
        "Master MongoDB - Udemy",
      ],
      youtube: [
        "https://www.youtube.com/watch?v=FwMwO8pXfq0",
        "https://www.youtube.com/watch?v=oSIv-E60NiU",
      ],
    },
  ];

  const handleOpen = (skill) => {
    setSelectedSkill(skill);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSkill(null);
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
        Recommended Skills
      </Typography>
      <List>
        {skills.map((skill, index) => (
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
            <ListItemText primaryTypographyProps={{ variant:"h8"}} primary={skill.name} sx={{ flexGrow: 1 }} />

            {/* Show Recommended Courses */}
            <IconButton color="primary" onClick={() => handleOpen(skill)}>
              <ArrowForward />
            </IconButton>

            {/* Remove Skill (UI Only) */}
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
          {selectedSkill && (
            <>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                {selectedSkill.name}
              </Typography>
              <Typography variant="subtitle1">Courses:</Typography>
              <ul>
                {selectedSkill.courses.map((course, i) => (
                  <li key={i}>{course}</li>
                ))}
              </ul>
              <Typography variant="subtitle1">YouTube Links:</Typography>
              <ul>
                {selectedSkill.youtube.map((link, i) => (
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

export default RecommendedSkillsList