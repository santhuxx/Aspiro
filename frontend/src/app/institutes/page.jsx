"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Container, CircularProgress, List, ListItem, ListItemText, Link } from "@mui/material";
import Navbar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
export default function InstituteFinder() {
  const [step, setStep] = useState(1);
  const [dreamJob, setDreamJob] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState([]);

  const handleNext = () => {
    if (dreamJob.trim() !== "") {
      setStep(2);
    }
  };

  const handleSearch = async () => {
    if (location.trim() !== "") {
      setLoading(true);
      const query = `${dreamJob} institute,university,college,course,school in ${location}`;
      try {
        const response = await fetch(`/api/institutes?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setInstitutes(data.results);
      } catch (error) {
        console.error("Error fetching institutes:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <SideMenu />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#DFF6DE", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Container sx={{ textAlign: "center", py: 5 }}>
          <Box sx={{ backgroundColor: "#fff", p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 500, mx: "auto" }}>
            {step === 1 ? (
              <>
                <Typography variant="h5" color="black" gutterBottom>
                  Who do you want to become?
                </Typography>
                <TextField
                  fullWidth
                  label="Your Dream Job"
                  variant="outlined"
                  value={dreamJob}
                  onChange={(e) => setDreamJob(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" fullWidth onClick={handleNext} sx={{ backgroundColor: "#14523D", "&:hover": { backgroundColor: "#062b14" } }}>
                  Next
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" color="black" gutterBottom>
                  Enter your preferred location
                </Typography>
                <TextField
                  fullWidth
                  label="City or Country"
                  variant="outlined"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" fullWidth onClick={handleSearch} sx={{ backgroundColor: "#14523D", "&:hover": { backgroundColor: "#062b14" } }}>
                  Search
                </Button>
              </>
            )}
          </Box>

          {/* Show loading spinner */}
          {loading && <CircularProgress sx={{ mt: 3 }} />}

          {/* Display the results */}
          {institutes.length > 0 && (
            <Box sx={{ mt: 5, textAlign: "left" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Results:
              </Typography>
              <List>
                {institutes.map((institute, index) => (
                  <ListItem key={index} sx={{ borderBottom: "1px solid #ddd", mb: 1 }}>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: "#14523D" }}>
                          {institute.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">📍 {institute.full_address}</Typography>
                          <Typography variant="body2">⭐ Rating: {institute.rating || "N/A"}</Typography>
                          <Typography variant="body2">📞 {institute.phone_number || "N/A"}</Typography>
                          {institute.place_link && (
                            <Link href={institute.place_link} target="_blank" rel="noopener noreferrer" sx={{ display: "block", mt: 1 }}>
                              🔗 Visit Place
                            </Link>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
