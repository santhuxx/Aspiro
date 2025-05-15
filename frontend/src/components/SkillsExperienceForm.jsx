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
  CircularProgress,
  Divider,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, Cancel } from "@mui/icons-material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import JobMatchResultPopup from "./JobMatchResultPopup";

const SkillsExperienceForm = ({ email, onNext }) => {
  const [techSkills, setTechSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [techSkillInput, setTechSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [hasJob, setHasJob] = useState(false);
  const [jobs, setJobs] = useState([{ company: "", role: "", duration: "" }]);
  const [internship, setInternship] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [openResultPopup, setOpenResultPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = (type) => {
    const input = type === "tech" ? techSkillInput : softSkillInput;
    if (!input.trim()) return;
    const formattedSkill = input.trim().toLowerCase();

    if (type === "tech") {
      if (techSkills.some((s) => s.toLowerCase() === formattedSkill)) {
        alert("Technical skill already added!");
        return;
      }
      setTechSkills([...techSkills, input.trim()]);
      setTechSkillInput("");
    } else {
      if (softSkills.some((s) => s.toLowerCase() === formattedSkill)) {
        alert("Soft skill already added!");
        return;
      }
      setSoftSkills([...softSkills, input.trim()]);
      setSoftSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove, type) => {
    if (type === "tech") {
      setTechSkills(techSkills.filter((skill) => skill !== skillToRemove));
    } else {
      setSoftSkills(softSkills.filter((skill) => skill !== skillToRemove));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userSkillsData = {
        email,
        techSkills,
        softSkills,
        jobs: hasJob ? jobs : [],
        internship,
        description, // Include description in Firestore
      };
      await setDoc(doc(db, "userSkills", email), userSkillsData);
      console.log("Skills & Experience saved:", userSkillsData);
      setOpenResultPopup(true);
    } catch (error) {
      console.error("Error saving skills & experience:", error, {
        code: error.code,
        message: error.message,
      });
      alert("Failed to save skills and experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        p: 3,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        width: "90%",
        maxWidth: "1200px",
        margin: "0 auto",
        mt: 2,
      }}
    >
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Technical Skills Section */}
        <Typography variant="h6" color="#14523D">
          Technical Skills
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Enter your technical skills (e.g., programming, medical coding, CAD design).
        </Typography>
        <Box sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2">Examples:</Typography>
          <Typography variant="body2">✔ Healthcare – Medical Coding, Patient Care, Surgical Skills</Typography>
          <Typography variant="body2">✔ IT – Programming, Cloud Computing, Database Management</Typography>
          <Typography variant="body2">✔ Finance – Accounting, Financial Analysis, Risk Management</Typography>
          <Typography variant="body2">✔ Engineering – CAD Design, Robotics, Electronics</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Add a technical skill"
            value={techSkillInput}
            onChange={(e) => setTechSkillInput(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => handleAddSkill("tech")}
            startIcon={<AddCircleOutline />}
            sx={{ bgcolor: "#14523D", "&:hover": { bgcolor: "#0e3c2a" } }}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {techSkills.map((skill, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#dcedc8",
                p: 1,
                borderRadius: 1,
              }}
            >
              <Typography>{skill}</Typography>
              <IconButton size="small" onClick={() => handleRemoveSkill(skill, "tech")}>
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Soft Skills Section */}
        <Typography variant="h6" color="#14523D">
          Soft Skills
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Enter your soft skills (e.g., communication, leadership, problem-solving).
        </Typography>
        <Box sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2">Examples:</Typography>
          <Typography variant="body2">✔ Communication – Active Listening, Public Speaking, Negotiation</Typography>
          <Typography variant="body2">✔ Leadership – Conflict Resolution, Team Management, Decision Making</Typography>
          <Typography variant="body2">✔ Adaptability – Problem Solving, Flexibility, Critical Thinking</Typography>
          <Typography variant="body2">✔ Customer Service – Empathy, Patience, Relationship Building</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Add a soft skill"
            value={softSkillInput}
            onChange={(e) => setSoftSkillInput(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => handleAddSkill("soft")}
            startIcon={<AddCircleOutline />}
            sx={{ bgcolor: "#14523D", "&:hover": { bgcolor: "#0e3c2a" } }}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {softSkills.map((skill, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#b3e5fc",
                p: 1,
                borderRadius: 1,
              }}
            >
              <Typography>{skill}</Typography>
              <IconButton size="small" onClick={() => handleRemoveSkill(skill, "soft")}>
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Work Experience Section */}
        <Typography variant="h6" color="#14523D">
          Work Experience
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Are you currently employed?</InputLabel>
          <Select
            value={hasJob ? "yes" : "no"}
            onChange={(e) => setHasJob(e.target.value === "yes")}
            displayEmpty
          >
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
          </Select>
        </FormControl>

        {hasJob &&
          jobs.map((job, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                border: "1px solid #ddd",
                p: 2,
                borderRadius: 1,
                bgcolor: "#fff",
              }}
            >
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
          <Button
            startIcon={<AddCircleOutline />}
            onClick={() => setJobs([...jobs, { company: "", role: "", duration: "" }])}
            sx={{ alignSelf: "flex-start" }}
          >
            Add Another Job
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Internships / Volunteer Work Section */}
        <Typography variant="h6" color="#14523D">
          Internships / Volunteer Work
        </Typography>
        <TextField
          fullWidth
          label="Enter Internship / Volunteer Work Details"
          value={internship}
          onChange={(e) => setInternship(e.target.value)}
          multiline
          rows={4}
        />

        <Divider sx={{ my: 2 }} />

        {/* Describe Yourself Section */}
        <Typography variant="h6" color="#14523D">
          Describe Yourself
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Share details about yourself, such as ongoing degrees, extracurricular activities, or other relevant experiences.
        </Typography>
        <TextField
          fullWidth
          label="Tell us about yourself"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={6}
          sx={{ mt: 2 }}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 3, bgcolor: "#14523D", "&:hover": { bgcolor: "#0e3c2a" } }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save & Analyze"}
        </Button>
      </Box>

      <JobMatchResultPopup
        open={openResultPopup}
        onClose={() => {
          setOpenResultPopup(false);
          onNext();
        }}
        email={email}
      />
    </Box>
  );
};

export default SkillsExperienceForm;