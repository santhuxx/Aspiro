import { useState } from "react";
import { Box, TextField, Button, Typography, Container, MenuItem } from "@mui/material";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase"; // Firebase imports

export default function EducationForm({ email, onNext }) {
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [loading, setLoading] = useState(false);

  const educationLevels = ["No Formal Education", "OL", "AL", "Diploma", "Degree", "Masters", "PhD"];
  const fieldsOfStudy = ["IT", "Business", "Engineering", "Arts", "Science", "Medicine", "Other"];

  const handleNext = async () => {
    if (!educationLevel || !fieldOfStudy || !institution.trim() || !graduationYear) {
      alert("Please fill in all fields!");
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
        },
      }, { merge: true });

      console.log("Education details saved successfully!");
      onNext(); // Move to the next step
    } catch (error) {
      console.error("Error saving education details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ textAlign: "center", py: 0 }}>
      <Box sx={{ backgroundColor: "#fff", mt: 10, p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 500, mx: "auto" }}>
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
        >
          {educationLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Field of Study"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
          sx={{ mb: 2 }}
        >
          {fieldsOfStudy.map((field) => (
            <MenuItem key={field} value={field}>
              {field}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Institution Name"
          variant="outlined"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Graduation Year"
          variant="outlined"
          type="number"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
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
