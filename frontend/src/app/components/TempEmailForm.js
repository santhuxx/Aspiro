import { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

export default function TempEmailForm({ onNext }) {
  const [email, setEmail] = useState("");

  const handleNext = () => {
    if (email.trim() !== "") {
      onNext(email);
    }
  };

  return (
    <Container sx={{ textAlign: "center", py: 5 }}>
      <Box sx={{ backgroundColor: "#fff", p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 500, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Enter Your Email
        </Typography>
        <TextField
          fullWidth
          label="Your Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleNext} sx={{ backgroundColor: "#14523D", "&:hover": { backgroundColor: "#062b14" } }}>
          Next
        </Button>
      </Box>
    </Container>
  );
}
