import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, Cancel } from "@mui/icons-material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const SkillsExperienceForm = ({ email, onNext }) => {
  const [techSkills, setTechSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillType, setSkillType] = useState("tech"); // "tech" for technical skills, "soft" for soft skills
  const [hasJob, setHasJob] = useState(false);
  const [jobs, setJobs] = useState([{ company: "", role: "", duration: "" }]);
  const [internship, setInternship] = useState("");

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const formattedSkill = skillInput.trim().toLowerCase();
    if (skillType === "tech" && techSkills.some((s) => s.toLowerCase() === formattedSkill)) {
      alert("Skill already added!");
      return;
    }
    if (skillType === "soft" && softSkills.some((s) => s.toLowerCase() === formattedSkill)) {
      alert("Skill already added!");
      return;
    }
    
    if (skillType === "tech") {
      setTechSkills([...techSkills, skillInput.trim()]);
    } else {
      setSoftSkills([...softSkills, skillInput.trim()]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove, type) => {
    if (type === "tech") {
      setTechSkills(techSkills.filter((skill) => skill !== skillToRemove));
    } else {
      setSoftSkills(softSkills.filter((skill) => skill !== skillToRemove));
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "userSkills", email), {
        email,
        techSkills,
        softSkills,
        jobs: hasJob ? jobs : [],
        internship,
      });
      console.log("Skills & Experience saved.");
      onNext();
    } catch (error) {
      console.error("Error saving skills & experience:", error);
    }
  };

  return (
    <Box sx={{ height: "100vh", overflowY: "auto", p: 3, bgcolor: "#f9f9f9", borderRadius: 2, width: '90%', maxWidth: '1200px', margin: '0 auto', mt: 2 }}>
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* 🔹 Technical Skills Section */}
        <Typography variant="h6">Your Technical Skills</Typography>
        <Typography variant="body2" color="textSecondary">
          Enter your technical skills. If unsure, check the examples below.
        </Typography>
        {/* 🔹 Skill Examples for Technical Skills */}
        <Box sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2">Examples:</Typography>
          <Typography variant="body2">✔ Healthcare – Medical Coding, Patient Care, Surgical Skills</Typography>
          <Typography variant="body2">✔ IT – Programming, Cloud Computing, Database Management</Typography>
          <Typography variant="body2">✔ Finance – Accounting, Financial Analysis, Risk Management</Typography>
          <Typography variant="body2">✔ Engineering – CAD Design, Robotics, Electronics</Typography>
        </Box>

        {/* 🔹 Skill Input for Technical Skills */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Add a technical skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddSkill} startIcon={<AddCircleOutline />}>
            Add
          </Button>
        </Box>

        {/* 🔹 Display Added Technical Skills */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {techSkills.map((skill, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", bgcolor: "#ddd", p: 1, borderRadius: 1 }}>
              <Typography>{skill}</Typography>
              <IconButton size="small" onClick={() => handleRemoveSkill(skill, "tech")}>
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* 🔹 Soft Skills Section */}
        <Typography variant="h6">Your Soft Skills</Typography>
        <Typography variant="body2" color="textSecondary">
          Enter your soft skills. If unsure, check the examples below.
        </Typography>
        {/* 🔹 Skill Examples for Soft Skills */}
        <Box sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2">Examples:</Typography>
          <Typography variant="body2">✔ Communication – Active Listening, Public Speaking, Negotiation</Typography>
          <Typography variant="body2">✔ Leadership – Conflict Resolution, Team Management, Decision Making</Typography>
          <Typography variant="body2">✔ Adaptability – Problem Solving, Flexibility, Critical Thinking</Typography>
          <Typography variant="body2">✔ Customer Service – Empathy, Patience, Relationship Building</Typography>
        </Box>

        {/* 🔹 Skill Input for Soft Skills */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Add a soft skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddSkill} startIcon={<AddCircleOutline />}>
            Add
          </Button>
        </Box>

        {/* 🔹 Display Added Soft Skills */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {softSkills.map((skill, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", bgcolor: "#ddd", p: 1, borderRadius: 1 }}>
              <Typography>{skill}</Typography>
              <IconButton size="small" onClick={() => handleRemoveSkill(skill, "soft")}>
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* 🔹 Job Experience Section */}
        <Typography variant="h6">Work Experience</Typography>
        <FormControl fullWidth>
          <InputLabel>Are you currently employed?</InputLabel>
          <Select value={hasJob ? "yes" : "no"} onChange={(e) => setHasJob(e.target.value === "yes")} displayEmpty>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>

        {hasJob &&
          jobs.map((job, index) => (
            <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1, border: "1px solid #ddd", p: 2, borderRadius: 1, bgcolor: "#fff" }}>
              <TextField
                fullWidth
                label="Company Name"
                value={job.company}
                onChange={(e) => {
                  const newJobs = [...jobs];
                  newJobs[index].company = e.target.value;
                  setJobs(newJobs);
                }}
              />
              <TextField
                fullWidth
                label="Job Role"
                value={job.role}
                onChange={(e) => {
                  const newJobs = [...jobs];
                  newJobs[index].role = e.target.value;
                  setJobs(newJobs);
                }}
              />
              <TextField
                fullWidth
                label="Duration (e.g., 2 years, 6 months)"
                value={job.duration}
                onChange={(e) => {
                  const newJobs = [...jobs];
                  newJobs[index].duration = e.target.value;
                  setJobs(newJobs);
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {index > 0 && (
                  <IconButton onClick={() => setJobs(jobs.filter((_, i) => i !== index))}>
                    <RemoveCircleOutline color="error" />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}

        {hasJob && (
          <Button startIcon={<AddCircleOutline />} onClick={() => setJobs([...jobs, { company: "", role: "", duration: "" }])} sx={{ alignSelf: "flex-start" }}>
            Add Another Job
          </Button>
        )}

        {/* 🔹 Internship/Volunteer Work */}
        <Typography variant="h6">Internships / Volunteer Work</Typography>
        <TextField fullWidth label="Enter Internship / Volunteer Work Details" value={internship} onChange={(e) => setInternship(e.target.value)} />

        {/* 🔹 Save Button */}
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 3 }}>
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SkillsExperienceForm;
