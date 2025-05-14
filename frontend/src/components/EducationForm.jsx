import { useState } from "react";
import { Box, TextField, Button, Typography, Container, MenuItem } from "@mui/material";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Firebase imports

export default function EducationForm({ email, onNext }) {
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear());
  const [gpa, setGPA] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const educationLevels = ["No Formal Education", "OL", "AL", "Diploma", "Degree", "Masters", "PhD"];
  const fieldsOfStudy = ["IT", "Business", "Engineering", "Arts", "Science", "Medicine", "Other"];

  const currentYear = new Date().getFullYear();
  const minYear = 1900;

  const handleNext = async () => {
    setErrors({});
    const validationErrors = {};

    if (!educationLevel) validationErrors.educationLevel = "Please select your education level.";
    if (!fieldOfStudy) validationErrors.fieldOfStudy = "Please select your field of study.";
    if (!institution.trim()) validationErrors.institution = "Please provide the institution name.";
    if (!graduationYear || !/^\d{4}$/.test(graduationYear)) {
      validationErrors.graduationYear = "Enter a valid 4-digit graduation year.";
    } else if (graduationYear < minYear || graduationYear > currentYear + 10) {
      validationErrors.graduationYear = `Graduation year must be between ${minYear} and ${currentYear + 10}.`;
    }

    if (gpa && (isNaN(gpa) || gpa < 0 || gpa > 4)) {
      validationErrors.gpa = "GPA should be between 0.0 and 4.0";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Save education details under the user's email
      await setDoc(doc(db, "Education", email), {
        education: {
          educationLevel,
          fieldOfStudy,
          institution,
          graduationYear,
          gpa,
          projectTitle,
        },
      }, { merge: true });

      console.log("Education details saved successfully!");
      onNext();
    } catch (error) {
      console.error("Error saving education details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ textAlign: "center", py: 0 }}>
      <Box sx={{ backgroundColor: "#fff", mt: 10, p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Educational Background
        </Typography>

        <TextField
          fullWidth
          select
          label="Highest Education Level"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
          sx={{ mb: 2 }}
          error={!!errors.educationLevel}
          helperText={errors.educationLevel}
        >
          {educationLevels.map((level) => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Field of Study"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
          sx={{ mb: 2 }}
          error={!!errors.fieldOfStudy}
          helperText={errors.fieldOfStudy}
        >
          {fieldsOfStudy.map((field) => (
            <MenuItem key={field} value={field}>{field}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Institution Name"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          sx={{ mb: 2 }}
          error={!!errors.institution}
          helperText={errors.institution}
        />

        <TextField
          fullWidth
          label="Graduation Year"
          type="number"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
          sx={{ mb: 2 }}
          error={!!errors.graduationYear}
          helperText={errors.graduationYear}
          inputProps={{ min: minYear, max: currentYear + 10, pattern: "[0-9]{4}" }}
        />

        <TextField
          fullWidth
          label="GPA / Final Grade (optional)"
          type="number"
          value={gpa}
          onChange={(e) => setGPA(e.target.value)}
          sx={{ mb: 2 }}
          error={!!errors.gpa}
          helperText={errors.gpa}
          inputProps={{ step: "0.01", min: "0", max: "4" }}
        />

        <TextField
          fullWidth
          label="Project / Thesis Title (optional)"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleNext}
          sx={{ backgroundColor: "#14523D", "&:hover": { backgroundColor: "#062b14" } }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Container>
  );
}