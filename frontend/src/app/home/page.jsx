"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import FutureJobPopup from "@/components/FutureJobPopup";
import { Box, Container, Typography, Grid, Button, styled, Fab } from "@mui/material";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

// Custom styled components
const HeroBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0C5A40 0%, #1A8A6C 100%)",
  color: "#F8FAF8",
  padding: theme.spacing(14, 0),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
    zIndex: 1,
  },
}));

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: "#F8FAF8",
  "&:nth-of-type(even)": {
    backgroundColor: "#E8F0EC",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#0C5A40",
  color: "#F8FAF8",
  borderRadius: 12,
  padding: theme.spacing(1.5, 5),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1.1rem",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#26A69A",
    transform: "scale(1.05)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
  position: "relative",
  height: "100%",
  minHeight: "300px",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
    zIndex: 1,
  },
}));

const FloatingCTA = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: "#26A69A",
  color: "#F8FAF8",
  "&:hover": {
    backgroundColor: "#0C5A40",
  },
  zIndex: 1000,
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(0, 3),
}));

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const [email, setEmail] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkFutureJob = async () => {
      if (!email) return;

      try {
        const docRef = doc(db, "futureJob", email);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setTimeout(() => {
            setShowPopup(true);
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking future job data:", error);
      }
    };

    checkFutureJob();
  }, [email]);

  if (!isClient) return null;

  return (
    <>
      <NavBar />
      <SideMenu />

      {/* Hero Section */}
      <HeroBox>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 4, letterSpacing: "-0.02em" }}
          >
            Welcome to Aspiro
          </Typography>
          <Typography
            variant="h5"
            paragraph
            sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.7, opacity: 0.9, fontWeight: 300 }}
          >
            Aspiro is your smart learning and career guidance platform. We help you find the best path for your future ambitions with personalized course recommendations and skill improvement suggestions based on your goals and interests.
          </Typography>
        </Container>
      </HeroBox>

      {/* Find Institutes Section */}
      <SectionBox
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, color: "#0C5A40", mb: 3 }}
              >
                Find Best Institutes
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                paragraph
                sx={{ lineHeight: 1.9, mb: 4, fontSize: "1.1rem" }}
              >
                Discover top-tier institutes tailored to your career goals. Our platform analyzes your interests and aspirations to recommend the best educational institutions for your success.
              </Typography>
              <Link href="/institutes" passHref legacyBehavior>
                <ActionButton>Explore Institutes</ActionButton>
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageBox>
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
                  alt="Institutes"
                />
              </ImageBox>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* Online Learning Platforms Section */}
      <SectionBox
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <ImageBox>
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  alt="Online Learning"
                />
              </ImageBox>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, color: "#0C5A40", mb: 3 }}
              >
                Online Learning Platforms
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                paragraph
                sx={{ lineHeight: 1.9, mb: 4, fontSize: "1.1rem" }}
              >
                Access personalized online courses designed to elevate your skills. Learn at your own pace with flexible platforms that align with your career aspirations.
              </Typography>
              <Link href="/onlinelearning" passHref legacyBehavior>
                <ActionButton>Discover Courses</ActionButton>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      {/* Find Jobs Section */}
      <SectionBox
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, color: "#0C5A40", mb: 3 }}
              >
                Find Jobs
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                paragraph
                sx={{ lineHeight: 1.9, mb: 4, fontSize: "1.1rem" }}
              >
                Explore job opportunities that match your skills and ambitions. Our platform connects you with roles that pave the way for a successful career.
              </Typography>
              <Link href="/jobs" passHref legacyBehavior>
                <ActionButton>Search Jobs</ActionButton>
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageBox>
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                  alt="Jobs"
                />
              </ImageBox>
            </Grid>
          </Grid>
        </Container>
      </SectionBox>

      

      {showPopup && email && (
        <FutureJobPopup
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          email={email}
        />
      )}
    </>
  );
}

