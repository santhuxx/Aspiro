"use client";
import { Grid, Box, Container, Typography, Button } from "@mui/material";
import NavBar from "@/app/components/NavBar";
import SideMenu from "@/app/components/SideMenu";
import CourseList from "../components/CourseList";
import RecommendedCourses from "../components/RecommendedCourses";

export default function SkillsPage() {

  // Handle navigation to Institute Finder (just for frontend, no routing)
  const navigateToInstituteFinder = () => {
    window.location.href = '/institute-finder'; // Update this with the actual path
  };

  // Handle navigation to Report Generation (just for frontend, no routing)
  const navigateToReportGeneration = () => {
    window.location.href = '/report-generation'; // Update this with the actual path
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "150vh" }}>
        <NavBar />
        <SideMenu />

        <Container sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h3" color="#333" gutterBottom>
            My Courses
          </Typography>
        </Container>

        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5 }}>
          <Grid container alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={12} md={5}>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
                  Comprehensive
                </Typography>
                <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                  Overview of your ongoing and completed courses. <br/>
                 You can easily track your learning journey,  <br/>
                 see which courses you’ve started, and monitor your progress.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <CourseList />
            </Grid>
          </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 10 }}>
          <Grid container alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5 }}>
            <Grid item xs={12} md={6}>
              <RecommendedCourses />
            </Grid>

            <Grid item xs={12} md={5}>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: "#333" }}>
                  Based on your
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
                  Interests and Career Goals,
                </Typography>
                <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                  We have tailored a list of Recommended Courses just for you, ensuring that you receive the most relevant learning opportunities.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Buttons for navigation */}
        <Container sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 10 }}>
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                
                onClick={navigateToInstituteFinder}
                sx={{
                    backgroundColor: "#14523D",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#062b14",
                    },
                  }}
              >
                Institute Finder
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                
                onClick={navigateToReportGeneration}
                sx={{
                    backgroundColor: "#14523D",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#062b14",
                    },
                  }}
              >
                Your Status
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}