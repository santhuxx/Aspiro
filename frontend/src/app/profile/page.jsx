'use client';
import { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  Grid,
  Divider,
  Input
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export default function Profile() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    sex: '',
    country: '',
    mobileNumber: '',
    photoURL: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const storage = getStorage();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/signin');
    } else if (currentUser) {
      // Fetch user profile
      fetch(`http://localhost:5001/api/auth/profile/${currentUser.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || currentUser.displayName || '',
            email: data.email || currentUser.email,
            birthDate: data.birthDate || '',
            sex: data.sex || '',
            country: data.country || '',
            mobileNumber: data.mobileNumber || '',
            photoURL: data.photoURL || currentUser.photoURL || ''
          });
        })
        .catch((err) => setError('Failed to load profile'));
    }
  }, [currentUser, loading, router]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let photoURL = formData.photoURL;

      // Upload image to Firebase Storage if a new image is selected
      if (selectedImage) {
        const storageRef = ref(storage, `profile_images/${currentUser.uid}/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Authentication user profile
      await updateProfile(currentUser, {
        displayName: formData.name,
        photoURL: photoURL
      });

      // Update Firestore with all profile data
      const response = await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentUser.uid,
          ...formData,
          photoURL
        })
      });

      if (response.ok) {
        setSuccess('Profile updated successfully');
        setError('');
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);
        setFormData((prev) => ({ ...prev, photoURL }));
      } else {
        setError('Failed to update profile');
        setSuccess('');
      }
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
      setSuccess('');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 8,
        p: 4
      }}
    >
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src={imagePreview || formData.photoURL || currentUser?.photoURL || '/default-avatar.png'}
              alt={formData.name || 'User'}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              {formData.name || 'User Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formData.email}
            </Typography>
          </Box>

          {!isEditing ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Birth Date
                  </Typography>
                  <Typography variant="body1">
                    {formData.birthDate || 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Sex
                  </Typography>
                  <Typography variant="body1">
                    {formData.sex || 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Country
                  </Typography>
                  <Typography variant="body1">
                    {formData.country || 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Mobile Number
                  </Typography>
                  <Typography variant="body1">
                    {formData.mobileNumber || 'Not set'}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Button
                variant="contained"
                onClick={handleEditToggle}
                sx={{ display: 'block', mx: 'auto' }}
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleUpdate}>
              <Typography variant="h6" gutterBottom>
                Edit Profile Details
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  src={imagePreview || formData.photoURL || currentUser?.photoURL || '/default-avatar.png'}
                  alt={formData.name || 'User'}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
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
                disabled
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
              {success && (
                <Typography color="success.main" sx={{ mt: 1 }}>
                  {success}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}