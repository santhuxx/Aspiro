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
  Input
} from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebase/firebase';
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
    mobileNumber: ''
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
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
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
        photoURL
      });

      // Save additional user info to backend
      await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          ...formData,
          photoURL
        })
      });

      router.push('/home');
    } catch (err) {
      console.error('Sign-up error:', err.code, err.message);
      setError(`Failed to create account: ${err.message}`);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h5" gutterBottom>
        Sign Up
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
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Sex</InputLabel>
          <Select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
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
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>
      <GoogleButton isSignUp={true} />
      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link href="/signin">Sign In</Link>
      </Typography>
    </Box>
  );
}