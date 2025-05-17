'use client';
import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const SkillSuggestion = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GEMINI_API_KEY = "AIzaSyCk_vpgdzjOAOhozrJZXb9s3nsn1DUloqA";

  useEffect(() => {
    console.log("SkillSuggestion auth state:", { authLoading, currentUser: currentUser?.email || "null" });
    if (!authLoading && currentUser) {
      fetchSkillSuggestions(currentUser.email);
    } else if (!authLoading && !currentUser) {
      const retryInterval = setInterval(() => {
        console.log("SkillSuggestion retry auth state:", { currentUser: currentUser?.email || "null" });
        if (currentUser) {
          fetchSkillSuggestions(currentUser.email);
          clearInterval(retryInterval);
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(retryInterval);
        if (!currentUser) {
          setError("Please log in to view skill suggestions.");
        }
      }, 5000);
      return () => clearInterval(retryInterval);
    }
  }, [authLoading, currentUser]);

  const fetchSkillSuggestions = async (email) => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching suggestions for email:", email);
      const skillsDoc = await getDoc(doc(db, "userSkills", email));
      const finalJobDoc = await getDoc(doc(db, "finalJobDecisions", email));

      console.log("SkillSuggestion Firestore fetch:", {
        skillsDoc: skillsDoc.exists() ? skillsDoc.data() : "Not found",
        finalJobDoc: finalJobDoc.exists() ? finalJobDoc.data() : "Not found"
      });

      const skills = skillsDoc.exists()
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
                  text: `Act as a career advisor. Given a user's current skills and their chosen future job, suggest up to 10 skills (technical or soft) they should acquire to be better prepared for the job. Return only a valid JSON object with fields: { job: string, suggestedSkills: array of strings, explanation: string }.\nJob: ${finalJob}\nCurrent Skills: ${JSON.stringify(skills)}`
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

      setSuggestions(suggestionResult);
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

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Skill Suggestions for Your Future Job
      </Typography>
      {authLoading || loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : suggestions ? (
        <>
          <Typography variant="h6">Job: {suggestions.job}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Suggested Skills:
          </Typography>
          {suggestions.suggestedSkills.map((skill, index) => (
            <Typography key={index}>- {skill}</Typography>
          ))}
          <Typography sx={{ mt: 2 }}>Explanation: {suggestions.explanation}</Typography>
        </>
      ) : (
        <Typography>No suggestions available.</Typography>
      )}
    </Box>
  );
};

export default SkillSuggestion;