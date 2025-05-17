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
  Input,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { updateProfile, deleteUser } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import Navbar from '../../components/Navbar';
import SideMenu from '../../components/SideMenu';

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
    photoURL: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [birthDateError, setBirthDateError] = useState(''); // New state for birth date error
  const storage = getStorage();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/signin');
    } else if (currentUser) {
      const fetchProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const data = userDoc.exists() ? userDoc.data() : {};
          setFormData({
            name: data.name || currentUser.displayName || '',
            email: data.email || currentUser.email || '',
            birthDate: data.birthDate || '',
            sex: data.sex || '',
            country: data.country || '',
            mobileNumber: data.mobileNumber || '',
            photoURL: data.photoURL || currentUser.photoURL || '',
          });
        } catch (err) {
          setError('Failed to load profile');
          console.error('Fetch profile error:', err);
        }
      };
      fetchProfile();
    }
  }, [currentUser, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'birthDate') {
      // Validate birth date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        setBirthDateError('Birth date cannot be in the future');
        return; // Don't update formData
      } else {
        setBirthDateError('');
      }
    }
    setFormData({ ...formData, [name]: value });
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
    setError('');
    setSuccess('');
    try {
      // Validate inputs
      if (!formData.name || !formData.birthDate || !formData.sex || !formData.country || !formData.mobileNumber) {
        setError('All editable fields are required');
        return;
      }

      // Validate birth date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const birthDate = new Date(formData.birthDate);
      if (birthDate > today) {
        setError('Birth date cannot be in the future');
        setBirthDateError('Birth date cannot be in the future');
        return;
      }

      let photoURL = formData.photoURL;

      // Upload image to Firebase Storage if selected
      if (selectedImage) {
        const storageRef = ref(storage, `profile_images/${currentUser.uid}/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Authentication user profile
      await updateProfile(currentUser, {
        displayName: formData.name,
        photoURL,
      });

      // Update Firestore
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          name: formData.name,
          email: formData.email,
          birthDate: formData.birthDate,
          sex: formData.sex,
          country: formData.country,
          mobileNumber: formData.mobileNumber,
          photoURL,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setSuccess('Profile updated successfully');
      setError('');
      setBirthDateError('');
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, photoURL }));
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
      setSuccess('');
      console.error('Update profile error:', err);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    setBirthDateError('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete Storage files
      const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
      const listResult = await listAll(storageRef);
      await Promise.all(listResult.items.map((itemRef) => deleteObject(itemRef)));

      // Delete Firestore document
      await deleteDoc(doc(db, 'users', currentUser.uid));

      // Delete Firebase Auth user
      await deleteUser(currentUser);

      // Redirect to /signin immediately
      router.push('/signin');
    } catch (err) {
      console.error('Delete account error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Please sign in again to delete your account');
      } else {
        setError(`Failed to delete account: ${err.message}`);
      }
      setSuccess('');
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #DFF6DE 0%, #B5CFB4 100%)', minHeight: '100vh' }}>
      <Navbar />
      <SideMenu />
      <Box
        sx={{
          maxWidth: { xs: '90%', sm: 600 },
          mx: 'auto',
          pt: { xs: 14, sm: 16 },
          pb: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Fade in timeout={600}>
          <Card
            sx={{
              bgcolor: 'rgba(181, 207, 180, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                  src={imagePreview || formData.photoURL || '/default-avatar.png'}
                  alt={formData.name || 'User'}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': isEditing ? { transform: 'scale(1.05)' } : {},
                  }}
                />
                <Typography
                  variant={{ xs: 'h5', sm: 'h4' }}
                  sx={{ color: '#133429', fontWeight: 'bold' }}
                >
                  {formData.name || 'User Profile'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#133429', opacity: 0.7 }}>
                  {formData.email}
                </Typography>
              </Box>

              {!isEditing ? (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ color: '#133429', opacity: 0.6 }}>
                        Birth Date
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#133429' }}>
                        {formData.birthDate || 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ color: '#133429', opacity: 0.6 }}>
                        Sex
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#133429' }}>
                        {formData.sex || 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ color: '#133429', opacity: 0.6 }}>
                        Country
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#133429' }}>
                        {formData.country || 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ color: '#133429', opacity: 0.6 }}>
                        Mobile Number
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#133429' }}>
                        {formData.mobileNumber || 'Not set'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={handleEditToggle}
                      sx={{
                        bgcolor: '#14523D',
                        '&:hover': { bgcolor: '#062b14', transform: 'scale(1.05)' },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleDeleteOpen}
                      sx={{
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        '&:hover': {
                          borderColor: '#b71c1c',
                          bgcolor: 'rgba(211, 47, 47, 0.1)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleUpdate}>
                  <Typography
                    variant="h6"
                    sx={{ color: '#133429', fontWeight: 'medium', mb: 2 }}
                  >
                    Edit Profile Details
                  </Typography>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                      src={imagePreview || formData.photoURL || '/default-avatar.png'}
                      alt={formData.name || 'User'}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      sx={{ mt: 1, color: '#133429' }}
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
                    disabled
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(20, 82, 61, 0.3)' },
                      },
                      '& .MuiInputLabel-root': { color: '#133429' },
                    }}
                  />
                  <TextField
                    label="Birth Date"
                    name="birthDate"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ max: today }} // Restrict future dates in picker
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    error={!!birthDateError}
                    helperText={birthDateError}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(20, 82, 61, 0.3)' },
                        '&:hover fieldset': { borderColor: '#14523D' },
                        '&.Mui-focused fieldset': { borderColor: '#14523D' },
                      },
                      '& .MuiInputLabel-root': { color: '#133429' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#14523D' },
                      '& .MuiFormHelperText-root': { color: '#d32f2f' },
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
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(20, 82, 61, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#14523D' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#14523D',
                        },
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
                        '& fieldset': { borderColor: 'rgba(20, 82, 61, 0.3)' },
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
                  {success && (
                    <Fade in={!!success}>
                      <Alert severity="success" sx={{ mt: 2, bgcolor: 'rgba(200, 230, 201, 0.9)' }}>
                        {success}
                      </Alert>
                    </Fade>
                  )}
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!!birthDateError} // Disable if birth date is invalid
                      sx={{
                        bgcolor: '#14523D',
                        '&:hover': { bgcolor: '#062b14', transform: 'scale(1.05)' },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: '#14523D',
                        color: '#14523D',
                        '&:hover': { borderColor: '#062b14', bgcolor: 'rgba(20, 82, 61, 0.1)' },
                      }}
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteClose}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(181, 207, 180, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxWidth: 400,
              width: '90%',
            },
          }}
        >
          <DialogTitle sx={{ color: '#133429', fontWeight: 'bold' }}>
            Are you sure?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#133429' }}>
              Deleting your account is permanent and cannot be undone. All your data, including profile information and associated files, will be removed.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
            <Button
              onClick={handleDeleteClose}
              sx={{
                color: '#d32f2f',
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              sx={{
                bgcolor: '#14523D',
                '&:hover': { bgcolor: '#062b14' },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
