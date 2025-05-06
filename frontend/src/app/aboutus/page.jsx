'use client';

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
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
  List,
  ListItem,
  ListItemIcon
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

const teamMembers = [
  { name: 'Kularathna P.K.K.S.', initials: 'KK', color: '#1976d2',image: '/images/santhusha.png' },
  { name: 'Atigala A.V.D.S.K.', initials: 'AV', color: '#388e3c',image: '/images/kavi.png' },
  { name: 'Weerasekara W.K.P.M.', initials: 'WK', color: '#fbc02d',image: '/images/poornima.png' },
  { name: 'K.G.M. Shanuka', initials: 'KS', color: '#d32f2f' ,image: '/images/malsha.png'},
];

const features = [
  {
    icon: <SchoolIcon color="primary" />,
    title: 'Institute Finder',
    description: 'Discover best universities using map-based REST API with real-time reviews and rankings.',
  },
  {
    icon: <LightbulbIcon color="secondary" />,
    title: 'Course Recommendations',
    description: 'AI-powered course suggestions based on your skills and interests.',
  },
  {
    icon: <WorkIcon sx={{ color: '#43a047' }} />,
    title: 'Job Finder',
    description: 'Targeted job matches with direct application URLs based on your profile.',
  },
  {
    icon: <RecordVoiceOverIcon sx={{ color: '#fbc02d' }} />,
    title: 'Speak Summary',
    description: 'AI document reader with text-to-speech for accessibility and quick learning.',
  },
];

export default function AboutUs() {
  const [email, setEmail] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <NavBar />
      <SideMenu />

      <Box
        sx={{
          backgroundImage: `url('/images/Home_back.png')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
          pt: 8,
          px: 4
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h1"
              sx={{
                fontFamily: "Mplus 1p",
                fontWeight: "bold",
                fontSize: "55px",
                color: "#112F25",
                mb: 2
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
                mx: 'auto'
              }}
            >
              Aspiro is a smart career guidance platform that helps you find the best educational and professional path using AI-powered recommendations and real-time data analysis.
            </Typography>
          </Box>

          <Grid container spacing={4} mb={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} key={feature.title}>
                <Card elevation={2} sx={{ 
                  bgcolor: 'rgba(255,255,255,0.9)',
                  height: '100%',
                  borderRadius: 3
                }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                      {feature.icon}
                      <Typography 
                        variant="h6" 
                        sx={{
                          fontFamily: "Mplus 1p",
                          fontWeight: "bold",
                          color: "#112F25"
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body2" 
                      sx={{
                        fontFamily: "Instrument Sans",
                        color: "#453C3C"
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.9)', 
              p: 4, 
              borderRadius: 3,
              mb: 4
            }}
          >
            <Typography 
              variant="h2"
              sx={{
                fontFamily: "Mplus 1p",
                fontWeight: "bold",
                color: "#112F25",
                mb: 3
              }}
            >
              Why Choose Aspiro?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    fontFamily: "Instrument Sans",
                    color: "#453C3C",
                    mb: 1
                  }}
                >
                  • Personalized career guidance
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Instrument Sans",
                    color: "#453C3C",
                    mb: 1
                  }}
                >
                  • AI-powered document summarization
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    fontFamily: "Instrument Sans",
                    color: "#453C3C",
                    mb: 1
                  }}
                >
                  • Time and cost efficiency
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Instrument Sans",
                    color: "#453C3C"
                  }}
                >
                  • Future-proofing careers
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box textAlign="center" my={6}>
            <Typography 
              variant="h2"
              sx={{
                fontFamily: "Mplus 1p",
                fontWeight: "bold",
                color: "#112F25",
                mb: 4
              }}
            >
              Our Team
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {teamMembers.map((member) => (
                <Grid item xs={6} sm={3} key={member.name}>
                  <Avatar
                    sx={{
                      bgcolor: member.color,
                      width: 64,
                      height: 64,
                      fontSize: 28,
                      fontWeight: 'bold',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {member.initials}
                  </Avatar>
                  <Typography 
                    variant="subtitle1"
                    sx={{
                      fontFamily: "Instrument Sans",
                      fontWeight: 500,
                      color: "#112F25"
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
