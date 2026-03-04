import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? {
      primary: { main: '#2D336B', light: '#7886C7', dark: '#1a1f40' },
      secondary: { main: '#7886C7' },
      background: { default: '#FFF2F2', paper: '#ffffff' },
      text: { primary: '#2D336B', secondary: '#7886C7' },
    } : {
      primary: { main: '#7886C7', light: '#a5b0e0', dark: '#4a5ab3' },
      secondary: { main: '#2D336B' },
      background: { default: '#0d0f1a', paper: '#1a1d2e' },
      text: { primary: '#e8eaf6', secondary: '#9fa8da' },
    }),
  },
  typography: {
    fontFamily: '"Poppins", "Nunito", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },
  },
});
