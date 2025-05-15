'use client';
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Input,
  Alert,
  Fade,
} from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import GoogleButton from '../../components/GoogleButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    sex: '',
    country: '',
    mobileNumber: '',
  });
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const storage = getStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.password || !formData.birthDate || !formData.sex || !formData.country || !formData.mobileNumber) {
        setError('All fields are required');
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      let photoURL = '';

      // Upload image to Firebase Storage if selected
      if (selectedImage) {
        const storageRef = ref(storage, `profile_images/${user.uid}/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Authentication user profile
      await updateProfile(user, {
        displayName: formData.name,
        photoURL,
      });

      // Save user info to Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: formData.name,
          email: formData.email,
          birthDate: formData.birthDate,
          sex: formData.sex,
          country: formData.country,
          mobileNumber: formData.mobileNumber,
          photoURL,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      router.push('/home');
    } catch (err) {
      console.error('Sign-up error:', err.code, err.message);
      setError(`Failed to create account: ${err.message}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,rgb(201, 202, 201) 0%,rgb(194, 199, 193) 100%)',
        p: { xs: 2, sm: 4 },
        overflowY: 'auto',
      }}
    >
      <Fade in timeout={600}>
        <Box
          sx={{
            maxWidth: { xs: '90%', sm: 500 },
            width: '100%',
            p: 4,
            bgcolor: 'rgb(181, 207, 180)', // #B5CFB4 with transparency
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography
            variant={{ xs: 'h5', sm: 'h4' }}
            align="center"
            sx={{ color: '#133429', fontWeight: 'bold', mb: 3 }}
          >
            Create Your Account
          </Typography>
          <form onSubmit={handleSignUp}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={imagePreview || '/default-avatar.png'}
                alt={formData.name || 'User'}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                sx={{ mt: 1 }}
              />
            </Box>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
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
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
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
              label="Birth Date"
              name="birthDate"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.birthDate}
              onChange={handleChange}
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
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#133429', '&.Mui-focused': { color: '#14523D' } }}>
                Sex
              </InputLabel>
              <Select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(20, 82, 61, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#14523D' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#14523D' },
                  color: '#133429',
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Country"
              name="country"
              fullWidth
              margin="normal"
              value={formData.country}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&fieldset': { borderColor: 'rgba(20, 82, 61, 0.3)' },
                  '&:hover fieldset': { borderColor: '#14523D' },
                  '&.Mui-focused fieldset': { borderColor: '#14523D' },
                },
                '& .MuiInputLabel-root': { color: '#133429' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#14523D' },
              }}
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              fullWidth
              margin="normal"
              value={formData.mobileNumber}
              onChange={handleChange}
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
              Sign Up
            </Button>
          </form>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <GoogleButton isSignUp={true} />
          </Box>
          <Typography align="center" sx={{ mt: 3, color: '#133429' }}>
            Already have an account?{' '}
            <Link
              href="/signin"
              style={{
                color: '#14523D',
                fontWeight: 'medium',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}
