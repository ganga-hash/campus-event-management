import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, IconButton, Avatar, Menu, MenuItem, Divider, useMediaQuery } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');
  const handleLogout = () => { logoutUser(); navigate('/'); setAnchor(null); };
  const isActive = (path) => location.pathname === path;

  const linkSx = (path) => ({
    color: isActive(path) ? '#2c3e7a' : '#5a5550',
    fontWeight: isActive(path) ? 600 : 500,
    fontSize: '0.85rem',
    px: 2,
    py: 0.8,
    borderRadius: '8px',
    position: 'relative',
    '&:hover': { background: '#e8ebf5', color: '#2c3e7a', transform: 'none' },
    '&::after': isActive(path) ? {
      content: '""', position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
      width: 20, height: 2, borderRadius: 1, background: '#2c3e7a'
    } : {}
  });

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #e8e5e0',
      color: '#1a1815'
    }}>
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 1.5, sm: 2, md: 4 }, minHeight: { xs: '54px !important', sm: '60px !important' }, gap: 1 }}>
        <Typography component={Link} to="/" sx={{
          fontFamily: '"Fraunces", serif', fontSize: { xs: '1.15rem', sm: '1.3rem' }, fontWeight: 700,
          color: '#2c3e7a', textDecoration: 'none', flexGrow: 1, letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: 1,
          '& span': { fontWeight: 300, fontStyle: 'italic', color: '#7886C7' }
        }}>
          Fest<span>Zone</span>
        </Typography>

        {isMobile ? (
          <>
            <IconButton onClick={e => setMobileMenu(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={mobileMenu} open={Boolean(mobileMenu)} onClose={() => setMobileMenu(null)}
              PaperProps={{ sx: { borderRadius: '14px', border: '1px solid #e8e5e0', boxShadow: '0 8px 32px rgba(0,0,0,.12)', mt: 1, minWidth: 200, p: '4px' } }}>
              <MenuItem onClick={() => { navigate('/events'); setMobileMenu(null); }} sx={{ borderRadius: '8px', fontSize: '0.88rem', py: 1.2 }}>📅  Events</MenuItem>
              {user && !isAdmin && <MenuItem onClick={() => { navigate('/dashboard'); setMobileMenu(null); }} sx={{ borderRadius: '8px', fontSize: '0.88rem', py: 1.2 }}>🎫  Dashboard</MenuItem>}
              {user && isAdmin && <MenuItem onClick={() => { navigate('/admin'); setMobileMenu(null); }} sx={{ borderRadius: '8px', fontSize: '0.88rem', py: 1.2 }}>⚙️  Admin Panel</MenuItem>}
              {!user && <MenuItem onClick={() => { navigate('/login'); setMobileMenu(null); }} sx={{ borderRadius: '8px', fontSize: '0.88rem', py: 1.2 }}>🔐  Sign in</MenuItem>}
              {!user && <MenuItem onClick={() => { navigate('/register'); setMobileMenu(null); }} sx={{ borderRadius: '8px', fontSize: '0.88rem', py: 1.2 }}>✨  Register</MenuItem>}
              {user && <Divider sx={{ my: 0.5 }} />}
              {user && <MenuItem onClick={() => { handleLogout(); setMobileMenu(null); }} sx={{ borderRadius: '8px', color: '#b91c1c', fontSize: '0.88rem', py: 1.2 }}>↩  Sign out</MenuItem>}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button component={Link} to="/events" sx={linkSx('/events')}>Events</Button>
            {user ? (
              <>
                {!isAdmin && <Button component={Link} to="/dashboard" sx={linkSx('/dashboard')}>Dashboard</Button>}
                {isAdmin && <Button component={Link} to="/admin" sx={linkSx('/admin')}>Admin</Button>}
                <Box sx={{ ml: 1, height: 24, width: '1px', background: '#e8e5e0' }} />
                <IconButton onClick={e => setAnchor(e.currentTarget)} sx={{ ml: 0.5 }}>
                  <Avatar sx={{
                    width: 34, height: 34, bgcolor: '#e8ebf5', color: '#2c3e7a',
                    fontSize: '0.85rem', fontWeight: 700, fontFamily: '"Fraunces", serif',
                    border: '2px solid #d8daf0', transition: 'all 0.2s',
                    '&:hover': { borderColor: '#2c3e7a' }
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
                  PaperProps={{ sx: { borderRadius: '12px', border: '1px solid #e8e5e0', boxShadow: '0 8px 32px rgba(0,0,0,.08)', mt: 1.5, minWidth: 200 } }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                  <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1815' }}>{user.name}</Typography>
                    <Typography sx={{ fontSize: '0.76rem', color: '#9a958f', mt: 0.3 }}>{user.email}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: '#e8e5e0' }} />
                  <MenuItem onClick={() => { navigate(isAdmin ? '/admin' : '/dashboard'); setAnchor(null); }}
                    sx={{ fontSize: '0.85rem', py: 1.2, px: 2.5 }}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ fontSize: '0.85rem', color: '#b91c1c', py: 1.2, px: 2.5 }}>
                    Sign out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={linkSx('/login')}>Sign in</Button>
                <Button component={Link} to="/register" sx={{
                  background: 'linear-gradient(135deg, #2c3e7a 0%, #3d52a8 100%)',
                  color: '#fff', fontSize: '0.85rem', fontWeight: 600, px: 2.5, py: 0.8,
                  borderRadius: '8px', ml: 1,
                  '&:hover': { background: 'linear-gradient(135deg, #1a2c5e 0%, #2c3e7a 100%)', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(44,62,122,.3)' }
                }}>
                  Get Started
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
