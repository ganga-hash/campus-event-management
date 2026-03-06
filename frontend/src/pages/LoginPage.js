import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', background: '#faf9f7', fontSize: '0.88rem',
    '& fieldset': { borderColor: '#e8e5e0' },
    '&:hover fieldset': { borderColor: '#c0bdb7' },
    '&.Mui-focused fieldset': { borderColor: '#2c3e7a', borderWidth: '1.5px' },
  }
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data?.message || `Server error (${err.response.status})`);
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left decorative panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1,
        background: 'linear-gradient(135deg, #1a1815 0%, #2c3e7a 60%, #3d52a8 100%)',
        alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, px: 5 }}>
          <Typography sx={{ fontSize: '3rem', mb: 2 }}>🎉</Typography>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '2rem', fontWeight: 600, color: '#fff', mb: 1.5 }}>
            Welcome to FestZone
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 340 }}>
            Your one-stop platform for college fest events, registrations, and volunteering.
          </Typography>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 480px' }, display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 3, sm: 5 }, background: '#faf9f6'
      }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, color: '#1a1815', mb: '6px' }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 4 }}>
            Sign in to your FestZone account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', border: '1px solid #fecaca' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Email</Typography>
              <TextField type="email" size="small" fullWidth value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@college.edu" required sx={inputSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Password</Typography>
              <TextField type="password" size="small" fullWidth value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required sx={inputSx} />
            </Box>
            <Button type="submit" fullWidth disabled={loading} sx={{
              py: 1.4, mt: 0.5, fontSize: '0.88rem', fontWeight: 600,
              background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', color: '#fff',
              borderRadius: '10px', textTransform: 'none',
              boxShadow: '0 2px 8px rgba(44,62,122,.25)',
              '&:hover': { background: 'linear-gradient(135deg, #243368, #354897)' },
              '&:disabled': { background: '#c0bdb7', color: '#fff' }
            }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          <Typography sx={{ fontSize: '0.84rem', color: '#9a958f', textAlign: 'center', mt: 3.5 }}>
            New here?{' '}
            <Box component={Link} to="/register" sx={{ color: '#2c3e7a', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Create account
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
