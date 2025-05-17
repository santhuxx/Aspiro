'use client';
import { useState, useEffect } from "react";
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
  Paper,
  Chip,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../../components/NavBar";
import SideMenu from "../../components/SideMenu";

export default function InstituteFinder() {
  const { currentUser, loading: authLoading } = useAuth();
  const [dreamJob, setDreamJob] = useState("");
  const [location, setLocation] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch finalJob from Firestore
  useEffect(() => {
    const fetchDreamJob = async () => {
      if (!currentUser || authLoading) return;

      setFetchingJob(true);
      try {
        const docRef = doc(db, "finalJobDecisions", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const finalJob = data.finalJob || "";
          setDreamJob(finalJob);
          console.log("Fetched finalJob:", finalJob);
        } else {
          console.log("No finalJob document found for user:", currentUser.email);
        }
      } catch (error) {
        console.error("Error fetching finalJob:", error);
      } finally {
        setFetchingJob(false);
      }
    };

    fetchDreamJob();
  }, [currentUser, authLoading]);

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

  if (authLoading || fetchingJob) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "#14523D" }} />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Please log in to use the Institute Finder.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <SideMenu />
      <Box sx={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #DFF6DE 0%, #DFF6DE 100%)",
        display: "flex", 
        flexDirection: "column", 
        pt: 2,
        pb: 5
      }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Paper elevation={0} sx={{ 
            borderRadius: 4, 
            mb: 4, 
            p: 5, 
            mt: 10,
            textAlign: "center",
            background: "linear-gradient(135deg, #14523D 0%, #0B3B2C 100%)",
            color: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Find Your Perfect Institute
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: "auto", opacity: 0.9 }}>
              Discover top-rated educational institutions that align with your career goals
            </Typography>

            {/* Search Bar */}
            <Paper elevation={3} sx={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center", 
              p: 1, 
              borderRadius: 3,
              mx: "auto",
              maxWidth: 900
            }}>
              <TextField
                fullWidth
                placeholder="Your Dream Job or Field"
                variant="outlined"
                value={dreamJob}
                onChange={(e) => setDreamJob(e.target.value)}
                InputProps={{
                  startAdornment: <SchoolIcon sx={{ mr: 1, color: "#14523D" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: isMobile ? 2 : "20px 0 0 20px",
                    bgcolor: "white",
                    "& fieldset": { border: "none" },
                  },
                  mr: isMobile ? 0 : 1,
                  mb: isMobile ? 1 : 0
                }}
              />

              <TextField
                fullWidth
                placeholder="City or Country"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1, color: "#14523D" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: isMobile ? 2 : 0, 
                    bgcolor: "white",
                    "& fieldset": { border: "none" },
                  },
                  mr: isMobile ? 0 : 1,
                  mb: isMobile ? 1 : 0
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton 
                  sx={{ 
                    color: "#14523D", 
                    display: { xs: 'flex', md: 'none' },
                    mr: 1
                  }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterListIcon />
                </IconButton>
                
                <FormControl 
                  variant="outlined" 
                  sx={{ 
                    minWidth: 120, 
                    display: { xs: showFilters ? 'block' : 'none', md: 'block' },
                    mb: isMobile ? 1 : 0
                  }}
                >
                  <Select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Rating filter' }}
                    size="small"
                    sx={{
                      borderRadius: isMobile ? 2 : 0,
                      bgcolor: "white",
                      height: "56px",
                      "& fieldset": { border: "none" },
                    }}
                  >
                    <MenuItem value="">All Ratings</MenuItem>
                    <MenuItem value={4.5}>4.5+ ⭐</MenuItem>
                    <MenuItem value={4}>4.0+ ⭐</MenuItem>
                    <MenuItem value={3.5}>3.5+ ⭐</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: "#14523D",
                    "&:hover": { bgcolor: "#062b14" },
                    borderRadius: isMobile ? 2 : "0 20px 20px 0",
                    height: "56px",
                    ml: isMobile ? 0 : 0,
                    px: 3,
                    boxShadow: "none",
                  }}
                >
                  Search
                </Button>
              </Box>
            </Paper>
          </Paper>

          {/* Results Section */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: 3
          }}>
            {/* Results List */}
            <Paper 
              elevation={2} 
              sx={{ 
                width: isMobile ? "100%" : "40%", 
                height: 550, 
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#fff"
              }}
            >
              <Box sx={{ p: 3, borderBottom: "1px solid #f0f0f0" }}>
                <Typography variant="h5" fontWeight="bold" color="#14523D">
                  {loading ? "Searching..." : `Results (${filteredInstitutes.length})`}
                </Typography>
              </Box>
              
              <Box sx={{ height: 480, overflowY: "auto", p: 1 }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress sx={{ color: "#14523D" }} />
                  </Box>
                ) : filteredInstitutes.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {filteredInstitutes.map((institute, index) => (
                      <Paper
                        key={index}
                        elevation={selectedInstitute === institute ? 3 : 1}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          transform: selectedInstitute === institute ? "scale(1.02)" : "scale(1)",
                          border: selectedInstitute === institute ? "2px solid #14523D" : "none",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}
                        onClick={() => setSelectedInstitute(institute)}
                      >
                        <ListItem sx={{ px: 2, py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#14523D" }}>
                                {institute.name}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                  <LocationOnIcon sx={{ fontSize: 14, color: "#888", mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ fontSize: 13, color: "#555" }}>
                                    {institute.full_address}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <Chip 
                                    icon={<StarIcon sx={{ fontSize: "16px !important", color: "#FFB400 !important" }} />} 
                                    label={institute.rating || "N/A"} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: "#FFF9E6", 
                                      color: "#555",
                                      fontSize: 12,
                                      height: 24
                                    }}
                                  />
                                  
                                  {institute.phone_number && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <PhoneIcon sx={{ fontSize: 14, color: "#14523D", mr: 0.5 }} />
                                      <Typography variant="body2" sx={{ fontSize: 13, color: "#555" }}>
                                        {institute.phone_number}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", p: 3 }}>
                    <SchoolIcon sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
                    <Typography variant="body1" color="#888" align="center">
                      No results found. Try searching for a different location or job.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Map Box */}
            <Paper 
              elevation={2} 
              sx={{ 
                flex: 1,
                height: 550,
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#fff",
                position: "relative"
              }}
            >
              {selectedInstitute ? (
                <iframe
                  title="Institute Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(selectedInstitute.full_address)}&output=embed`}
                ></iframe>
              ) : (
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "100%",
                  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
                }}>
                  <LocationOnIcon sx={{ fontSize: 80, color: "#14523D", opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#555", textAlign: "center", maxWidth: 300 }}>
                    Select an institute from the list to view its location
                  </Typography>
                </Box>
              )}

              
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
}