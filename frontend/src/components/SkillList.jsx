'use client';
import { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, IconButton, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";

export default function SkillList() {
  const { currentUser, loading: authLoading } = useAuth();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch skills from Firestore when user is authenticated
  useEffect(() => {
    const fetchSkills = async () => {
      if (!currentUser || authLoading) return;

      setLoading(true);
      setError("");
      try {
        const docRef = doc(db, "userSkills", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSkills(data.techSkills || []);
          console.log("Fetched skills:", data.techSkills || []);
        } else {
          setSkills([]);
          console.log("No skills document found for user:", currentUser.email);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to fetch skills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [currentUser, authLoading]);

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
  const handleAddOrUpdateSkill = async () => {
    if (!currentUser) {
      setMessage("Please log in to add or update skills.");
      return;
    }

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

    setLoading(true);
    setError("");
    try {
      const docRef = doc(db, "userSkills", currentUser.email);
      let updatedSkills = [...skills];

      if (editIndex !== null) {
        // Prevent editing to an existing skill (case-insensitive check)
        if (isDuplicateSkill(trimmedSkill)) {
          setMessage("This skill already exists!");
          setLoading(false);
          return;
        }

        // Update skill locally
        updatedSkills[editIndex] = trimmedSkill;
        setEditIndex(null);
      } else {
        // Prevent duplicate skills (case-insensitive check)
        if (isDuplicateSkill(trimmedSkill)) {
          setMessage("This skill already exists!");
          setLoading(false);
          return;
        }

        // Add new skill locally
        updatedSkills = [...skills, trimmedSkill];
      }

      // Save to Firestore
      await setDoc(docRef, {
        techSkills: updatedSkills,
        softSkills: (await getDoc(docRef)).data()?.softSkills || [],
        jobs: (await getDoc(docRef)).data()?.jobs || [],
        internship: (await getDoc(docRef)).data()?.internship || ""
      }, { merge: true });

      setSkills(updatedSkills);
      setNewSkill("");
      console.log("Skills updated in Firestore:", updatedSkills);
    } catch (err) {
      console.error("Error saving skill:", err);
      setError("Failed to save skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Remove skill
  const removeSkill = async (index) => {
    if (!currentUser) {
      setMessage("Please log in to delete skills.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const updatedSkills = skills.filter((_, i) => i !== index);
      const docRef = doc(db, "userSkills", currentUser.email);

      // Update Firestore
      await setDoc(docRef, {
        techSkills: updatedSkills,
        softSkills: (await getDoc(docRef)).data()?.softSkills || [],
        jobs: (await getDoc(docRef)).data()?.jobs || [],
        internship: (await getDoc(docRef)).data()?.internship || ""
      }, { merge: true });

      setSkills(updatedSkills);
      console.log("Skill deleted from Firestore:", updatedSkills);
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError("Failed to delete skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit skill
  const editSkill = (index) => {
    setNewSkill(skills[index]);
    setEditIndex(index);
    setMessage("");
  };

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, maxWidth: "500px", mx: "auto" }}>
        <Alert severity="warning">Please log in to view and manage your skills.</Alert>
      </Box>
    );
  }

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
      {error && <Alert severity="error" sx={{ marginBottom: "10px" }}>{error}</Alert>}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Add/Edit Skill Input */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Add or Edit a skill"
          fullWidth
          value={newSkill}
          onChange={handleChange}
          sx={{ background: "#D9D9D9", borderRadius: "5px" }}
          disabled={loading}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#14523D", color: "white", "&:hover": { backgroundColor: "#062b14" } }}
          onClick={handleAddOrUpdateSkill}
          startIcon={<AddIcon />}
          disabled={loading}
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
              <IconButton onClick={() => editSkill(index)} color="primary" disabled={loading}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => removeSkill(index)} color="error" disabled={loading}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}