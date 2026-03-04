import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

const theme = createTheme({
  palette: {
    primary: { main: '#2c3e7a', light: '#e8ebf5' },
    secondary: { main: '#1a5c3a', light: '#e6f2ec' },
    background: { default: '#f5f3ef', paper: '#ffffff' },
    text: { primary: '#1a1815', secondary: '#5a5550' },
  },
  typography: {
    fontFamily: '"Instrument Sans", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 9, padding: '9px 22px', transition: 'all 0.2s ease', boxShadow: 'none', '&:hover': { boxShadow: 'none' } } } },
    MuiTextField: { defaultProps: { size: 'small' }, styleOverrides: { root: { '& .MuiOutlinedInput-root': { backgroundColor: '#faf9f7', borderRadius: '8px', '& fieldset': { borderColor: '#e5e2dc' }, '&:hover fieldset': { borderColor: '#9a958f' }, '&.Mui-focused fieldset': { borderColor: '#2c3e7a' } } } } },
    MuiTableHead: { styleOverrides: { root: { '& .MuiTableCell-head': { backgroundColor: '#faf9f7', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9a958f', borderBottom: '1px solid #e5e2dc' } } } },
    MuiTableCell: { styleOverrides: { root: { borderBottom: '1px solid #e5e2dc' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 99, fontWeight: 600 } } },
  },
});

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
