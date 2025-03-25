import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Box, Button, Typography, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase"; 
import EducationForm from "./EducationForm"; 
import SkillsExperienceForm from "./SkillsExperienceForm"; // ✅ Import new component

const FutureJobPopup = ({ visible, onClose, email }) => {
  const [futureJob, setFutureJob] = useState("");
  const [step, setStep] = useState(1); 
  const router = useRouter();

  const handleNext = async () => {
    if (step === 1 && futureJob && email) {
      try {
        await setDoc(doc(db, "futureJobs", email), { futureJob, email });
        console.log("Future Job saved:", futureJob);
        setStep(2); 
      } catch (error) {
        console.error("Error saving future job:", error);
      }
    } else if (step === 2) {
      setStep(3); // Move to Skills & Experience form
    }
  };

  const handleSkip = () => {
    onClose();
    router.push("/home"); 
  };

  return (
    <Dialog open={visible} onClose={handleSkip} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", mt: 2 }}>
        {step === 1 ? "Who do you want to be?" : step === 2 ? "Enter Your Education" : "Skills & Experience"}
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
        {step === 1 && (
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
        )}

        {step === 2 && <EducationForm email={email} onNext={() => setStep(3)} />} 
        
        {step === 3 && <SkillsExperienceForm email={email} onNext={handleSkip} />}

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

