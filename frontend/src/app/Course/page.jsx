"use client";
import { useAuth } from "@/context/AuthContext";
import { Box, Container, Typography, Button, Grid, CircularProgress } from "@mui/material";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import CourseList from "@/components/CourseList";
import RecommendedCourses from "@/components/RecommendedCourses";

export default function CoursesPage() {
  const { currentUser, loading: authLoading } = useAuth();

  const navigateToInstituteFinder = () => {
    window.location.href = "/institute-finder";
  };

  const navigateToReportGeneration = () => {
    window.location.href = "/report-generation";
  };

  if (authLoading) {
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
          Please log in to view courses.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh", overflowY: "auto" }}>
      <NavBar />
      <SideMenu />
      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h3" color="#14523D" fontWeight="bold" gutterBottom>
          My Courses
        </Typography>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Grid container alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "#14523D" }}>
                Comprehensive
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                Overview of your ongoing and completed courses. <br />
                You can easily track your learning journey, <br />
                see which courses you’ve started, and monitor your progress.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <CourseList email={currentUser.email} />
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        <Grid container alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid item xs={12} md={6}>
            <RecommendedCourses email={currentUser.email} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#14523D" }}>
                Based on your
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "#14523D" }}>
                Interests and Career Goals,
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                We have tailored a list of Recommended Courses just for you, ensuring that you receive the most relevant learning opportunities.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 10 }}>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              onClick={navigateToInstituteFinder}
              sx={{
                backgroundColor: "#14523D",
                color: "#FFFFFF",
                "&:hover": { backgroundColor: "#062b14" },
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
                "&:hover": { backgroundColor: "#062b14" },
              }}
            >
              Your Status
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
