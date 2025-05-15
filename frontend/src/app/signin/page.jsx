
'use client';
import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Fade } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import GoogleButton from '../../components/GoogleButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,rgb(154, 154, 154) 0%,rgb(193, 242, 191) 100%)',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={600}>
        <Box
          sx={{
            maxWidth: { xs: '90%', sm: 400 },
            width: '100%',
            p: 4,
            bgcolor: 'rgb(161, 203, 160)', //rgb(142, 173, 141) with transparency
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography
            variant={{ xs: 'h5', sm: 'h4' }}
            align="center"
            sx={{ color: '#133429', fontWeight: 'bold', mb: 3, textAlign: 'center' }}
          >
            Welcome Back to ASPIRO
          </Typography>
          <form onSubmit={handleSignIn}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(20, 82, 61, 0.3)' },
                  '&:hover fieldset': { borderColor: '#14523D' },
                  '&.Mui-focused fieldset': { borderColor: '#14523D' },
                },
                '& .MuiInputLabel-root': { color: '#133429' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#14523D' },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(20, 82, 61, 0.3)' },
                  '&:hover fieldset': { borderColor: '#14523D' },
                  '&.Mui-focused fieldset': { borderColor: '#14523D' },
                },
                '& .MuiInputLabel-root': { color: '#133429' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#14523D' },
              }}
            />
            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(255, 235, 238, 0.9)' }}>
                  {error}
                </Alert>
              </Fade>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#14523D',
                '&:hover': {
                  bgcolor: '#062b14',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'medium',
              }}
            >
              Sign In
            </Button>
          </form>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <GoogleButton />
          </Box>
          <Typography
            align="center"
            sx={{ mt: 3, color: '#133429' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              style={{
                color: '#14523D',
                fontWeight: 'medium',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}

