import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { School, AdminPanelSettings, Person } from '@mui/icons-material';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', background: '#faf9f7', fontSize: '0.88rem',
    '& fieldset': { borderColor: '#e8e5e0' },
    '&:hover fieldset': { borderColor: '#c0bdb7' },
    '&.Mui-focused fieldset': { borderColor: '#2c3e7a', borderWidth: '1.5px' },
  }
};

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: 'Computer Science', year: 2, role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        setError(err.response.data?.message || `Server error (${err.response.status})`);
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      {/* Left decorative panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1,
        background: 'linear-gradient(135deg, #1a1815 0%, #15803d 60%, #22804e 100%)',
        alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, px: 5 }}>
          <Typography sx={{ fontSize: '3rem', mb: 2 }}>🎓</Typography>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '2rem', fontWeight: 600, color: '#fff', mb: 1.5 }}>
            Join the Community
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 340 }}>
            Register to participate in events, volunteer for shifts, and be part of FestZone.
          </Typography>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 500px' }, display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 3, sm: 5 }, background: '#faf9f6'
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
          }}>
            <School sx={{ color: '#15803d', fontSize: 22 }} />
          </Box>

          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, color: '#1a1815', mb: '6px' }}>
            Join FestZone
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 4 }}>
            Create your free student account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', border: '1px solid #fecaca' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Register as</Typography>
              <ToggleButtonGroup
                value={form.role}
                exclusive
                onChange={(e, val) => val && setForm({ ...form, role: val })}
                fullWidth
                size="small"
                sx={{ borderRadius: '10px', '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.84rem', borderRadius: '10px', py: 1, '&.Mui-selected': { background: form.role === 'admin' ? 'linear-gradient(135deg, #2c3e7a, #3b4f9a)' : 'linear-gradient(135deg, #15803d, #22804e)', color: '#fff', '&:hover': { background: form.role === 'admin' ? 'linear-gradient(135deg, #243268, #324388)' : 'linear-gradient(135deg, #116932, #1a6b42)' } } } }}
              >
                <ToggleButton value="student"><Person sx={{ mr: 1, fontSize: 18 }} />Student</ToggleButton>
                <ToggleButton value="admin"><AdminPanelSettings sx={{ mr: 1, fontSize: 18 }} />Admin</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Full Name</Typography>
              <TextField size="small" fullWidth value={form.name} onChange={f('name')}
                placeholder="Aarav Sharma" required sx={inputSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>College Email</Typography>
              <TextField size="small" fullWidth type="email" value={form.email} onChange={f('email')}
                placeholder="aarav@college.edu" required sx={inputSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Password</Typography>
              <TextField size="small" fullWidth type="password" value={form.password} onChange={f('password')}
                placeholder="Create a password" required sx={inputSx} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Department</Typography>
                <TextField select size="small" fullWidth value={form.department} onChange={f('department')}
                  SelectProps={{ native: true }} sx={inputSx}>
                  {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'IT', 'Biotechnology'].map(d => <option key={d} value={d}>{d}</option>)}
                </TextField>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>Year</Typography>
                <TextField select size="small" fullWidth value={form.year} onChange={f('year')}
                  SelectProps={{ native: true }} sx={inputSx}>
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </TextField>
              </Box>
            </Box>
            <Button type="submit" fullWidth disabled={loading} sx={{
              py: 1.4, mt: 0.5, fontSize: '0.88rem', fontWeight: 600,
              background: 'linear-gradient(135deg, #15803d, #22804e)', color: '#fff',
              borderRadius: '10px', textTransform: 'none',
              boxShadow: '0 2px 8px rgba(21,128,61,.25)',
              '&:hover': { background: 'linear-gradient(135deg, #116932, #1a6b42)' },
              '&:disabled': { background: '#c0bdb7', color: '#fff' }
            }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </Box>

          <Typography sx={{ fontSize: '0.84rem', color: '#9a958f', textAlign: 'center', mt: 3.5 }}>
            Already have an account?{' '}
            <Box component={Link} to="/login" sx={{ color: '#2c3e7a', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
