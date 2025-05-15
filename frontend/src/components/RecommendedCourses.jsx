
"use client";
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
  Alert,
} from "@mui/material";
import { ArrowForward, RemoveCircle } from "@mui/icons-material";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";

const RecommendedCourses = ({ email }) => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const GEMINI_API_KEY = "AIzaSyCk_vpgdzjOAOhozrJZXb9s3nsn1DUloqA";

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch user data
        const futureJobDoc = await getDoc(doc(db, "futureJob", email));
        const educationDoc = await getDoc(doc(db, "Education", email));
        const skillsDoc = await getDoc(doc(db, "userSkills", email));

        console.log("Firestore fetch results:", {
          futureJobDoc: futureJobDoc.exists() ? futureJobDoc.data() : "Not found",
          educationDoc: educationDoc.exists() ? educationDoc.data() : "Not found",
          skillsDoc: skillsDoc.exists() ? skillsDoc.data() : "Not found",
        });

        const futureJob = futureJobDoc.exists() ? futureJobDoc.data().futureJob || "Not specified" : "Not specified";
        const education = educationDoc.exists() ? educationDoc.data().education || {} : {};
        const skills = skillsDoc.exists()
          ? { techSkills: skillsDoc.data().techSkills || [], softSkills: skillsDoc.data().softSkills || [] }
          : { techSkills: [], softSkills: [] };
        const description = skillsDoc.exists() ? skillsDoc.data().description || "" : "";

        console.log("Request payload:", { futureJob, education, skills, description });

        if (futureJob === "Not specified") {
          console.warn("Warning: futureJob is 'Not specified'. Check futureJob/", email);
        }

        // Call Gemini API
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Act as a career advisor. Based on the user's desired job, education, technical skills, soft skills, and personal description (including ongoing degrees or extracurricular activities), recommend up to 10 relevant online courses to enhance their skills for their career goals. For each course, provide the course name, recommended platforms (e.g., Coursera, Udemy), and up to 2 YouTube links for free learning resources. Return a valid JSON array of objects with fields: { name, platforms, youtube }.

                      Desired Job: ${futureJob}
                      Education: ${JSON.stringify(education)}
                      Technical Skills: ${JSON.stringify(skills.techSkills)}
                      Soft Skills: ${JSON.stringify(skills.softSkills)}
                      Personal Description: ${description || "No description provided"}`,   
                  },
                ],
              },
            ],
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("Gemini API response:", response.data);

        const resultText = response.data.candidates[0].content.parts[0].text;
        let recommendedCourses;
        try {
          const jsonMatch = resultText.match(/\[[\s\S]*\]/);
          if (!jsonMatch) {
            throw new Error("No valid JSON array found in response");
          }
          recommendedCourses = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError, "Raw text:", resultText);
          recommendedCourses = [
            {
              name: "Fallback Course",
              platforms: ["Udemy"],
              youtube: ["https://www.youtube.com/watch?v=example"],
            },
          ];
          setError("Failed to parse course recommendations. Showing fallback course.");
        }

        setCourses(recommendedCourses);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommended courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchRecommendedCourses();
  }, [email]);

  const handleOpen = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const handleRemoveCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        background: "#B5CFB4",
        p: 3,
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#14523D" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Typography variant="h6" color="#14523D" fontWeight="bold" sx={{ mb: 2 }}>
            Recommended Courses
          </Typography>
          <List>
            {courses.map((course, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                  py: 1,
                }}
              >
                <ListItemText
                  primary={course.name}
                  primaryTypographyProps={{ fontWeight: "bold", color: "#14523D" }}
                />
                <Box>
                  <IconButton color="primary" onClick={() => handleOpen(course)}>
                    <ArrowForward />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRemoveCourse(index)}>
                    <RemoveCircle />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Recommended Learning Resources</DialogTitle>
            <DialogContent>
              {selectedCourse && (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
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
              <Button onClick={handleClose} sx={{ color: "#14523D" }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RecommendedCourses;