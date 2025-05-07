"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

const teamMembers = [
  { name: "Kularathna P.K.K.S.", image: "/images/santhusha.png" },
  { name: "Atigala A.V.D.S.K.", image: "/images/kavi.png" },
  { name: "Weerasekara W.K.P.M.", image: "/images/poornima.png" },
  { name: "K.G.M. Shanuka", image: "/images/malsha.png" },
];

const features = [
  {
    icon: <SchoolIcon color="primary" />,
    title: "Institute Finder",
    description:
      "Recommends the best and nearest universities using map-based technology, reviews, and rankings.",
  },
  {
    icon: <LightbulbIcon color="secondary" />,
    title: "Course Recommendations",
    description:
      "AI-powered course and degree recommendations aligned with your skills and preferences.",
  },
  {
    icon: <WorkIcon sx={{ color: "#43a047" }} />,
    title: "Job Finder",
    description:
      "Matches you with job opportunities based on your ambitions, completed courses, and skills.",
  },
  {
    icon: <RecordVoiceOverIcon sx={{ color: "#fbc02d" }} />,
    title: "Speak Summary",
    description:
      "Summarizes documents and reads them aloud for accessibility and convenience.",
  },
];

export default function AboutUs() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url('/images/Home_back.png')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
          pt: 8,
          px: 4,
        }}
      >
        <Container maxWidth="md">
          {/* About Aspiro Section */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Mplus 1p",
                fontWeight: "bold",
                fontSize: "40px",
                color: "#112F25",
                mb: 2,
              }}
            >
              About Aspiro
            </Typography>
            <Typography
              sx={{
                fontFamily: "Instrument Sans",
                fontSize: "16px",
                color: "#453C3C",
                maxWidth: 800,
                mx: "auto",
              }}
            >
              Aspiro is a smart learning and career guidance platform built with
              the MERN stack, dedicated to helping individuals discover the best
              path for their future ambitions. Our mission is to empower users
              with personalized course recommendations, skill improvement
              suggestions, and informed career decisions based on their unique
              strengths and aspirations.
            </Typography>
          </Box>

          {/* Features Section */}
          <Grid container spacing={4} mb={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} key={feature.title}>
                <Card
                  elevation={2}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    height: "100%",
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      {feature.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Mplus 1p",
                          fontWeight: "bold",
                          color: "#112F25",
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Instrument Sans",
                        color: "#453C3C",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Vision Section */}
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              p: 4,
              borderRadius: 3,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Mplus 1p",
                fontWeight: "bold",
                color: "#112F25",
                mb: 3,
              }}
            >
              Our Vision
            </Typography>
            <Typography
              sx={{
                fontFamily: "Instrument Sans",
                fontSize: "16px",
                color: "#453C3C",
              }}
            >
              Aspiro is designed to guide you toward the right career path,
              helping you save time, gain relevant skills, and make confident
              decisions for your future. By leveraging advanced AI and
              user-friendly interfaces, we ensure that every learner and job
              seeker is equipped to achieve their ambitions efficiently.
            </Typography>
          </Box>

          {/* Team Section */}
          <Box textAlign="center" my={6}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Mplus 1p",
                fontWeight: "bold",
                color: "#112F25",
                mb: 4,
              }}
            >
              Meet the Team
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {teamMembers.map((member) => (
                <Grid item xs={6} sm={3} key={member.name}>
                  <Avatar
                    src={member.image}
                    sx={{
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "Instrument Sans",
                      fontWeight: 500,
                      color: "#112F25",
                    }}
                  >
                    {member.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}