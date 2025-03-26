import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
<<<<<<< Updated upstream
=======
//import { setDoc, doc } from "firebase/firestore";
//import { db } from "@/app/firebase/firebase"; 
import EducationForm from "./EducationForm"; 
import SkillsExperienceForm from "./SkillsExperienceForm"; // ✅ Import new component
>>>>>>> Stashed changes

const FutureJobPopup = ({ visible, onClose }) => {
  const [futureJob, setFutureJob] = useState("");
  const router = useRouter();

  const handleNext = () => {
    console.log("Future Job:", futureJob);
    onClose(); // Close modal after submission
  };

  const handleSkip = () => {
    onClose();
    router.push("/home"); // Redirect to home page
  };

  return (
    <Dialog open={visible} onClose={handleSkip} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", mt: 2 }}>
        Who you wanna be?
      </DialogTitle>

      <DialogContent
        sx={{
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#B5CFB4",
          padding: 4,
        }}
      >
        {/* Input and Button Container */}
        <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
          <TextField
            placeholder="Type your dream job..."
            value={futureJob}
            onChange={(e) => setFutureJob(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ bgcolor: "white" }}
          />
          <Button variant="contained" color="primary" onClick={handleNext} sx={{ minWidth: 100 }}>
            Next
          </Button>
        </Box>

        {/* Footer with Skip */}
        <Typography
          onClick={handleSkip}
          sx={{ color: "gray", cursor: "pointer", textDecoration: "underline", mt: 3 }}
        >
          Skip
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default FutureJobPopup;