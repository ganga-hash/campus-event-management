import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid, Chip, Container, TextField, InputAdornment, useMediaQuery } from '@mui/material';
import { Search, FilterList, CalendarMonth } from '@mui/icons-material';
import { getEvents } from '../services/api';
import EventCard from '../components/EventCard';

const CATS = ['All', 'Tech', 'Music', 'Dance', 'Art', 'Sports', 'Drama', 'Literary', 'Photography'];

const CAT_ICONS = {
  All: '🎪', Tech: '💻', Music: '🎵', Dance: '💃', Art: '🎨',
  Sports: '⚽', Drama: '🎭', Literary: '📚', Photography: '📸'
};

const SORT_OPTIONS = ['Default', 'Date', 'Name', 'Spots Left'];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Default');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    getEvents().then(r => setEvents(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  let filtered = events
    .filter(e => activeCat === 'All' || e.category_name === activeCat)
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase()));

  if (sort === 'Date') filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === 'Name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'Spots Left') filtered = [...filtered].sort((a, b) => ((b.max_participants - (b.current_participants || 0)) - (a.max_participants - (a.current_participants || 0))));

  return (
    <Box sx={{ minHeight: '100vh', background: '#faf9f6' }}>
      {/* Header Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a1815 0%, #2c3e7a 60%, #3d52a8 100%)',
        pt: { xs: '36px', md: '56px' }, pb: { xs: '52px', md: '68px' }, mb: { xs: -5, md: -6 },
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        {/* Decorative corner icon */}
        <CalendarMonth sx={{
          position: 'absolute', top: { xs: 16, md: 24 }, right: { xs: 16, md: 40 },
          fontSize: { xs: 28, md: 40 }, color: 'rgba(255,255,255,0.08)'
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', mb: 1
          }}>
            FestZone 2026
          </Typography>
          <Typography sx={{
            fontFamily: '"Fraunces", serif', fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
            fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', mb: 1, lineHeight: 1.1
          }}>
            Find your competition
          </Typography>
          <Typography sx={{
            fontSize: { xs: '0.85rem', md: '0.95rem' }, color: 'rgba(255,255,255,0.5)',
            maxWidth: 500, lineHeight: 1.6
          }}>
            Browse through {events.length} events across {CATS.length - 1} categories.
            Register, volunteer, and make the most of FestZone.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: '72px' }}>
        {/* Search + Filter Bar */}
        <Box sx={{
          background: '#fff', borderRadius: '16px', border: '1px solid #e8e5e0',
          p: { xs: '14px', sm: '18px', md: '24px' }, mb: 4,
          boxShadow: '0 4px 6px rgba(0,0,0,.03), 0 12px 24px rgba(0,0,0,.06)',
        }}>
          <TextField
            placeholder="Search events by name or description..."
            size="small"
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: '#9a958f' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', background: '#faf9f6', fontSize: '0.88rem',
                '& fieldset': { borderColor: '#e8e5e0' },
                '&:hover fieldset': { borderColor: '#c0bdb7' },
                '&.Mui-focused fieldset': { borderColor: '#2c3e7a', borderWidth: '1.5px' },
              }
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FilterList sx={{ fontSize: 16, color: '#9a958f', mr: 0.5, display: { xs: 'none', sm: 'block' } }} />
            {CATS.map(c => (
              <Chip
                key={c}
                label={isMobile ? CAT_ICONS[c] : `${CAT_ICONS[c] || ''} ${c}`}
                onClick={() => setActiveCat(c)}
                variant={activeCat === c ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '99px', fontSize: isMobile ? '0.85rem' : '0.78rem', fontWeight: 500,
                  cursor: 'pointer', height: isMobile ? 36 : 34, transition: 'all .2s',
                  minWidth: isMobile ? 36 : 'auto',
                  ...(activeCat === c
                    ? { background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(44,62,122,.25)' }
                    : { borderColor: '#e8e5e0', color: '#5a5550', '&:hover': { borderColor: '#2c3e7a', color: '#2c3e7a', background: '#f4f3f8' } })
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Results count + Sort */}
        {!loading && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#9a958f' }}>
              Showing <strong style={{ color: '#1a1815' }}>{filtered.length}</strong> event{filtered.length !== 1 ? 's' : ''}
              {activeCat !== 'All' && <> in <strong style={{ color: '#2c3e7a' }}>{activeCat}</strong></>}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {SORT_OPTIONS.map(s => (
                <Chip key={s} label={s} size="small" onClick={() => setSort(s)}
                  sx={{
                    fontSize: '0.72rem', height: 26, cursor: 'pointer', fontWeight: 500,
                    ...(sort === s
                      ? { background: '#e8ebf5', color: '#2c3e7a', border: 'none' }
                      : { background: 'transparent', color: '#9a958f', border: '1px solid #e8e5e0', '&:hover': { borderColor: '#c0bdb7' } })
                  }} />
              ))}
            </Box>
          </Box>
        )}

        {/* Events Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#2c3e7a', mb: 2 }} />
            <Typography sx={{ fontSize: '0.85rem', color: '#9a958f' }}>Loading events...</Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {filtered.map(e => (
              <Grid item xs={12} sm={6} md={4} key={e.event_id}>
                <EventCard event={e} showActions={false} />
              </Grid>
            ))}
            {filtered.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{
                  textAlign: 'center', py: 10, px: 3,
                  background: '#fff', borderRadius: '16px', border: '1px solid #e8e5e0'
                }}>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1a1815', fontSize: '1.1rem', mb: '6px' }}>
                    No events found
                  </Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: '#9a958f' }}>
                    {search ? 'Try a different search term or ' : ''}
                    Try selecting a different category
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default EventsPage;
