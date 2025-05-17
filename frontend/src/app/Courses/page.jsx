'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Box, Container, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import NavBar from '@/components/NavBar';
import SideMenu from '@/components/SideMenu';
import CourseList from '@/components/CourseList';
import RecommendedCourses from '@/components/RecommendedCourses';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CoursesPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [showReport, setShowReport] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch courses for reports
  const fetchCourses = async () => {
    if (!currentUser?.email) {
      setError('No user email provided. Please log in.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const coursesRef = collection(db, 'userCourses', currentUser.email, 'courses');
      const q = query(coursesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedCourses = [];
      querySnapshot.forEach((doc) => {
        fetchedCourses.push({ id: doc.id, ...doc.data() });
      });
      setCourses(fetchedCourses);
      console.log('Fetched courses for report:', fetchedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(`Failed to load courses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle report visibility
  const handleGenerateReport = () => {
    if (!showReport) {
      fetchCourses();
    }
    setShowReport(!showReport);
  };

  // Pie chart data (online vs physical)
  const pieData = {
    labels: ['Online', 'Physical'],
    datasets: [
      {
        data: [
          courses.filter((c) => c.courseType === 'online').length,
          courses.filter((c) => c.courseType === 'physical').length,
        ],
        backgroundColor: ['#14523D', '#26A69A'],
        borderColor: ['#FFFFFF'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data (courses started per month)
  const getMonthlyData = () => {
    const months = Array(12).fill(0); // Last 12 months
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }

    courses.forEach((course) => {
      const startDate = new Date(course.startDate);
      const monthYear = startDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      const index = labels.indexOf(monthYear);
      if (index !== -1) {
        months[index]++;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Courses Started',
          data: months,
          backgroundColor: '#14523D',
          borderColor: '#14523D',
          borderWidth: 1,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#133429', font: { size: 14 } },
      },
      tooltip: {
        backgroundColor: '#B5CFB4',
        titleColor: '#133429',
        bodyColor: '#133429',
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#B5CFB4',
        titleColor: '#133429',
        bodyColor: '#133429',
      },
    },
    scales: {
      x: {
        ticks: { color: '#133429', maxRotation: 45, minRotation: 45 },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#133429', stepSize: 1 },
        grid: { color: 'rgba(181, 207, 180, 0.3)' },
        beginAtZero: true,
      },
    },
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#14523D' }} />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Please log in to view courses.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#DFF6DE', minHeight: '100vh', overflowY: 'auto' }}>
      <NavBar />
      <SideMenu />
      <Container sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant='h3' color='#14523D' fontWeight='bold' gutterBottom>
          My Courses
        </Typography>
      </Container>

      <Container maxWidth='lg' sx={{ mt: 5, mb: 5 }}>
        <Grid container alignItems='center' spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant='h3' fontWeight='bold' sx={{ color: '#14523D' }}>
                Comprehensive
              </Typography>
              <Typography variant='body1' fontSize='22px' sx={{ color: '#555' }}>
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

      <Container maxWidth='lg' sx={{ mt: 5, mb: 10 }}>
        <Grid container alignItems='center' spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={6}>
            <RecommendedCourses email={currentUser.email} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant='h5' fontWeight='bold' sx={{ color: '#14523D' }}>
                Based on your
              </Typography>
              <Typography variant='h3' fontWeight='bold' sx={{ color: '#14523D' }}>
                Interests and Career Goals,
              </Typography>
              <Typography variant='body1' fontSize='22px' sx={{ color: '#555' }}>
                We have tailored a list of Recommended Courses just for you, ensuring that you receive the most relevant learning opportunities.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 10 }}>
        <Grid container alignItems='center' justifyContent='center' spacing={2}>
          <Grid item>
            <Button
              variant='contained'
              onClick={() => window.location.href = '/institute-finder'}
              sx={{
                backgroundColor: '#14523D',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#062b14' },
              }}
            >
              Institute Finder
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              onClick={handleGenerateReport}
              sx={{
                backgroundColor: '#14523D',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#062b14' },
              }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Container>

      {showReport && (
        <Container maxWidth='lg' sx={{ mt: 5, mb: 10 }}>
          <Box
            sx={{
              background: '#B5CFB4',
              p: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Typography variant='h3' color='#14523D' fontWeight='bold' gutterBottom>
              Course Reports
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: '#14523D' }} />
              </Box>
            ) : error ? (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : courses.length === 0 ? (
              <Typography color='#133429'>
                No courses available to generate reports.
              </Typography>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant='h5' color='#14523D' fontWeight='bold' gutterBottom>
                    Course Type Distribution
                  </Typography>
                  <Box sx={{ maxWidth: 400, height: 300, mx: 'auto' }}>
                    <Pie data={pieData} options={pieOptions} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant='h5' color='#14523D' fontWeight='bold' gutterBottom>
                    Courses Started Per Month
                  </Typography>
                  <Box sx={{ maxWidth: 600, height: 300, mx: 'auto' }}>
                    <Bar data={getMonthlyData()} options={barOptions} />
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      )}
    </Box>
  );
}
