"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Navbar from "../components/NavBar";
import SideMenu from "../components/SideMenu";

export default function InstituteFinder() {
  const [dreamJob, setDreamJob] = useState("");
  const [location, setLocation] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  const handleSearch = async () => {
    if (dreamJob.trim() !== "" && location.trim() !== "") {
      setLoading(true);
      const query = `${dreamJob} institute, university, college, course, school in ${location}`;
      try {
        const response = await fetch(`/api/institutes?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setInstitutes(data.results.filter(institute => institute.full_address));
      } catch (error) {
        console.error("Error fetching institutes:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredInstitutes = institutes.filter((institute) => {
    return ratingFilter ? institute.rating >= ratingFilter : true;
  });

  return (
    <>
      <Navbar />
      <SideMenu />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#DFF6DE", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Container sx={{ textAlign: "center", py: 5, maxWidth: "80vw" }}>
        
          {/* Search Inputs and Filters */}
          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              backgroundColor: "#fff",
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              label="Your Dream Job"
              variant="outlined"
              value={dreamJob}
              onChange={(e) => setDreamJob(e.target.value)}
              sx={{
                backgroundColor: "white",
                "& input": {
                  color: "black", // Ensure normal text is black
                },
                "& input:-webkit-autofill": {
                  backgroundColor: "white !important",
                  "-webkit-text-fill-color": "black !important", // Ensures autofill text is black
                  "-webkit-box-shadow": "0 0 0px 1000px white inset !important",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />

            <TextField
              fullWidth
              label="City or Country"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                backgroundColor: "white",
                "& input": {
                  color: "black",
                },
                "& input:-webkit-autofill": {
                  backgroundColor: "white !important",
                  "-webkit-text-fill-color": "black !important",
                  "-webkit-box-shadow": "0 0 0px 1000px white inset !important",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              }}
            />

            <FormControl variant="outlined" sx={{ minWidth: 120, backgroundColor: "white" }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                label="Rating"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={4.5}>4.5+ ⭐</MenuItem>
                <MenuItem value={4}>4.0+ ⭐</MenuItem>
                <MenuItem value={3.5}>3.5+ ⭐</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: "#14523D",
                "&:hover": { backgroundColor: "#062b14" },
                height: "56px",
                width: "150px",
                whiteSpace: "nowrap",
              }}
            >
              Find
            </Button>
          </Box>


          {/* Results and Map Section - Always Visible */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "400px",
              mt: 5,
              gap: 3,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {/* Results List */}
            <Box
              sx={{
                width: "40%",
                height: "400px",
                overflowY: "auto",
                backgroundColor: "#fff",
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: "#14523D", fontWeight: "bold" }}>
                Results:
              </Typography>
              
              {loading && <CircularProgress sx={{ mt: 3 }} />}


              {filteredInstitutes.length > 0 ? (
                <List>
                  {filteredInstitutes.map((institute, index) => (
                    <ListItem
                    key={index}
                    sx={{
                      borderTop: "1px solid #ddd",
                      mb: 1,
                      cursor: "pointer",
                      backgroundColor: selectedInstitute === institute ? "#d4f0d2" : "white",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#e8f5e9",
                      },
                    }}
                    onClick={() => setSelectedInstitute(institute)}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: "#14523D", fontWeight: "bold" }}>
                          {institute.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>📍 {institute.full_address}</Typography>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>⭐ Rating: {institute.rating || "N/A"}</Typography>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>📞 {institute.phone_number || "N/A"}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" sx={{ color: "#888", textAlign: "center" }}>
                  No results found. Try searching for a different location or job.
                </Typography>
              )}
            </Box>

            {/* Map Box */}
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                boxShadow: 3,
                width: "400px",
                height: "400px",
                backgroundColor: "#fff",
              }}
            >
              {selectedInstitute ? (
                <iframe
                  title="Institute Location"
                  width="400px"
                  height="400px"
                  style={{ border: 0, borderRadius: 8 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(selectedInstitute.full_address)}&output=embed`}
                ></iframe>
              ) : (
                <Typography variant="h6" sx={{ color: "#555" }}>
                  Select an institute to view the location
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}