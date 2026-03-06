import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Grid, Container, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth, EmojiEvents, People, Schedule, ArrowForward, MusicNote, Code, Brush, SportsSoccer, TheaterComedy, MenuBook, CameraAlt } from '@mui/icons-material';

/* ─── Scroll-triggered fade-in hook ─── */
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ─── Animated counter ─── */
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    const num = parseInt(end, 10) || 0;
    if (num === 0) { setCount(0); return; }
    const step = Math.ceil(num / (duration / 30));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const STATS = [
  { n: 20, suffix: '+', l: 'Events', icon: <CalendarMonth sx={{ fontSize: 22 }} />, color: '#2c3e7a' },
  { n: 5, suffix: 'L+', l: 'Prize Pool', icon: <EmojiEvents sx={{ fontSize: 22 }} />, color: '#b45309' },
  { n: 500, suffix: '+', l: 'Students', icon: <People sx={{ fontSize: 22 }} />, color: '#15803d' },
  { n: 3, suffix: ' Days', l: 'Duration', icon: <Schedule sx={{ fontSize: 22 }} />, color: '#be185d' },
];

const CATEGORIES = [
  { name: 'Music', icon: <MusicNote />, color: '#be185d', desc: 'Battle of bands, solo singing, DJ nights' },
  { name: 'Tech', icon: <Code />, color: '#1d4ed8', desc: 'Hackathons, coding, robotics challenges' },
  { name: 'Dance', icon: <EmojiEvents />, color: '#7c3aed', desc: 'Classical, western, group performances' },
  { name: 'Art', icon: <Brush />, color: '#b45309', desc: 'Painting, sculpture, digital art contests' },
  { name: 'Sports', icon: <SportsSoccer />, color: '#15803d', desc: 'Futsal, chess, table tennis tournaments' },
  { name: 'Drama', icon: <TheaterComedy />, color: '#b91c1c', desc: 'Street play, mono act, skit performances' },
  { name: 'Literary', icon: <MenuBook />, color: '#0e7490', desc: 'Debate, quiz, creative writing events' },
  { name: 'Photography', icon: <CameraAlt />, color: '#6b21a8', desc: 'Portrait, landscape, street photo walks' },
];

const TIMELINE = [
  { day: 'Day 1 · March 14', events: ['24hr Hackathon Kickoff', 'Photo Walk', 'Futsal Tournament', 'Chess Championship', 'Parliamentary Debate', 'Digital Art Contest'] },
  { day: 'Day 2 · March 15', events: ['Battle of Bands', 'Western Dance Showdown', 'Competitive Coding', 'Table Tennis', 'Quizmania', 'Mono Act', 'Group Dance Battle'] },
  { day: 'Day 3 · March 16', events: ['Solo Singing Finals', 'Classical Dance Recital', 'Robotics Rumble', 'Nukkad Natak', 'Creative Writing', 'Neon Nights DJ Festival'] },
];

/* ─── Reveal wrapper ─── */
const Reveal = ({ children, delay = 0, direction = 'up' }) => {
  const [ref, visible] = useScrollReveal(0.1);
  const transforms = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(40px)', right: 'translateX(-40px)' };
  return (
    <Box ref={ref} sx={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0)' : transforms[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </Box>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

      {/* ═══════════ HERO ═══════════ */}
      <Box sx={{
        background: 'linear-gradient(180deg, #0f0d1a 0%, #1a1830 40%, #2c3e7a 100%)',
        pt: { xs: 6, sm: 8, md: 14 }, pb: { xs: 6, sm: 8, md: 12 },
        position: 'relative', overflow: 'hidden', color: '#fff'
      }}>
        {/* Animated background orbs */}
        <Box sx={{
          position: 'absolute', width: { xs: 300, md: 500 }, height: { xs: 300, md: 500 }, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,134,199,0.15) 0%, transparent 70%)',
          top: { xs: -100, md: -150 }, right: { xs: -100, md: -100 },
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.3s ease-out',
        }} />
        <Box sx={{
          position: 'absolute', width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 }, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190,24,93,0.1) 0%, transparent 70%)',
          bottom: { xs: -50, md: -100 }, left: { xs: -80, md: -50 },
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
          transition: 'transform 0.3s ease-out',
        }} />
        {/* Particle dots */}
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            {/* Status badge */}
            <Reveal delay={0}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 2.5, py: 0.8, borderRadius: '99px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)', mb: { xs: 3, md: 4 }
              }}>
                <Box sx={{
                  width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': { '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(74,222,128,.4)' }, '50%': { opacity: .7, boxShadow: '0 0 0 6px rgba(74,222,128,0)' } }
                }} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' }}>
                  Registrations Open · March 14–16, 2026
                </Typography>
              </Box>
            </Reveal>

            {/* Main heading */}
            <Reveal delay={0.15}>
              <Typography variant="h1" sx={{
                fontFamily: '"Fraunces", serif',
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.2rem' },
                fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em',
                mb: { xs: 2, md: 3 }
              }}>
                Where Talent Finds{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #7886C7, #c084fc, #f472b6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  fontStyle: 'italic',
                }}>
                  Its Stage
                </Box>
              </Typography>
            </Reveal>

            <Reveal delay={0.3}>
              <Typography sx={{
                fontSize: { xs: '0.95rem', md: '1.12rem' }, color: 'rgba(255,255,255,.55)',
                lineHeight: 1.8, mb: { xs: 3.5, md: 5 }, maxWidth: 560, mx: 'auto',
              }}>
                Three days of competitions, creativity, and community across music, tech, dance, art, and more. Compete, volunteer, or just vibe.
              </Typography>
            </Reveal>

            {/* CTA buttons */}
            <Reveal delay={0.45}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: { xs: 5, md: 7 } }}>
                <Button variant="contained" onClick={() => navigate('/events')} sx={{
                  px: { xs: 3, sm: 4 }, py: { xs: 1.3, sm: 1.6 },
                  fontSize: { xs: '0.88rem', sm: '0.95rem' },
                  background: 'linear-gradient(135deg, #fff 0%, #e8ebf5 100%)',
                  color: '#2c3e7a', borderRadius: '14px', fontWeight: 700, textTransform: 'none',
                  boxShadow: '0 4px 20px rgba(255,255,255,.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(255,255,255,.25)', background: '#fff' }
                }}>
                  Browse Events
                </Button>
                <Button variant="outlined" onClick={() => navigate('/register')} sx={{
                  px: { xs: 3, sm: 4 }, py: { xs: 1.3, sm: 1.6 },
                  fontSize: { xs: '0.88rem', sm: '0.95rem' },
                  borderColor: 'rgba(255,255,255,.2)', borderWidth: 1.5, color: '#fff',
                  borderRadius: '14px', fontWeight: 600, textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.06)', transform: 'translateY(-2px)' }
                }}>
                  Create Account <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                </Button>
              </Box>
            </Reveal>

            {/* Stats */}
            <Grid container spacing={2} justifyContent="center">
              {STATS.map((s, i) => (
                <Grid item xs={6} sm={3} key={s.l}>
                  <Reveal delay={0.5 + i * 0.1}>
                    <Box sx={{
                      p: { xs: 2, sm: 3 }, background: 'rgba(255,255,255,.05)',
                      borderRadius: '16px', border: '1px solid rgba(255,255,255,.08)',
                      backdropFilter: 'blur(10px)', textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': { background: 'rgba(255,255,255,.1)', transform: 'translateY(-4px)', borderColor: 'rgba(255,255,255,.15)' }
                    }}>
                      <Box sx={{ color: s.color, mb: 1, opacity: 0.9, filter: 'brightness(1.4)' }}>{s.icon}</Box>
                      <Typography sx={{
                        fontFamily: '"Fraunces", serif',
                        fontSize: { xs: '1.4rem', sm: '2rem' },
                        fontWeight: 700, lineHeight: 1
                      }}>
                        <Counter end={s.n} suffix={s.suffix} />
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.45)', fontWeight: 500, mt: 0.5 }}>{s.l}</Typography>
                    </Box>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {/* Wave divider */}
        <Box sx={{
          position: 'absolute', bottom: -2, left: 0, right: 0, height: { xs: 40, md: 70 },
          background: '#faf9f6',
          clipPath: 'ellipse(55% 100% at 50% 100%)',
        }} />
      </Box>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <Box sx={{ background: '#faf9f6', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Reveal>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9a958f', mb: 1 }}>
                Categories
              </Typography>
              <Typography sx={{
                fontFamily: '"Fraunces", serif', fontSize: { xs: '1.6rem', md: '2.2rem' },
                fontWeight: 700, color: '#1a1815', letterSpacing: '-0.02em'
              }}>
                Something for Everyone
              </Typography>
            </Box>
          </Reveal>
          <Grid container spacing={2}>
            {CATEGORIES.map((cat, i) => (
              <Grid item xs={6} sm={4} md={3} key={cat.name}>
                <Reveal delay={i * 0.06}>
                  <Box onClick={() => navigate('/events')} sx={{
                    p: { xs: 2.5, sm: 3 }, background: '#fff', borderRadius: '16px',
                    border: '1px solid #e8e5e0', cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(.25,.8,.25,1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 12px 32px ${cat.color}18`,
                      borderColor: `${cat.color}40`,
                      '& .cat-icon': { background: cat.color, color: '#fff', transform: 'scale(1.1) rotate(5deg)' },
                    }
                  }}>
                    <Box className="cat-icon" sx={{
                      width: 44, height: 44, borderRadius: '12px',
                      background: `${cat.color}12`, color: cat.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
                      transition: 'all 0.35s ease', fontSize: 22,
                    }}>
                      {cat.icon}
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#1a1815', mb: 0.5 }}>{cat.name}</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#9a958f', lineHeight: 1.5 }}>{cat.desc}</Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ TIMELINE ═══════════ */}
      <Box sx={{ background: '#fff', py: { xs: 6, sm: 8, md: 10 }, position: 'relative' }}>
        <Container maxWidth="md">
          <Reveal>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9a958f', mb: 1 }}>
                Schedule
              </Typography>
              <Typography sx={{
                fontFamily: '"Fraunces", serif', fontSize: { xs: '1.6rem', md: '2.2rem' },
                fontWeight: 700, color: '#1a1815', letterSpacing: '-0.02em'
              }}>
                Three Days of Action
              </Typography>
            </Box>
          </Reveal>

          <Box sx={{ position: 'relative' }}>
            {/* Vertical line */}
            <Box sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg, #e8e5e0, #2c3e7a, #e8e5e0)',
              transform: 'translateX(-50%)'
            }} />

            {TIMELINE.map((day, i) => (
              <Reveal key={day.day} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
                <Box sx={{
                  display: 'flex', mb: 4,
                  flexDirection: { xs: 'column', md: i % 2 === 0 ? 'row' : 'row-reverse' },
                  alignItems: { md: 'center' }, gap: { xs: 0, md: 4 },
                }}>
                  <Box sx={{ flex: 1, textAlign: { xs: 'left', md: i % 2 === 0 ? 'right' : 'left' } }}>
                    <Box sx={{
                      display: 'inline-block', p: '20px 24px', background: '#faf9f6',
                      borderRadius: '16px', border: '1px solid #e8e5e0',
                      transition: 'all 0.3s ease', width: { xs: '100%', md: 'auto' },
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,.06)', borderColor: '#d0cdc7' }
                    }}>
                      <Typography sx={{
                        fontFamily: '"Fraunces", serif', fontSize: '1rem', fontWeight: 700,
                        color: '#2c3e7a', mb: 1.5,
                      }}>
                        {day.day}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {day.events.map(ev => (
                          <Box key={ev} sx={{
                            px: '10px', py: '5px', borderRadius: '8px',
                            background: '#fff', border: '1px solid #e8e5e0',
                            fontSize: '0.74rem', fontWeight: 500, color: '#5a5550',
                            transition: 'all 0.2s',
                            '&:hover': { background: '#e8ebf5', color: '#2c3e7a', borderColor: '#2c3e7a40' }
                          }}>
                            {ev}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  {/* Center dot */}
                  <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    background: '#2c3e7a', border: '3px solid #fff',
                    boxShadow: '0 0 0 3px #e8ebf5',
                  }} />
                  <Box sx={{ flex: 1 }} />
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a1815 0%, #2c3e7a 100%)',
        py: { xs: 6, sm: 8, md: 10 }, position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>🚀</Typography>
              <Typography sx={{
                fontFamily: '"Fraunces", serif',
                fontSize: { xs: '1.6rem', md: '2.4rem' },
                fontWeight: 700, color: '#fff', mb: 2, letterSpacing: '-0.02em'
              }}>
                Ready to Be Part of FestZone?
              </Typography>
              <Typography sx={{
                fontSize: '1rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.8,
                mb: { xs: 3.5, md: 5 }, maxWidth: 480, mx: 'auto'
              }}>
                Register now to participate in events, volunteer for shifts, and be part of the biggest college fest of 2026.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button onClick={() => navigate('/register')} sx={{
                  px: 4, py: 1.5, fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #fff, #e8ebf5)', color: '#2c3e7a',
                  borderRadius: '14px', fontWeight: 700, textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(255,255,255,.2)', background: '#fff' }
                }}>
                  Register Now <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                </Button>
                <Button onClick={() => navigate('/events')} sx={{
                  px: 4, py: 1.5, fontSize: '0.95rem',
                  border: '1.5px solid rgba(255,255,255,.2)', color: '#fff',
                  borderRadius: '14px', fontWeight: 600, textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.06)', transform: 'translateY(-2px)' }
                }}>
                  Explore Events
                </Button>
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>

      {/* ═══════════ FOOTER ═══════════ */}
      <Box sx={{
        borderTop: '1px solid #e8e5e0', py: { xs: 3, md: 4 },
        textAlign: 'center', background: '#faf9f6'
      }}>
        <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.78rem' }, color: '#9a958f' }}>
          © 2026 FestZone · College Fest Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
