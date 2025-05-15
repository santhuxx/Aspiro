"use client";
import {Grid,Box,Container, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import SkillList from "../../components/SkillList";
import RecommendedSkillsList from "../../components/RecommendedSkillsList";  

export default function SkillsPage() {
  return (
    <>
    <Box sx={{ backgroundColor: "#DFF6DE", minHeight: "100vh" }}>
      <NavBar />
      <SideMenu />

      <Container sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h2" fontWeight="bold" color="#333" gutterBottom>
          My Skills
        </Typography>
      </Container>


      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" , mt: 5, mb: 5}}>
  <Grid 
    container
    alignItems="center"
    spacing={2} // Reduce spacing between sections
    sx={{ display: "flex", justifyContent: "center" }}
  >
    {/* Left Section: Welcome Message */}
    <Grid item xs={12} md={5}>
  <Box >
    <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
    Enhance
    </Typography>
    <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
    your expertise <br/>
    by managing your <br/>
    personal skill set. 
    </Typography>
    <Typography variant="h4" fontWeight="bold" sx={{ color: "#333", marginTop: "10px" }}>
    Keep track of 
    </Typography>
    <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
    the technologies <br/>
     you know and expand <br/>
     your knowledge with confidence.
    </Typography>
  </Box>
</Grid>

    {/* Right Section: SkillList Component */}
    <Grid item xs={12} md={6}>
      <SkillList />
    </Grid>
  </Grid>
</Container>




<Container 
  maxWidth="lg" 
  sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 10 }} // Increase mb value
>
  <Grid 
    container
    alignItems="center"
    spacing={2} // Reduce spacing between sections
    sx={{ display: "flex", justifyContent: "center" , mt: 5, mb: 5}}
  >
    {/* Left Section: Welcome Message */}
    <Grid item xs={12} md={6}>
      <RecommendedSkillsList />
    </Grid>

    {/* Right Section: SkillList Component */}

    <Grid item xs={12} md={5}>
  <Box>
    <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
    Discover essential <br/>
    skills 
    </Typography>
    <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
    to boost your career. <br/>
     Explore learning resources <br/>
     to stay ahead and
    </Typography>
    <Typography variant="h4" fontWeight="bold" sx={{ color: "#333", marginTop: "10px" }}>
    develop expertise 
    </Typography>
    <Typography variant="body1" fontSize="22px" sx={{ color: "#555" }}>
    in high-demand areas.    </Typography>
  </Box>
</Grid>
    
  </Grid>

</Container>

<container>
  

</container>




     
    </Box>
    </>
  );
}