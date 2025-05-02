import { AuthProvider } from '../context/AuthContext';
import { Box, CssBaseline } from '@mui/material';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {children}
          </Box>
        </AuthProvider>
      </body>
    </html>
  );
}