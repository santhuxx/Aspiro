'use client';
import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert
} from "@mui/material";
import { ArrowForward, RemoveCircle } from "@mui/icons-material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const RecommendedSkillsList = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GEMINI_API_KEY = "AIzaSyCk_vpgdzjOAOhozrJZXb9s3nsn1DUloqA";

  // Fetch suggested skills
  useEffect(() => {
    const fetchSkillSuggestions = async (email) => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching suggestions for email:", email);
        const skillsDoc = await getDoc(doc(db, "userSkills", email));
        const finalJobDoc = await getDoc(doc(db, "finalJobDecisions", email));

        console.log("RecommendedSkillsList Firestore fetch:", {
          skillsDoc: skillsDoc.exists() ? skillsDoc.data() : "Not found",
          finalJobDoc: finalJobDoc.exists() ? finalJobDoc.data() : "Not found"
        });

        const userSkills = skillsDoc.exists()
          ? { techSkills: skillsDoc.data().techSkills || [], softSkills: skillsDoc.data().softSkills || [] }
          : { techSkills: [], softSkills: [] };
        const finalJob = finalJobDoc.exists() ? finalJobDoc.data().finalJob || "Not specified" : "Not specified";

        if (finalJob === "Not specified") {
          throw new Error("No final job decision found. Please select a job in Job Match Result.");
        }

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Act as a career advisor. Given a user's current skills and their chosen future job, suggest up to 10 skills (technical or soft) they should acquire to be better prepared for the job. Return only a valid JSON object with fields: { job: string, suggestedSkills: array of strings, explanation: string }.\nJob: ${finalJob}\nCurrent Skills: ${JSON.stringify(userSkills)}`
                  }
                ]
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Gemini API raw response:", response.data);
        const resultText = response.data.candidates[0].content.parts[0].text;
        let suggestionResult;
        try {
          const jsonMatch = resultText.match(/{[\s\S]*}/);
          if (!jsonMatch) {
            throw new Error("No valid JSON found in response");
          }
          suggestionResult = JSON.parse(jsonMatch[0]);
          console.log("Parsed suggestions:", suggestionResult);
        } catch (parseError) {
          console.error("Failed to parse skill suggestion JSON:", parseError, "Raw text:", resultText);
          throw new Error("Failed to parse API response");
        }

        // Transform suggestedSkills into skills array with placeholder resources
        const transformedSkills = suggestionResult.suggestedSkills.map(skill => ({
          name: skill,
          courses: [
            `${skill} Fundamentals - Udemy`,
            `Learn ${skill} - Coursera`
          ],
          youtube: [
            `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial")}`,
            `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " beginner guide")}`
          ]
        }));

        setSkills(transformedSkills);
      } catch (error) {
        console.error("Error fetching skill suggestions:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.message || "Failed to fetch skill suggestions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    console.log("RecommendedSkillsList auth state:", { authLoading, currentUser: currentUser?.email || "null" });
    if (!authLoading && currentUser) {
      fetchSkillSuggestions(currentUser.email);
    } else if (!authLoading && !currentUser) {
      setError("Please log in to view recommended skills.");
    }
  }, [authLoading, currentUser]);

  const handleOpen = (skill) => {
    setSelectedSkill(skill);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSkill(null);
  };

  const handleRemoveSkill = async (index) => {
    if (!currentUser) {
      setError("Please log in to remove skills.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);

      // Optionally save removed skills to Firestore (e.g., as ignored skills)
      const docRef = doc(db, "userPreferences", currentUser.email);
      await setDoc(docRef, {
        ignoredSkills: skills[index].name,
        timestamp: new Date().toISOString()
      }, { merge: true });

      console.log("Skill removed and saved to Firestore:", updatedSkills);
    } catch (err) {
      console.error("Error removing skill:", err);
      setError("Failed to remove skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: "500px", mx: "auto" }}>
        <Alert severity="error">{error}</Alert>
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
            <ListItemText primaryTypographyProps={{ variant: "h8" }} primary={skill.name} sx={{ flexGrow: 1 }} />
            <IconButton color="primary" onClick={() => handleOpen(skill)} disabled={loading}>
              <ArrowForward />
            </IconButton>
            <IconButton color="error" onClick={() => handleRemoveSkill(index)} disabled={loading}>
              <RemoveCircle />
            </IconButton>
          </ListItem>
        ))}
      </List>

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

export default RecommendedSkillsList;