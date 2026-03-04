import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Container, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth, EmojiEvents, People, Schedule, ArrowForward } from '@mui/icons-material';
import { getEvents } from '../services/api';
import EventCard from '../components/EventCard';

const STATS = [
  { n: '20+', l: 'Events', icon: <CalendarMonth sx={{ fontSize: 20, color: '#2c3e7a' }} /> },
  { n: '₹5L', l: 'Prize Pool', icon: <EmojiEvents sx={{ fontSize: 20, color: '#b45309' }} /> },
  { n: '500+', l: 'Students', icon: <People sx={{ fontSize: 20, color: '#15803d' }} /> },
  { n: '3 Days', l: 'Duration', icon: <Schedule sx={{ fontSize: 20, color: '#be185d' }} /> },
];

const PEEK = [
  { cat: 'Tech', name: '24hr Hackathon: Code for Change', meta: '14 Mar · CS Lab · ₹1,00,000', pct: 62, c: '#1d4ed8', icon: '💻' },
  { cat: 'Music', name: 'Battle of Bands', meta: '15 Mar · Auditorium · ₹50,000', pct: 70, c: '#be185d', icon: '🎵' },
  { cat: 'Dance', name: 'Western Dance Showdown', meta: '15 Mar · Cultural Hall · ₹30,000', pct: 60, c: '#7c3aed', icon: '💃' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => { getEvents().then(r => setEvents(r.data.slice(0, 6))).catch(() => {}); }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(180deg, #f0eef8 0%, #f5f3ef 100%)',
        pt: { xs: 4, sm: 6, md: 10 }, pb: { xs: 4, sm: 6, md: 8 },
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative icon — top-right corner */}
        <Box sx={{
          position: 'absolute', top: { xs: 12, md: 24 }, right: { xs: 12, md: 40 },
          fontSize: { xs: '2rem', md: '2.8rem' }, opacity: 0.12, pointerEvents: 'none'
        }}>🎪</Box>

        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, gap: { xs: 4, md: 8 }, alignItems: 'center' }}>
            <Box>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: { xs: 1.5, sm: 2 }, py: 0.8,
                borderRadius: '99px', background: 'rgba(44,62,122,0.08)', mb: { xs: 2, md: 3 }
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#2c3e7a', animation: 'pulse 2s infinite',
                  '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } }
                }} />
                <Typography sx={{
                  fontSize: { xs: '0.68rem', sm: '0.78rem' }, fontWeight: 600,
                  letterSpacing: '.06em', textTransform: 'uppercase', color: '#2c3e7a'
                }}>
                  {isMobile ? 'March 14–16, 2026' : 'Annual College Fest · March 14–16, 2026'}
                </Typography>
              </Box>
              <Typography variant="h1" sx={{
                fontFamily: '"Fraunces", serif',
                fontSize: { xs: '2rem', sm: '2.6rem', md: '3.6rem' },
                fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em', color: '#1a1815',
                mb: { xs: 1.5, md: 2.5 }
              }}>
                Where talent{' '}
                <Box component="br" sx={{ display: { xs: 'none', md: 'block' } }} />
                finds its{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #2c3e7a, #7886C7)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontStyle: 'italic'
                }}>stage</Box>
              </Typography>
              <Typography sx={{
                fontSize: { xs: '0.88rem', sm: '0.95rem', md: '1rem' },
                color: '#5a5550', lineHeight: 1.8, mb: { xs: 3, md: 4 }, maxWidth: 460
              }}>
                Three days of competitions, creativity, and community. Join as a participant to compete, or as a volunteer to make it all happen.
              </Typography>
              <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap', mb: { xs: 3, md: 5 } }}>
                <Button variant="contained" onClick={() => navigate('/events')} sx={{
                  px: { xs: 2.5, sm: 3.5 }, py: { xs: 1.1, sm: 1.4 },
                  fontSize: { xs: '0.82rem', sm: '0.9rem' },
                  background: 'linear-gradient(135deg, #2c3e7a 0%, #3d52a8 100%)',
                  borderRadius: '10px', fontWeight: 600, textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(135deg, #1a2c5e 0%, #2c3e7a 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(44,62,122,.25)' }
                }}>
                  Browse Events
                </Button>
                <Button variant="outlined" onClick={() => navigate('/register')} sx={{
                  px: { xs: 2.5, sm: 3.5 }, py: { xs: 1.1, sm: 1.4 },
                  fontSize: { xs: '0.82rem', sm: '0.9rem' },
                  borderColor: '#d8d4ce', borderWidth: 1.5, color: '#1a1815',
                  borderRadius: '10px', fontWeight: 600, textTransform: 'none',
                  '&:hover': { borderColor: '#2c3e7a', color: '#2c3e7a', background: 'transparent', transform: 'translateY(-1px)' }
                }}>
                  Create Account
                </Button>
              </Box>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {STATS.map(s => (
                  <Grid item xs={6} sm={3} key={s.l}>
                    <Box sx={{
                      p: { xs: 1.5, sm: 2.5 }, background: '#fff', borderRadius: '12px',
                      border: '1px solid #e8e5e0', textAlign: 'center', transition: 'all .2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }
                    }}>
                      <Box sx={{ mb: 0.5 }}>{s.icon}</Box>
                      <Typography sx={{
                        fontFamily: '"Fraunces", serif',
                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                        fontWeight: 700, color: '#1a1815', lineHeight: 1
                      }}>{s.n}</Typography>
                      <Typography sx={{ fontSize: { xs: '0.66rem', sm: '0.74rem' }, color: '#9a958f', fontWeight: 500, mt: 0.5 }}>{s.l}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* PEEK cards — desktop only */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2 }}>
              {PEEK.map((item, i) => (
                <Box key={i} sx={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
                  p: '18px 22px', boxShadow: '0 2px 8px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)',
                  transition: 'all 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.1)' }
                }}>
                  {/* Icon in top-right corner */}
                  <Box sx={{
                    position: 'absolute', top: 12, right: 14,
                    width: 28, height: 28, borderRadius: '8px',
                    background: `${item.c}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}>{item.icon}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: item.c }}>{item.cat}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#1a1815', mb: 0.5, pr: 4 }}>{item.name}</Typography>
                  <Typography sx={{ fontSize: '0.76rem', color: '#9a958f', mb: 1.5 }}>{item.meta}</Typography>
                  <Box sx={{ height: 4, background: '#f0eef2', borderRadius: 99, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.c}, ${item.c}88)`, borderRadius: 99, transition: 'width 1s ease' }} />
                  </Box>
                </Box>
              ))}
            </Box>

            {/* PEEK cards — mobile (horizontal scroll) */}
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              gap: 1.5, overflow: 'auto', mx: -2, px: 2, pb: 1,
              scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': { display: 'none' }
            }}>
              {PEEK.map((item, i) => (
                <Box key={i} sx={{
                  minWidth: 220, background: '#fff', borderRadius: '12px', border: '1px solid #e8e5e0',
                  p: '14px 16px', scrollSnapAlign: 'start', flexShrink: 0, position: 'relative'
                }}>
                  <Box sx={{
                    position: 'absolute', top: 10, right: 10,
                    width: 24, height: 24, borderRadius: '6px',
                    background: `${item.c}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem'
                  }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: item.c, mb: 0.5 }}>{item.cat}</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1815', mb: 0.5, pr: 3 }}>{item.name}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#9a958f', mb: 1 }}>{item.meta}</Typography>
                  <Box sx={{ height: 3, background: '#f0eef2', borderRadius: 99, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.c}, ${item.c}88)`, borderRadius: 99 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Events */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, flex: 1 }}>
        <Box sx={{
          display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between', mb: { xs: 2.5, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' }, gap: 1, position: 'relative'
        }}>
          {/* Decorative icon top-right */}
          <Box sx={{
            position: 'absolute', top: -4, right: 0,
            display: { xs: 'none', sm: 'block' }, fontSize: '1.4rem', opacity: 0.1
          }}>⭐</Box>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9a958f', mb: 0.5 }}>
              Explore
            </Typography>
            <Typography sx={{
              fontFamily: '"Fraunces", serif',
              fontSize: { xs: '1.3rem', sm: '1.6rem' },
              fontWeight: 700, color: '#1a1815', letterSpacing: '-0.01em'
            }}>
              Featured Events
            </Typography>
          </Box>
          <Button endIcon={<ArrowForward sx={{ fontSize: '14px !important' }} />}
            onClick={() => navigate('/events')} sx={{
            fontSize: '0.82rem', color: '#2c3e7a', fontWeight: 600,
            textTransform: 'none', borderRadius: '8px', px: 1.5,
            '&:hover': { background: '#e8ebf5', transform: 'none' }
          }}>
            View all
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {events.map(e => (
            <Grid item xs={12} sm={6} md={4} key={e.event_id}>
              <EventCard event={e} showActions={false} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{
        borderTop: '1px solid #e8e5e0', py: { xs: 3, md: 4 },
        textAlign: 'center', background: '#fff'
      }}>
        <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.78rem' }, color: '#9a958f' }}>
          © 2026 FestZone · College Fest Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
