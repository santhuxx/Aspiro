"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import FutureJobPopup from "@/components/FutureJobPopup";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState(null); // Use null until real email is set
  const [isClient, setIsClient] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Ensure code runs on client only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the signed-in user's email
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check futureJobs/{email} in Firestore
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

      <Box
        sx={{
          backgroundImage: `url('/images/Home_back.png')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        }}
      >
        <Link href="/institutes" passHref>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#112F25",
              color: "#fff",
              mt: 50,
              px: 1,
              ml: 6.5,
            }}
          >
            Find Institutes
          </Button>
        </Link>

        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: 180,
            left: 50,
            fontFamily: "Mplus 1p",
            fontWeight: "bold",
            fontSize: "55px",
            color: "#112F25",
            lineHeight: 1.2,
          }}
        >
          Find best
          <br />
          Institutes
        </Typography>

        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: 330,
            left: 54,
            fontFamily: "Instrument Sans",
            fontWeight: "bold",
            fontSize: "10px",
            color: "#453C3C",
            lineHeight: 1.2,
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting <br />
          industry. Lorem Ipsum has been the industry's standard dummy text<br />
          ever since the 1500s, when an unknown printer took a galley of<br />
          type and scrambled it to make a type specimen book.
        </Typography>
      </Box>

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