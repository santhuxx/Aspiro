'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loading } = useAuth();
  const menuItems = ['Home', 'Institutes', 'Courses', 'Jobs', 'About Us', 'Contact Us'];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNavigation = (item) => {
    const path = item.toLowerCase().replace(/\s+/g, '');
    router.push(`/${path}`);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    handleProfileMenuClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
    handleProfileMenuClose();
  };

  const drawerContent = (
    <List sx={{ width: 250, backgroundColor: '#1A4538', height: '100%' }}>
      {menuItems.map((item, index) => {
        const itemPath = `/${item.toLowerCase().replace(/\s+/g, '')}`;
        const isActive = pathname === itemPath;
        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item)}
              sx={{
                backgroundColor: isActive ? 'rgba(98, 243, 197, 0.2)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(98, 243, 197, 0.3)' },
              }}
            >
              <ListItemText
                primary={item}
                sx={{
                  color: isActive ? '#62f3c5' : 'white',
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
      {currentUser ? (
        <>
          <Divider sx={{ backgroundColor: 'white' }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleProfileClick}>
              <Avatar
                src={currentUser.photoURL || '/default-avatar.png'}
                alt={currentUser.displayName || 'User'}
                sx={{ width: 24, height: 24, mr: 2 }}
              />
              <ListItemText primary="Profile" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('Login')}>
              <ListItemText primary="Login" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('Sign Up')}>
              <ListItemText primary="Sign Up" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#133429' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Side - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Image src="/images/logo.png" alt="Logo" width={150} height={50} priority />
        </Box>

        {/* Center - Navigation Links (Hidden on Small Screens) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexGrow: 1,
            justifyContent: 'center',
            gap: 3,
          }}
        >
          {menuItems.map((item, index) => {
            const itemPath = `/${item.toLowerCase().replace(/\s+/g, '')}`;
            const isActive = pathname === itemPath;
            return (
              <Button
                key={index}
                onClick={() => handleNavigation(item)}
                sx={{
                  color: isActive ? '#62f3c5' : 'white',
                  fontSize: '16px',
                  textDecoration: isActive ? 'bold' : 'none',
                  '&:hover': {
                    color: '#62f3c5',
                    textDecoration: isActive ? 'bold' : 'none',
                  },
                }}
              >
                {item}
              </Button>
            );
          })}
        </Box>

        {/* Right Side - Profile/Login Buttons and Mobile Menu Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {!loading && !currentUser ? (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#14523D',
                    '&:hover': { backgroundColor: '#062b14' },
                  }}
                  onClick={() => router.push('/signin')}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { backgroundColor: '#14523D' },
                  }}
                  onClick={() => router.push('/signup')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <IconButton sx={{ color: 'white' }} onClick={handleProfileMenuOpen}>
                <Avatar
                  src={currentUser?.photoURL || '/default-avatar.png'}
                  alt={currentUser?.displayName || 'User'}
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {drawerContent}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

