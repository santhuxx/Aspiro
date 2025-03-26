import React, { useState } from "react";
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Chip } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase"; 

const skillsOptions = ["Coding", "Designing", "Marketing"];
const softSkillsOptions = ["Leadership", "Communication"];
const extracurricularOptions = ["Prefect", "Sports", "Music", "Dance", "Drama"];

const SkillsExperienceForm = ({ email, onNext }) => {
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [certifications, setCertifications] = useState("");
  const [workExperience, setWorkExperience] = useState({ company: "", role: "", duration: "" });
  const [extracurricular, setExtracurricular] = useState([]);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "userSkills", email), {
        email,
        technicalSkills,
        softSkills,
        certifications,
        workExperience,
        extracurricular
      });
      console.log("Skills & Experience saved.");
      onNext();
    } catch (error) {
      console.error("Error saving skills & experience:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Technical Skills</InputLabel>
        <Select multiple value={technicalSkills} onChange={(e) => setTechnicalSkills(e.target.value)} renderValue={(selected) => selected.join(", ")}>
          {skillsOptions.map((skill) => <MenuItem key={skill} value={skill}>{skill}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Soft Skills</InputLabel>
        <Select multiple value={softSkills} onChange={(e) => setSoftSkills(e.target.value)} renderValue={(selected) => selected.join(", ")}>
          {softSkillsOptions.map((skill) => <MenuItem key={skill} value={skill}>{skill}</MenuItem>)}
        </Select>
      </FormControl>
      
      <TextField fullWidth label="Company Name" value={workExperience.company} onChange={(e) => setWorkExperience({ ...workExperience, company: e.target.value })} />
      <TextField fullWidth label="Job Role" value={workExperience.role} onChange={(e) => setWorkExperience({ ...workExperience, role: e.target.value })} />
      <TextField fullWidth label="Duration" value={workExperience.duration} onChange={(e) => setWorkExperience({ ...workExperience, duration: e.target.value })} />

      <FormControl fullWidth>
        <InputLabel>Volunteer Work / Activities</InputLabel>
        <Select multiple value={extracurricular} onChange={(e) => setExtracurricular(e.target.value)} renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (<Chip key={value} label={value} />))}
          </Box>
        )}>
          {extracurricularOptions.map((activity) => <MenuItem key={activity} value={activity}>{activity}</MenuItem>)}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>Next</Button>
    </Box>
  );
};

export default SkillsExperienceForm;
