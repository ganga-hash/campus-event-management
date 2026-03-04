import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, CircularProgress, Alert, LinearProgress, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Container, useMediaQuery } from '@mui/material';
import { CalendarMonth, LocationOn, EmojiEvents, ArrowBack, People, AccessTime, Category } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent, applyVolunteer } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CAT_COLORS = { Music: '#be185d', Dance: '#7c3aed', Tech: '#1d4ed8', Art: '#b45309', Sports: '#15803d', Drama: '#b91c1c', Literary: '#0e7490', Photography: '#6b21a8', General: '#2c3e7a' };
const CAT_ICONS = { Music: '🎵', Dance: '💃', Tech: '💻', Art: '🎨', Sports: '⚽', Drama: '🎭', Literary: '📖', Photography: '📷', General: '🎪' };

const STATUS_STYLES = {
  upcoming: { bg: '#e8ebf5', color: '#2c3e7a', label: 'Upcoming' },
  ongoing: { bg: '#dcfce7', color: '#15803d', label: 'Ongoing' },
  completed: { bg: '#f3f4f6', color: '#6b7280', label: 'Completed' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
};

const InfoCard = ({ icon: Icon, label, value, color }) => (
  <Box sx={{
    background: '#faf9f7', borderRadius: '12px', border: '1px solid #e8e5e0',
    p: { xs: '12px 14px', sm: '16px 18px' }, display: 'flex', alignItems: 'flex-start', gap: { xs: '10px', sm: '12px' },
    transition: 'all .2s', position: 'relative', overflow: 'hidden',
    '&:hover': { background: '#f5f3ef', borderColor: '#d0cdc7' }
  }}>
    {/* Icon in top-left */}
    <Box sx={{
      width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, borderRadius: '10px',
      background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon sx={{ fontSize: { xs: 16, sm: 18 }, color }} />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.66rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9a958f', mb: '3px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: { xs: '0.82rem', sm: '0.88rem' }, fontWeight: 600, color: '#1a1815', wordBreak: 'break-word' }}>{value}</Typography>
    </Box>
  </Box>
);

const EventDetail = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [roleModal, setRoleModal] = useState(false);
  const [volForm, setVolForm] = useState({ role: 'Any / Flexible', availability: 'All 3 Days', skills: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    getEventById(id).then(r => setEvent(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleParticipate = async () => {
    try {
      const res = await registerForEvent(event.event_id);
      setIsRegistered(true);
      // Update event state with new participant count
      setEvent(prev => ({
        ...prev,
        current_participants: res.data.current_participants ?? (prev.current_participants + 1)
      }));
      showAlert('success', `Registered for ${event.name}!`);
    } catch (err) { showAlert('error', err.response?.data?.message || 'Registration failed'); }
  };

  const handleVolunteer = async () => {
    try {
      await applyVolunteer({ event_id: event.event_id, role: volForm.role, availability: volForm.availability, skills: volForm.skills });
      setIsVolunteer(true); setRoleModal(false);
      showAlert('success', `Volunteer application submitted for ${event.name}!`);
    } catch (err) { showAlert('error', err.response?.data?.message || 'Application failed'); setRoleModal(false); }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
      <CircularProgress sx={{ color: '#2c3e7a', mb: 2 }} />
      <Typography sx={{ fontSize: '0.85rem', color: '#9a958f' }}>Loading event details...</Typography>
    </Box>
  );

  if (!event) return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Typography sx={{ fontSize: '3rem', mb: 2 }}>😕</Typography>
      <Typography sx={{ fontWeight: 600, color: '#1a1815', mb: 1 }}>Event not found</Typography>
      <Button onClick={() => navigate('/events')} sx={{ color: '#2c3e7a' }}>Back to Events</Button>
    </Box>
  );

  const c = CAT_COLORS[event.category_name] || '#2c3e7a';
  const catIcon = CAT_ICONS[event.category_name] || '🎪';
  const filled = event.current_participants || 0;
  const cap = event.max_participants;
  const full = filled >= cap;
  const pct = Math.min((filled / cap) * 100, 100);
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.upcoming;

  return (
    <Box sx={{ minHeight: '100vh', background: '#faf9f6' }}>
      {/* Hero header */}
      <Box sx={{
        background: `linear-gradient(135deg, ${c}12 0%, #faf9f6 100%)`,
        pt: { xs: '24px', md: '48px' }, pb: { xs: '20px', md: '32px' },
        borderBottom: '1px solid #e8e5e0', position: 'relative', overflow: 'hidden'
      }}>
        {/* Category icon — top-right corner */}
        <Box sx={{
          position: 'absolute', top: { xs: 16, md: 28 }, right: { xs: 16, md: 60 },
          width: { xs: 44, md: 56 }, height: { xs: 44, md: 56 }, borderRadius: '14px',
          background: `${c}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: { xs: '1.3rem', md: '1.6rem' }, border: `1px solid ${c}15`
        }}>
          {catIcon}
        </Box>

        <Container maxWidth="md">
          <Button startIcon={<ArrowBack sx={{ fontSize: '16px !important' }} />} onClick={() => navigate('/events')}
            sx={{
              mb: { xs: 2, md: 3 }, color: '#5a5550', fontWeight: 500, fontSize: '0.82rem',
              p: '6px 12px', borderRadius: '8px', border: '1px solid #e8e5e0', background: '#fff',
              '&:hover': { background: '#f5f3ef', transform: 'none', borderColor: '#d0cdc7' }
            }}>
            Back
          </Button>

          {alert && (
            <Alert severity={alert.type} sx={{
              mb: 3, borderRadius: '12px', border: '1px solid',
              borderColor: alert.type === 'success' ? '#bbf7d0' : '#fecaca',
            }}>
              {alert.msg}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap', pr: { xs: 6, md: 8 } }}>
            <Chip label={event.category_name || 'General'} size="small" sx={{
              background: `${c}18`, color: c, fontWeight: 700, fontSize: '0.7rem',
              letterSpacing: '.08em', height: 24, borderRadius: '8px'
            }} />
            <Chip label={statusStyle.label} size="small" sx={{
              fontSize: '0.7rem', fontWeight: 600, height: 24, borderRadius: '8px',
              background: statusStyle.bg, color: statusStyle.color, border: 'none'
            }} />
            {event.prize_pool && event.prize_pool !== 'N/A' && (
              <Chip icon={<EmojiEvents sx={{ fontSize: '14px !important', color: `${c} !important` }} />}
                label={event.prize_pool} size="small" sx={{
                  height: 24, borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700,
                  background: '#fef3c720', color: c, border: `1px solid ${c}20`
                }} />
            )}
          </Box>

          <Typography sx={{
            fontFamily: '"Fraunces", serif', fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
            fontWeight: 600, color: '#1a1815', lineHeight: 1.15, letterSpacing: '-0.02em', mb: 1.5,
            pr: { xs: 0, md: 8 }
          }}>
            {event.name}
          </Typography>

          {event.description && (
            <Typography sx={{
              fontSize: { xs: '0.88rem', md: '0.95rem' }, color: '#5a5550',
              lineHeight: 1.8, maxWidth: 600
            }}>
              {event.description}
            </Typography>
          )}
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 2.5, md: 4 } }}>
        {/* Info grid */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
          gap: { xs: 1.5, sm: 2 }, mb: { xs: 3, md: 4 }
        }}>
          <InfoCard icon={CalendarMonth} label="Date" color={c}
            value={new Date(event.date).toLocaleDateString('en-IN', { weekday: isMobile ? undefined : 'short', day: 'numeric', month: 'short', year: 'numeric' })} />
          <InfoCard icon={AccessTime} label="Time" color={c}
            value={event.time ? String(event.time).slice(0, 5) : 'TBD'} />
          <InfoCard icon={LocationOn} label="Venue" color={c}
            value={event.venue || 'TBD'} />
          <InfoCard icon={EmojiEvents} label="Prize Pool" color="#b45309"
            value={event.prize_pool || 'Certificate'} />
          <InfoCard icon={Category} label="Category" color={c}
            value={event.category_name || 'General'} />
          <InfoCard icon={People} label="Capacity" color={c}
            value={`${cap} max`} />
        </Box>

        {/* Capacity bar */}
        <Box sx={{
          background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
          p: { xs: '16px 18px', md: '20px 24px' }, mb: { xs: 3, md: 4 },
          boxShadow: '0 1px 3px rgba(0,0,0,.03)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ fontSize: 18, color: '#9a958f' }} />
              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' }, fontWeight: 600, color: '#1a1815' }}>Registration Progress</Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: '0.76rem', sm: '0.82rem' }, fontWeight: 600, color: full ? '#b91c1c' : '#15803d' }}>
              {full ? '🔴 Event Full' : `🟢 ${cap - filled} spots remaining`}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={pct} sx={{
            height: 6, borderRadius: 99, bgcolor: '#f0eef2', mb: 1,
            '& .MuiLinearProgress-bar': { bgcolor: full ? '#b91c1c' : c, borderRadius: 99, transition: 'transform .6s ease' }
          }} />
          <Typography sx={{ fontSize: '0.76rem', color: '#9a958f', textAlign: 'right' }}>
            {filled} / {cap} ({Math.round(pct)}%)
          </Typography>
        </Box>

        <Divider sx={{ mb: { xs: 3, md: 4 }, borderColor: '#e8e5e0' }} />

        {/* Action section */}
        <Box sx={{
          background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
          p: { xs: '20px', sm: '24px', md: '32px' }, boxShadow: '0 1px 3px rgba(0,0,0,.03)'
        }}>
          {!user ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography sx={{ fontSize: '1.5rem', mb: 1.5 }}>🔐</Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1815', mb: '6px' }}>
                Sign in to participate
              </Typography>
              <Typography sx={{ fontSize: '0.84rem', color: '#9a958f', mb: 3 }}>
                Create an account or sign in to register for this event
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={() => navigate('/login')} sx={{
                  background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', px: 4,
                  borderRadius: '10px', fontWeight: 600, textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(135deg, #243368, #354897)' }
                }}>Sign In</Button>
                <Button variant="outlined" onClick={() => navigate('/register')} sx={{
                  borderColor: '#e8e5e0', color: '#1a1815', borderRadius: '10px',
                  fontWeight: 600, textTransform: 'none', px: 3,
                  '&:hover': { borderColor: '#9a958f', background: '#f5f3ef' }
                }}>Create Account</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Status banners */}
              {isRegistered && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: { xs: '12px 16px', sm: '16px 20px' }, background: '#dcfce7', borderRadius: '12px', mb: 2.5,
                  border: '1px solid #bbf7d0'
                }}>
                  <Box sx={{
                    width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: '10px', background: '#15803d18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>🎫</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: { xs: '0.82rem', sm: '0.88rem' }, fontWeight: 600, color: '#15803d' }}>You're registered as a Participant!</Typography>
                    <Typography sx={{ fontSize: '0.76rem', color: '#166534' }}>Your spot is confirmed. See you there!</Typography>
                  </Box>
                </Box>
              )}
              {isVolunteer && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: { xs: '12px 16px', sm: '16px 20px' }, background: '#e6f2ec', borderRadius: '12px', mb: 2.5,
                  border: '1px solid #a7f3d0'
                }}>
                  <Box sx={{
                    width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: '10px', background: '#1a5c3a18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>🙋</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: { xs: '0.82rem', sm: '0.88rem' }, fontWeight: 600, color: '#1a5c3a' }}>Volunteer application submitted!</Typography>
                    <Typography sx={{ fontSize: '0.76rem', color: '#166534' }}>We'll confirm your shift soon</Typography>
                  </Box>
                </Box>
              )}
              {full && !isRegistered && (
                <Box sx={{
                  p: '14px 20px', background: '#fef3c7', borderRadius: '12px',
                  mb: 2.5, border: '1px solid #fde68a'
                }}>
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#92400e' }}>
                    ⚠️ Participant spots are full — you can still volunteer!
                  </Typography>
                </Box>
              )}

              {/* Role choice */}
              <Typography sx={{
                fontSize: '0.74rem', fontWeight: 600, letterSpacing: '.08em',
                textTransform: 'uppercase', color: '#9a958f', mb: 2
              }}>
                How do you want to join?
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {!full && !isRegistered && (
                  <Box onClick={handleParticipate} sx={{
                    p: { xs: 2.5, sm: 3 }, borderRadius: '14px', border: '2px solid #e8e5e0',
                    cursor: 'pointer', transition: 'all .25s', background: '#faf9f7',
                    '&:hover': { borderColor: c, background: `${c}06`, transform: 'translateY(-2px)', boxShadow: `0 4px 12px ${c}18` }
                  }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: '12px', background: `${c}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                    }}>
                      <Typography sx={{ fontSize: '1.3rem' }}>🎫</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#1a1815', mb: '6px' }}>Participate</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#9a958f', lineHeight: 1.6 }}>
                      Compete and win prizes. Your name goes on the scoreboard.
                    </Typography>
                  </Box>
                )}
                {!isVolunteer && (
                  <Box onClick={() => setRoleModal(true)} sx={{
                    p: { xs: 2.5, sm: 3 }, borderRadius: '14px', border: '2px solid #e8e5e0',
                    cursor: 'pointer', transition: 'all .25s', background: '#faf9f7',
                    '&:hover': { borderColor: '#1a5c3a', background: '#e6f2ec', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(26,92,58,.1)' }
                  }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: '12px', background: '#1a5c3a12',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                    }}>
                      <Typography sx={{ fontSize: '1.3rem' }}>🙋</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#1a1815', mb: '6px' }}>Volunteer</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#9a958f', lineHeight: 1.6 }}>
                      Help organise. Get a certificate and volunteer hours.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      {/* Volunteer modal */}
      <Dialog open={roleModal} onClose={() => setRoleModal(false)} fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '18px', border: isMobile ? 'none' : '1px solid #e8e5e0',
            maxWidth: 480, width: '100%'
          }
        }}>
        <DialogTitle sx={{
          fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: '1.2rem',
          color: '#1a1815', pb: 0.5, pt: 3, px: 3
        }}>
          🙋 Volunteer Application
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important', px: 3 }}>
          <Typography sx={{ fontSize: '0.84rem', color: '#9a958f', mb: 3, lineHeight: 1.6 }}>
            Tell us about yourself so we can place you in the right role for <strong style={{ color: '#1a1815' }}>{event.name}</strong>.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {[
              { label: 'Preferred Role', key: 'role', type: 'select', options: ['Any / Flexible', 'Event Coordinator', 'Registration Desk', 'Stage Management', 'Photography', 'First Aid', 'Logistics', 'Technical Support'] },
              { label: 'Availability', key: 'availability', type: 'select', options: ['All 3 Days', 'Day 1 only', 'Day 2 only', 'Day 3 only', 'Day 1 & 2', 'Day 2 & 3'] },
              { label: 'Skills / Experience (optional)', key: 'skills', placeholder: 'e.g. Stage management, photography…' },
            ].map(f => (
              <Box key={f.key}>
                <Typography sx={{ fontSize: '0.74rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>{f.label}</Typography>
                {f.type === 'select' ? (
                  <TextField select size="small" value={volForm[f.key]} onChange={e => setVolForm({ ...volForm, [f.key]: e.target.value })}
                    SelectProps={{ native: true }} fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', background: '#faf9f7',
                        '& fieldset': { borderColor: '#e8e5e0' },
                        '&:hover fieldset': { borderColor: '#c0bdb7' },
                        '&.Mui-focused fieldset': { borderColor: '#2c3e7a' }
                      }
                    }}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </TextField>
                ) : (
                  <TextField size="small" fullWidth value={volForm[f.key]}
                    onChange={e => setVolForm({ ...volForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', background: '#faf9f7',
                        '& fieldset': { borderColor: '#e8e5e0' },
                        '&:hover fieldset': { borderColor: '#c0bdb7' },
                        '&.Mui-focused fieldset': { borderColor: '#2c3e7a' }
                      }
                    }} />
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => setRoleModal(false)} sx={{
            color: '#9a958f', fontWeight: 500, borderRadius: '10px',
            border: '1px solid #e8e5e0', textTransform: 'none', px: 2,
            '&:hover': { background: '#f5f3ef', transform: 'none' }
          }}>Cancel</Button>
          <Button onClick={handleVolunteer} sx={{
            background: 'linear-gradient(135deg, #1a5c3a, #22804e)', color: '#fff',
            px: 3, borderRadius: '10px', fontWeight: 600, textTransform: 'none',
            '&:hover': { background: 'linear-gradient(135deg, #145030, #1a6b42)' }
          }}>Submit Application</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetail;
