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
  Divider,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Navbar from "../../components/NavBar";
import SideMenu from "../../components/SideMenu";

export default function OnlineLearning() {
  const { currentUser, loading: authLoading } = useAuth();
  const [courseTopic, setCourseTopic] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Use the same Gemini API key as JobMatchResultPopup
  const GEMINI_API_KEY = "AIzaSyCk_vpgdzjOAOhozrJZXb9s3nsn1DUloqA";

  // Fetch finalJob and incomplete skills from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser || authLoading) {
        console.log("No current user or auth loading:", { currentUser, authLoading });
        return;
      }

      setFetchingData(true);
      setError("");
      try {
        console.log("Fetching data for user:", currentUser.email);

        // Fetch finalJob
        const jobDocRef = doc(db, "finalJobDecisions", currentUser.email);
        const jobDocSnap = await getDoc(jobDocRef);

        let finalJob = "";
        if (jobDocSnap.exists()) {
          finalJob = jobDocSnap.data().finalJob || "";
          setCourseTopic(finalJob);
          console.log("Fetched finalJob:", finalJob);
        } else {
          console.log("No finalJob document found for user:", currentUser.email);
        }

        // Fetch incomplete skills
        const skillsDocRef = doc(db, "userSkills", currentUser.email);
        const skillsDocSnap = await getDoc(skillsDocRef);

        let incompleteSkills = [];
        if (skillsDocSnap.exists()) {
          const skillsData = skillsDocSnap.data().skills || [];
          incompleteSkills = skillsData
            .filter(skill => !skill.completed)
            .map(skill => skill.name);
          console.log("Fetched incomplete skills:", incompleteSkills);
        } else {
          console.log("No skills document found for user:", currentUser.email);
        }

        // Trigger course search if finalJob exists
        if (finalJob) {
          await handleSearch(finalJob, incompleteSkills);
        } else {
          setError("No dream job selected. Please choose a job in Job Match Result.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchUserData();
  }, [currentUser, authLoading]);

  const handleSearch = async (job = courseTopic, incompleteSkills = []) => {
    if (job.trim() === "") {
      setError("Please enter a job or skill to search for courses.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const prompt = `
        Suggest 10-20 online courses for someone pursuing a career as a "${job}" who needs to develop the following skills: ${incompleteSkills.length > 0 ? incompleteSkills.join(", ") : "none"}. 
        For each course, provide:
        - Course title
        - Platform (e.g., Coursera, Udemy, LinkedIn Learning)
        - URL (if available, or a placeholder like "https://platform.com")
        - Duration (e.g., "4 weeks", "10 hours")
        - Level (e.g., Beginner, Intermediate, Advanced)
        Return only a valid JSON array of course objects.
      `;

      console.log("Sending Gemini API request with prompt:", prompt);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Gemini API response:", response.data);

      // Parse Gemini response
      const resultText = response.data.candidates[0].content.parts[0].text;
      let coursesData;
      try {
        // Extract JSON from potential markdown or prefixed text
        const jsonMatch = resultText.match(/{[\s\S]*}|\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }
        const cleanedText = jsonMatch[0];
        coursesData = JSON.parse(cleanedText);
        console.log("Parsed courses data:", coursesData);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError, "Raw text:", resultText);
        setError("Failed to parse course data. Please try again.");
        coursesData = [];
      }

      // Normalize and validate courses
      const validCourses = Array.isArray(coursesData)
        ? coursesData
            .map(course => ({
              title: course.title || course['Course Title'] || course['course title'],
              platform: course.platform || course['Platform'] || course['platform'],
              url: course.url || course['URL'] || course['Url'],
              duration: course.duration || course['Duration'] || course['duration'],
              level: course.level || course['Level'] || course['level']
            }))
            .filter(course =>
              course.title &&
              course.platform &&
              course.url &&
              course.duration &&
              course.level
            )
        : [];

      console.log("Valid courses after filtering:", validCourses);
      setCourses(validCourses);

      if (validCourses.length === 0) {
        setError("No valid courses found. Try a different job or skill.");
      }
    } catch (error) {
      console.error("Error fetching courses from Gemini:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError("Failed to fetch courses. Please check your API key or try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on selected filters
  const filteredCourses = courses.filter(course => {
    let matchesPlatform = true;
    let matchesLevel = true;

    if (platformFilter) {
      matchesPlatform = course.platform.toLowerCase().includes(platformFilter.toLowerCase());
    }
    if (levelFilter) {
      matchesLevel = course.level.toLowerCase() === levelFilter.toLowerCase();
    }

    console.log("Filtering courses:", { course, matchesPlatform, matchesLevel });
    return matchesPlatform && matchesLevel;
  });

  console.log("Filtered courses:", filteredCourses);

  if (authLoading || fetchingData) {
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
          Please log in to use the Online Learning Finder.
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
              Find Your Perfect Online Course
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: "auto", opacity: 0.9 }}>
              Discover top online courses to boost your skills and achieve your career goals
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
                placeholder="Job Title or Skill (e.g., Chef, Python)"
                variant="outlined"
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
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
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Platform filter' }}
                      sx={{
                        borderRadius: 2,
                        bgcolor: "white",
                        height: "56px",
                        "& fieldset": { border: "none" },
                      }}
                    >
                      <MenuItem value="">All Platforms</MenuItem>
                      <MenuItem value="Coursera">Coursera</MenuItem>
                      <MenuItem value="Udemy">Udemy</MenuItem>
                      <MenuItem value="LinkedIn Learning">LinkedIn Learning</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl 
                    variant="outlined" 
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <Select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Level filter' }}
                      sx={{
                        borderRadius: 2,
                        bgcolor: "white",
                        height: "56px",
                        "& fieldset": { border: "none" },
                      }}
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => handleSearch()}
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

          {/* Error Message */}
          {error && (
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

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
                  {loading ? "Searching..." : `Courses Found (${filteredCourses.length})`}
                </Typography>
              </Box>
              
              <Box sx={{ height: 480, overflowY: "auto", p: 1 }}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <CircularProgress sx={{ color: "#14523D" }} />
                  </Box>
                ) : filteredCourses.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {filteredCourses.map((course, index) => (
                      <Paper
                        key={index}
                        elevation={selectedCourse === course ? 3 : 1}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          transform: selectedCourse === course ? "scale(1.02)" : "scale(1)",
                          border: selectedCourse === course ? "2px solid #14523D" : "none",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <ListItem sx={{ px: 2, py: 1.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#14523D" }}>
                                {course.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                  <LanguageIcon sx={{ fontSize: 14, color: "#888", mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ fontSize: 13, color: "#555" }}>
                                    {course.platform}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <Chip 
                                    icon={<AccessTimeIcon sx={{ fontSize: "16px !important", color: "#14523D !important" }} />} 
                                    label={course.duration} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: "#EEF5FF", 
                                      color: "#14523D",
                                      fontSize: 12,
                                      height: 24
                                    }}
                                  />
                                  <Typography variant="body2" sx={{ fontSize: 12, color: "#666" }}>
                                    {course.level}
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
                    <SchoolIcon 
                      sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
                    <Typography variant="body1" color="#888" align="center">
                      {courseTopic ? "No courses found. Try different search terms." : "Enter a job or skill to start searching"}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Course Details Box */}
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
              {selectedCourse ? (
                <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
                  <Typography variant="h5" fontWeight="bold" color="#14523D">
                    {selectedCourse.title}
                  </Typography>
                  <Typography variant="subtitle1" color="#666" sx={{ mb: 2 }}>
                    {selectedCourse.platform}
                  </Typography>
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                    <Chip 
                      icon={<AccessTimeIcon sx={{ color: "#14523D" }} />}
                      label={selectedCourse.duration}
                      sx={{ bgcolor: "#EEF5FF", color: "#14523D" }}
                    />
                    <Chip 
                      icon={<SchoolIcon sx={{ color: "#14523D" }} />}
                      label={selectedCourse.level}
                      sx={{ bgcolor: "#EEF5FF", color: "#14523D" }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" fontWeight="bold" color="#14523D" gutterBottom>
                    Course Details
                  </Typography>
                  <Typography variant="body2" color="#555" sx={{ mb: 3 }}>
                    This course is designed to help you develop skills for {courseTopic || "your career"}. 
                    Offered by {selectedCourse.platform}, it is suitable for {selectedCourse.level.toLowerCase()} learners.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button 
                      variant="contained" 
                      href={selectedCourse.url} 
                      target="_blank"
                      sx={{
                        bgcolor: "#14523D",
                        "&:hover": { bgcolor: "#062b14" },
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      Enroll Now
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
                  <SchoolIcon sx={{ fontSize: 80, color: "#14523D", opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#555", textAlign: "center", maxWidth: 300 }}>
                    Select a course from the list to view details
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