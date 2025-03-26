"use client";
import { useState } from "react";
import { Box, List, ListItem, ListItemText, IconButton, TextField, Button, Typography, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export default function SkillList() {
  const [skills, setSkills] = useState(["JavaScript", "React", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (event) => {
    setNewSkill(event.target.value);
    setMessage("");
  };

  // Function to check if the skill is a duplicate (case-insensitive)
  const isDuplicateSkill = (skill) => {
    return skills.some((existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase());
  };

  // Add or Update skill with validation
  const handleAddOrUpdateSkill = () => {
    const trimmedSkill = newSkill.trim();
    const skillRegex = /^[A-Za-z0-9\s]+$/; // Only allow letters, numbers, and spaces
    
    if (trimmedSkill === "") {
      setMessage("Skill cannot be empty!");
      return;
    }
    
    if (!skillRegex.test(trimmedSkill)) {
      setMessage("Skill should only contain letters, numbers, and spaces!");
      return;
    }

    if (editIndex !== null) {
      // Prevent editing to an existing skill (case-insensitive check)
      if (isDuplicateSkill(trimmedSkill)) {
        setMessage("This skill already exists!");
        return;
      }
      
      // Update skill
      const updatedSkills = [...skills];
      updatedSkills[editIndex] = trimmedSkill;
      setSkills(updatedSkills);
      setEditIndex(null);
    } else {
      // Prevent duplicate skills (case-insensitive check)
      if (isDuplicateSkill(trimmedSkill)) {
        setMessage("This skill already exists!");
        return;
      }

      // Add new skill
      setSkills([...skills, trimmedSkill]);
    }
    
    setNewSkill("");
  };

  // Remove skill
  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Edit skill
  const editSkill = (index) => {
    setNewSkill(skills[index]);
    setEditIndex(index);
    setMessage("");
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
      <Typography variant="h6" color="black" fontWeight="bold" align="center" sx={{ marginBottom: "10px" }}>
        My Skills
      </Typography>
      
      {message && <Alert severity="warning" sx={{ marginBottom: "10px" }}>{message}</Alert>}

      {/* Add/Edit Skill Input */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Add or Edit a skill"
          fullWidth
          value={newSkill}
          onChange={handleChange}
          sx={{ background: "#D9D9D9", borderRadius: "5px" }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#14523D", color: "white", "&:hover": { backgroundColor: "#062b14" } }}
          onClick={handleAddOrUpdateSkill}
          startIcon={<AddIcon />}
        >
          {editIndex !== null ? "Update" : "Add"}
        </Button>
      </Box>

      {/* Skill List */}
      <List>
        {skills.map((skill, index) => (
          <ListItem
            key={index}
            sx={{
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              color: "black",
            }}
          >
            <ListItemText primaryTypographyProps={{ variant: "h8" }} primary={skill} />
            <Box>
              <IconButton onClick={() => editSkill(index)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => removeSkill(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}