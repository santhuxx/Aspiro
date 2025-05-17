'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Fade,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SideMenu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { text: 'My Courses', path: '/courses', icon: <SchoolIcon /> },
    { text: 'My Skills', path: '/skills', icon: <BuildIcon /> },
    { text: 'My Learning Journal', path: '/task', icon: <AssignmentIcon /> },
    { text: 'My Progress', path: '/progress', icon: <TrendingUpIcon /> },
  ];

  const handleNavigation = (path) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Menu Button */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          top: { xs: 70, sm: 80 }, // Adjust for Navbar height
          left: 20,
          bgcolor: '#14523D',
          color: 'white',
          borderRadius: '50%',
          p: 1.5,
          zIndex: 1000,
          '&:hover': { bgcolor: '#062b14' },
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '90%', sm: 280 },
            maxWidth: 280,
            bgcolor: '#14523D', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0 8px 8px 0',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            color: 'white',
            p: 2,
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Fade in key={index} timeout={300 + index * 100}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      py: 1.5,
                      mx: 1,
                      borderRadius: 2,
                      bgcolor: isActive ? 'rgba(98, 243, 197, 0.2)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(98, 243, 197, 0.3)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? '#62f3c5' : 'white', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 'bold' : 'medium',
                        color: isActive ? '#62f3c5' : 'white',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Fade>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default SideMenu;

