import { Button } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { useRouter } from 'next/navigation';

export default function GoogleButton({ isSignUp = false }) {
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        router.push('/home');
      }
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleGoogleAuth}
      sx={{ mt: 2 }}
    >
      {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
    </Button>
  );
}