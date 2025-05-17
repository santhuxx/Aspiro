"use client";
import { Grid, Box, Container, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import SkillList from "@/components/SkillList";
import RecommendedSkillsList from "@/components/RecommendedSkillsList";
import SkillSuggestion from "@/components/SkillSuggestion";

export default function SkillsPage() {
  return (
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <NavBar />
      <SideMenu />

      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h2" fontWeight="bold" color="#333" gutterBottom>
          My Skills
        </Typography>
      </Container>

      {/* Current Skills Section */}
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5 }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {/* Left: Welcome Message */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
                Enhance
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                your expertise <br />
                by managing your <br />
                personal skill set.
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "#333", marginTop: "10px" }}>
                Keep track of
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                the technologies <br />
                you know and expand <br />
                your knowledge with confidence.
              </Typography>
            </Box>
          </Grid>

          {/* Right: SkillList Component */}
          <Grid item xs={12} md={6}>
            <SkillList />
          </Grid>
        </Grid>
      </Container>

      {/* Recommended Skills Section */}
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 10 }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {/* Left: RecommendedSkillsList Component */}
          <Grid item xs={12} md={6}>
            <RecommendedSkillsList />
          </Grid>

          {/* Right: Welcome Message */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
                Discover essential <br />
                skills
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                to boost your career. <br />
                Explore learning resources <br />
                to stay ahead and
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "#333", marginTop: "10px" }}>
                develop expertise
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                in high-demand areas.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Skill Suggestions Section */}
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 10 }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {/* Left: Welcome Message */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
                Tailored Skill <br />
                Suggestions
              </Typography>
              <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
                Get personalized skill <br />
                recommendations to prepare <br />
                for your chosen career path.
              </Typography>
            </Box>
          </Grid>

          {/* Right: SkillSuggestion Component */}
          <Grid item xs={12} md={6}>
            <SkillSuggestion />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}