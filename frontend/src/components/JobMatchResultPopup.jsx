
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Alert,
  Box,
} from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import axios from "axios";

const JobMatchResultPopup = ({ open, onClose, email }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [finalJob, setFinalJob] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);

  // Replace with your Gemini API key from https://aistudio.google.com
  const GEMINI_API_KEY = "AIzaSyCk_vpgdzjOAOhozrJZXb9s3nsn1DUloqA";

  useEffect(() => {
    if (open) {
      fetchDataAndAnalyze();
      setFinalJob("");
      setSaveStatus(null);
    }
  }, [open, email]);

  const fetchDataAndAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch data from Firestore
      const futureJobDoc = await getDoc(doc(db, "futureJob", email));
      const educationDoc = await getDoc(doc(db, "Education", email));
      const skillsDoc = await getDoc(doc(db, "userSkills", email));

      // Log Firestore fetch results
      console.log("Firestore fetch results:", {
        futureJobDoc: futureJobDoc.exists() ? futureJobDoc.data() : "Not found",
        educationDoc: educationDoc.exists() ? educationDoc.data() : "Not found",
        skillsDoc: skillsDoc.exists() ? skillsDoc.data() : "Not found",
      });

      const futureJob = futureJobDoc.exists() ? futureJobDoc.data().futureJob || "Not specified" : "Not specified";
      const education = educationDoc.exists() ? educationDoc.data().education || {} : {};
      const skills = skillsDoc.exists()
        ? {
            techSkills: skillsDoc.data().techSkills || [],
            softSkills: skillsDoc.data().softSkills || [],
          }
        : { techSkills: [], softSkills: [] };
      const experience = skillsDoc.exists()
        ? {
            jobs: skillsDoc.data().jobs || [],
            internship: skillsDoc.data().internship || "",
          }
        : { jobs: [], internship: "" };
      const description = skillsDoc.exists() ? skillsDoc.data().description || "" : "";

      // Log the payload
      console.log("Request payload:", { futureJob, education, skills, experience, description });

      // Validate inputs
      if (futureJob === "Not specified") {
        console.warn("Warning: futureJob is 'Not specified'. Check Firestore document at futureJob/", email);
      }
      if (!description) {
        console.warn("Warning: description is empty. Check userSkills/", email);
      }

      // Call Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Act as a career advisor. Given a user's desired job, education, technical skills, soft skills, work experience, and personal description (including ongoing degrees, extracurricular activities, or other relevant experiences), determine if the desired job is a good match. Provide a match score from 0–100 based on how well the user's profile aligns with the job's typical requirements. If the match score is below 80, suggest up to two alternative job roles that better suit the user's profile, considering their technical skills, soft skills, and description. Provide a brief explanation for the match score and suggestions, highlighting relevant skills and experiences. Return a valid JSON object with fields: { desiredJob, matchScore, explanation, suggestions (optional array of job titles) }.

Desired Job: ${futureJob}
Education: ${JSON.stringify(education)}
Technical Skills: ${JSON.stringify(skills.techSkills)}
Soft Skills: ${JSON.stringify(skills.softSkills)}
Work Experience: ${JSON.stringify(experience)}
Personal Description: ${description || "No description provided"}`
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Log raw API response
      console.log("Gemini API response:", response.data);

      // Parse Gemini response
      const resultText = response.data.candidates[0].content.parts[0].text;
      let analysisResult;
      try {
        const jsonMatch = resultText.match(/{[\s\S]*}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        const cleanedText = jsonMatch[0];
        analysisResult = JSON.parse(cleanedText);
        if (analysisResult.suggestions) {
          analysisResult.suggestions = analysisResult.suggestions.map((s) => s.jobTitle || s);
        }
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError, "Raw text:", resultText);
        analysisResult = {
          desiredJob: futureJob,
          matchScore: 70,
          explanation: "Failed to parse API response. Please try again.",
          suggestions: ["Alternative Job 1", "Alternative Job 2"],
        };
      }

      setResult(analysisResult);
    } catch (error) {
      console.error("Error fetching or analyzing data:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError("Failed to analyze job match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFinalJob = async () => {
    if (!finalJob.trim()) {
      setSaveStatus({ type: "error", message: "Please enter a job title." });
      return;
    }

    try {
      await setDoc(doc(db, "finalJobDecisions", email), {
        finalJob: finalJob.trim(),
        timestamp: new Date().toISOString(),
      });
      setSaveStatus({ type: "success", message: "Final job decision saved successfully!" });
      setFinalJob("");
    } catch (error) {
      console.error("Error saving final job:", error);
      setSaveStatus({ type: "error", message: "Failed to save final job. Please try again." });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Job Match Result</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : result ? (
          <>
            <Typography variant="h6">Desired Job: {result.desiredJob}</Typography>
            <Typography>Match Score: {result.matchScore}/100</Typography>
            <Typography sx={{ mt: 2 }}>Explanation: {result.explanation}</Typography>
            {result.suggestions && result.suggestions.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Suggested Jobs:
                </Typography>
                {result.suggestions.map((job, index) => (
                  <Typography key={index}>- {job}</Typography>
                ))}
              </>
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">
                What is your final decision? Which job do you select for your future?
              </Typography>
              <TextField
                fullWidth
                label="Enter your final job choice"
                value={finalJob}
                onChange={(e) => setFinalJob(e.target.value)}
                sx={{ mt: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleSaveFinalJob}
                sx={{ mt: 2, bgcolor: "#14523D", "&:hover": { bgcolor: "#0e3c2a" } }}
                disabled={!finalJob.trim()}
              >
                Save Decision
              </Button>
              {saveStatus && (
                <Alert severity={saveStatus.type} sx={{ mt: 2 }}>
                  {saveStatus.message}
                </Alert>
              )}
            </Box>
          </>
        ) : (
          <Typography>No result available.</Typography>
        )}
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 3, bgcolor: "#14523D", "&:hover": { bgcolor: "#0e3c2a" } }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatchResultPopup;