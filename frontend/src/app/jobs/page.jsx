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
  Paper,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Badge,
  Avatar,
  Divider,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import FilterListIcon from '@mui/icons-material/FilterList';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../../components/NavBar";
import SideMenu from "../../components/SideMenu";

export default function JobFinder() {
  const { currentUser, loading: authLoading } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch finalJob from Firestore
  useEffect(() => {
    const fetchJobTitle = async () => {
      if (!currentUser || authLoading) return;

      setFetchingJob(true);
      try {
        const docRef = doc(db, "finalJobDecisions", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const finalJob = data.finalJob || "";
          setJobTitle(finalJob);
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

    fetchJobTitle();
  }, [currentUser, authLoading]);

  const handleSearch = async () => {
    if (jobTitle.trim() !== "") {
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("query", jobTitle);
        if (location) {
          queryParams.append("location", location);
        }
        
        const response = await fetch(`/api/jobs?${queryParams}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          setJobs([]);
          return;
        }
        
        const data = await response.json();
        
        if (data && data.data) {
          setJobs(data.data);
        } else {
          setJobs([]);
          console.warn("No job data found in response:", data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    let matchesExperience = true;
    let matchesEmploymentType = true;
    
    if (experienceFilter) {
      const jobExperience = job.job_required_experience?.required_experience_in_months || 0;
      
      switch (experienceFilter) {
        case "entry":
          matchesExperience = jobExperience < 24;
          break;
        case "mid":
          matchesExperience = jobExperience >= 24 && jobExperience < 60;
          break;  
        case "senior":
          matchesExperience = jobExperience >= 60;
          break;
      }
    }
    
    if (employmentTypeFilter && job.job_employment_type) {
      matchesEmploymentType = job.job_employment_type.toLowerCase() === employmentTypeFilter.toLowerCase();
    }
    
    return matchesExperience && matchesEmploymentType;
  });

  const formatSalary = (job) => {
    if (!job.job_min_salary && !job.job_max_salary) return "Not specified";
    
    const min = job.job_min_salary ? `$${Math.round(job.job_min_salary).toLocaleString()}` : "";
    const max = job.job_max_salary ? `$${Math.round(job.job_max_salary).toLocaleString()}` : "";
    
    if (min && max) return `${min} - ${max}`;
    return min || max;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCompanyAvatar = (job) => {
    if (job.employer_logo) {
      return <Avatar src={job.employer_logo} alt={job.employer_name} sx={{ width: 40, height: 40 }} />;
    }
    
    return (
      <Avatar sx={{ width: 40, height: 40, bgcolor: "#14523D" }}>
        {job.employer_name ? job.employer_name[0] : "J"}
      </Avatar>
    );
  };

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
          Please log in to use the Job Finder.
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
            background: "linear-gradient(135deg,rgb(8, 108, 74) 0%, #14523D 100%)",
            color: "white",
            boxShadow: "0 10px 30px #14523D"
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Find Your Dream Job
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: "auto", opacity: 0.9 }}>
              Discover top career opportunities that match your skills and aspirations
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
                placeholder="Job Title, Skills or Keywords"
                variant="outlined"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                InputProps={{
                  startAdornment: <WorkIcon sx={{ mr: 1, color: "#14523D" }} />,
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
                placeholder="City, State or Remote"
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
                
                <Box sx={{ 
                  display: { xs: showFilters ? 'flex' : 'none', md: 'flex' },
                  flexDirection: isMobile ? "column" : "row",
                  gap: 1,
                  mb: isMobile ? 1 : 0,
                  width: isMobile ? "100%" : "auto",
                }}>
                  <FormControl 
                    variant="outlined" 
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <Select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Experience filter' }}
                      sx={{
                        borderRadius: 2,
                        bgcolor: "white",
                        height: "56px",
                        "& fieldset": { border: "none" },
                      }}
                    >
                      <MenuItem value="">Any Experience</MenuItem>
                      <MenuItem value="entry">Entry Level</MenuItem>
                      <MenuItem value="mid">Mid Level</MenuItem>
                      <MenuItem value="senior">Senior Level</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl 
                    variant="outlined" 
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <Select
                      value={employmentTypeFilter}
                      onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Employment type filter' }}
                      sx={{
                        borderRadius: 2,
                        bgcolor: "white",
                        height: "56px",
                        "& fieldset": { border: "none" },
                      }}
                    >
                      <MenuItem value="">Any Type</MenuItem>
                      <MenuItem value="FULLTIME">Full Time</MenuItem>
                      <MenuItem value="PARTTIME">Part Time</MenuItem>
                      <MenuItem value="CONTRACTOR">Contract</MenuItem>
                      <MenuItem value="INTERN">Internship</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: "#14523D",
                    "&:hover": { bgcolor: "#14523D" },
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
                height: 600, 
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#fff"
              }}
            >
              <Box sx={{ p: 3, borderBottom: "1px solid #f0f0f0" }}>
                <Typography variant="h5" fontWeight="bold" color="#14523D">
                  {loading ? "Searching..." : `Jobs Found (${filteredJobs.length})`}
                </Typography>
              </Box>
              
              <Box sx={{ height: "calc(100% - 73px)", overflowY: "auto", p: 1 }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress sx={{ color: "#14523D" }} />
                  </Box>
                ) : filteredJobs.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {filteredJobs.map((job, index) => (
                      <Paper
                        key={index}
                        elevation={selectedJob === job ? 3 : 1}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          transform: selectedJob === job ? "scale(1.02)" : "scale(1)",
                          border: selectedJob === job ? "2px solid #14523D" : "none",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}
                        onClick={() => setSelectedJob(job)}
                      >
                        <ListItem sx={{ px: 2, py: 1.5 }}>
                          <Box sx={{ mr: 2 }}>
                            {getCompanyAvatar(job)}
                          </Box>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#14523D" }}>
                                {job.job_title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                  <BusinessIcon sx={{ fontSize: 14, color: "#888", mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ fontSize: 13, color: "#555" }}>
                                    {job.employer_name || "Not specified"}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                  <LocationOnIcon sx={{ fontSize: 14, color: "#888", mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ fontSize: 13, color: "#555" }}>
                                    {job.job_city ? `${job.job_city}, ${job.job_state || job.job_country}` : 
                                     job.job_country || "Location not specified"}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                                  <Chip 
                                    icon={<AccessTimeIcon sx={{ fontSize: "16px !important", color: "#14523D !important" }} />} 
                                    label={job.job_employment_type || "Not specified"} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: "#EEF5FF", 
                                      color: "#14523D",
                                      fontSize: 12,
                                      height: 24,
                                      fontWeight: "medium"
                                    }}
                                  />
                                  
                                  <Typography variant="body2" sx={{ fontSize: 12, color: "#666" }}>
                                    Posted: {formatDate(job.job_posted_at_datetime_utc)}
                                  </Typography>
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
                    <WorkIcon sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
                    <Typography variant="body1" color="#888" align="center">
                      {jobTitle ? "No job listings found. Try different search terms or location." : "Enter a job title to start searching"}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Job Details Box */}
            <Paper 
              elevation={2} 
              sx={{ 
                flex: 1,
                height: 600,
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#fff",
                position: "relative"
              }}
            >
              {selectedJob ? (
                <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    {getCompanyAvatar(selectedJob)}
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h5" fontWeight="bold" color="#14523D">
                        {selectedJob.job_title}
                      </Typography>
                      <Typography variant="subtitle1" color="#666">
                        {selectedJob.employer_name}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                    <Chip 
                      icon={<LocationOnIcon sx={{ color: "#14523D" }} />}
                      label={selectedJob.job_city ? `${selectedJob.job_city}, ${selectedJob.job_state || selectedJob.job_country}` : 
                             selectedJob.job_country || "Location not specified"}
                      sx={{ bgcolor: "#EEF5FF", color: "#14523D" }}
                    />
                    
                    <Chip 
                      icon={<AccessTimeIcon sx={{ color: "#14523D" }} />}
                      label={selectedJob.job_employment_type || "Not specified"}
                      sx={{ bgcolor: "#EEF5FF", color: "#14523D" }}
                    />
                    
                    <Chip 
                      icon={<AttachMoneyIcon sx={{ color: "#14523D" }} />}
                      label={formatSalary(selectedJob)}
                      sx={{ bgcolor: "#EEF5FF", color: "#14523D" }}
                    />
                    
                    <Chip 
                      icon={<CalendarTodayIcon sx={{ color: "#14523D" }} />}
                      label={`Posted: ${formatDate(selectedJob.job_posted_at_datetime_utc)}`}
                      sx={{ bgcolor: "#EEF5FF", color: "#14523D" }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" fontWeight="bold" color="#14523D" gutterBottom>
                    Job Description
                  </Typography>
                  
                  <Typography variant="body2" color="#555" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                    {selectedJob.job_description || "No description available."}
                  </Typography>
                  
                  {selectedJob.job_highlights?.Qualifications && (
                    <>
                      <Typography variant="h6" fontWeight="bold" color="#14523D" gutterBottom>
                        Qualifications
                      </Typography>
                      <List dense sx={{ mb: 3, pl: 2 }}>
                        {selectedJob.job_highlights.Qualifications.map((item, index) => (
                          <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                            <Typography variant="body2" color="#555">
                              {item}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  
                  {selectedJob.job_highlights?.Responsibilities && (
                    <>
                      <Typography variant="h6" fontWeight="bold" color="#14523D" gutterBottom>
                        Responsibilities
                      </Typography>
                      <List dense sx={{ mb: 3, pl: 2 }}>
                        {selectedJob.job_highlights.Responsibilities.map((item, index) => (
                          <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                            <Typography variant="body2" color="#555">
                              {item}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  
                  {selectedJob.job_highlights?.Benefits && (
                    <>
                      <Typography variant="h6" fontWeight="bold" color="#14523D" gutterBottom>
                        Benefits
                      </Typography>
                      <List dense sx={{ mb: 3, pl: 2 }}>
                        {selectedJob.job_highlights.Benefits.map((item, index) => (
                          <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                            <Typography variant="body2" color="#555">
                              {item}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button 
                      variant="contained" 
                      href={selectedJob.job_apply_link} 
                      target="_blank"
                      sx={{
                        bgcolor: "#14523D",
                        "&:hover": { bgcolor: "#14523D" },
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      Apply for this Job
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "100%",
                  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
                }}>
                  <WorkIcon sx={{ fontSize: 80, color: "#14523D", opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#555", textAlign: "center", maxWidth: 300 }}>
                    Select a job from the list to view details
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