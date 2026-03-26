import React from 'react';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import { CalendarMonth, LocationOn, EmojiEvents, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatRupees } from '../utils/currency';

const CAT_COLORS = {
  Music: '#be185d', Dance: '#7c3aed', Tech: '#1d4ed8', Art: '#b45309',
  Sports: '#15803d', Drama: '#b91c1c', Literary: '#0e7490', Photography: '#6b21a8', General: '#2c3e7a'
};

const CAT_ICONS = {
  Music: '🎵', Dance: '💃', Tech: '💻', Art: '🎨',
  Sports: '⚽', Drama: '🎭', Literary: '📖', Photography: '📷', General: '🎪'
};

const STATUS_STYLES = {
  upcoming: { bg: '#e8ebf5', color: '#2c3e7a', label: 'Upcoming' },
  ongoing: { bg: '#dcfce7', color: '#15803d', label: 'Live Now' },
  completed: { bg: '#f3f4f6', color: '#6b7280', label: 'Completed' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
};

const EventCard = ({ event, onRegister, onVolunteer, isRegistered, isVolunteer, showActions = true }) => {
  const navigate = useNavigate();
  const c = CAT_COLORS[event.category_name] || '#2c3e7a';
  const catIcon = CAT_ICONS[event.category_name] || '🎪';
  const filled = event.current_participants ?? event.registered_count ?? 0;
  const cap = event.max_participants;
  const full = filled >= cap;
  const pct = Math.min((filled / cap) * 100, 100);
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.upcoming;

  return (
    <Box onClick={() => navigate(`/events/${event.event_id}`)} sx={{
      background: '#fff', borderRadius: '16px', border: '1px solid #e8e5e0', overflow: 'hidden',
      cursor: 'pointer', transition: 'all .3s cubic-bezier(.4,0,.2,1)', height: '100%',
      display: 'flex', flexDirection: 'column', position: 'relative',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 8px 16px rgba(0,0,0,.06), 0 20px 40px rgba(0,0,0,.1)',
        borderColor: '#d0cdc7',
        '& .card-accent': { width: '100%' }
      }
    }}>
      {/* Top accent bar */}
      <Box className="card-accent" sx={{
        height: 3, width: '60%', background: `linear-gradient(90deg, ${c}, ${c}66)`,
        transition: 'width .4s ease', borderRadius: '0 0 4px 0'
      }} />

      {/* Category icon — top-right corner */}
      <Box sx={{
        position: 'absolute', top: 14, right: 14,
        width: 36, height: 36, borderRadius: '10px',
        background: `${c}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', border: `1px solid ${c}20`
      }}>
        {catIcon}
      </Box>

      <Box sx={{ p: { xs: '16px 16px 14px', sm: '20px 22px 16px' }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category & Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pr: 5 }}>
          <Typography sx={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: c
          }}>
            {event.category_name || 'General'}
          </Typography>
          <Box sx={{ flex: 1 }} />
        </Box>

        {/* Status chip — positioned top-left below category */}
        <Chip label={statusStyle.label} size="small" sx={{
          height: 20, fontSize: '0.65rem', fontWeight: 600, alignSelf: 'flex-start', mb: 1.5,
          background: statusStyle.bg, color: statusStyle.color, border: 'none',
          '& .MuiChip-label': { px: '8px' }
        }} />

        {/* Title */}
        <Typography sx={{
          fontSize: { xs: '0.92rem', sm: '1rem' }, fontWeight: 650, color: '#1a1815',
          mb: 1.5, lineHeight: 1.35, fontFamily: '"Fraunces", serif',
          minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-0.01em'
        }}>
          {event.name}
        </Typography>

        {/* Info rows with icons in left corner */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: 2.5, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarMonth sx={{ fontSize: 15, color: '#9a958f', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#5a5550' }}>
              {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              {event.time ? ` · ${String(event.time).slice(0, 5)}` : ''}
            </Typography>
          </Box>
          {event.venue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LocationOn sx={{ fontSize: 15, color: '#9a958f', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#5a5550' }}>{event.venue}</Typography>
            </Box>
          )}
          {event.prize_pool && event.prize_pool !== 'N/A' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <EmojiEvents sx={{ fontSize: 15, color: c, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: c }}>{formatRupees(event.prize_pool)}</Typography>
            </Box>
          )}
        </Box>

        {/* Capacity bar */}
        <Box sx={{
          p: '10px 12px', background: '#faf9f7', borderRadius: '10px',
          border: '1px solid #f0eef2'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '6px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <People sx={{ fontSize: 13, color: '#9a958f' }} />
              <Typography sx={{ fontSize: '0.72rem', color: '#9a958f', fontWeight: 500 }}>{filled} / {cap}</Typography>
            </Box>
            <Typography sx={{
              fontSize: '0.7rem', fontWeight: 600, px: '6px', py: '1px', borderRadius: '4px',
              color: full ? '#b91c1c' : '#15803d',
              background: full ? '#fee2e218' : '#dcfce718'
            }}>
              {full ? 'Full' : `${cap - filled} left`}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={pct} sx={{
            height: 4, borderRadius: 99, bgcolor: '#e8e5e0',
            '& .MuiLinearProgress-bar': {
              bgcolor: full ? '#b91c1c' : c, borderRadius: 99,
              transition: 'transform .6s ease'
            }
          }} />
        </Box>
      </Box>

      {/* Action buttons */}
      {showActions && (onRegister || onVolunteer) && (
        <Box sx={{
          px: { xs: '16px', sm: '22px' }, pb: '18px', pt: '12px',
          borderTop: '1px solid #f0eef2', display: 'flex', gap: '10px'
        }} onClick={e => e.stopPropagation()}>
          {onRegister && (
            <Box component="button" onClick={() => { if (!isRegistered && !full) onRegister(event.event_id); }}
              sx={{
                flex: 1, py: '9px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600,
                border: 'none', cursor: isRegistered || full ? 'default' : 'pointer', fontFamily: 'inherit',
                background: isRegistered ? '#dcfce7' : full ? '#f3f4f6' : `linear-gradient(135deg, ${c}, ${c}cc)`,
                color: isRegistered ? '#15803d' : full ? '#9a958f' : '#fff',
                transition: 'all .25s', letterSpacing: '.02em',
                boxShadow: isRegistered || full ? 'none' : `0 2px 8px ${c}30`,
                '&:hover': {
                  opacity: isRegistered || full ? 1 : 0.92,
                  transform: isRegistered || full ? 'none' : 'translateY(-1px)',
                  boxShadow: isRegistered || full ? 'none' : `0 4px 12px ${c}40`
                }
              }}>
              {isRegistered ? '✓ Registered' : full ? 'Full' : 'Participate'}
            </Box>
          )}
          {onVolunteer && (
            <Box component="button" onClick={() => { if (!isVolunteer) onVolunteer(event.event_id); }}
              sx={{
                flex: 1, py: '9px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600,
                border: isVolunteer ? 'none' : '1.5px solid #1a5c3a',
                cursor: isVolunteer ? 'default' : 'pointer', fontFamily: 'inherit',
                background: isVolunteer ? '#e6f2ec' : 'transparent', color: '#1a5c3a',
                transition: 'all .25s', letterSpacing: '.02em',
                '&:hover': { background: '#e6f2ec', transform: isVolunteer ? 'none' : 'translateY(-1px)' }
              }}>
              {isVolunteer ? '✓ Volunteering' : 'Volunteer'}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EventCard;
