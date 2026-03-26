import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Chip, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete, Warning } from '@mui/icons-material';
import { getMyRegistrations, getMyAssignments, deleteRegistration, deleteMyAssignment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatRupees } from '../utils/currency';

const CAT_COLORS = { Music: '#be185d', Dance: '#7c3aed', Tech: '#1d4ed8', Art: '#b45309', Sports: '#15803d', Drama: '#b91c1c', Literary: '#0e7490', Photography: '#6b21a8', General: '#2c3e7a' };

const Sidebar = ({ activePanel, setPanel }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { id: 'overview', icon: '◻', label: 'Overview', group: 'Overview' },
    { id: 'events', icon: '🎫', label: 'My Events', group: 'Participant' },
    { id: 'browse', icon: '📅', label: 'Browse & Register', group: 'Participant' },
    { id: 'shifts', icon: '🙋', label: 'My Shifts', group: 'Volunteer' },
    { id: 'apply', icon: '➕', label: 'Apply to Volunteer', group: 'Volunteer' },
  ];
  const groups = ['Overview', 'Participant', 'Volunteer'];

  return (
    <Box sx={{
      background: '#fff', borderRight: '1px solid #e8e5e0', width: 240,
      minHeight: 'calc(100vh - 64px)', position: 'sticky', top: 64, flexShrink: 0,
      display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
      boxShadow: '1px 0 8px rgba(0,0,0,.03)'
    }}>
      <Box sx={{ p: '24px 20px', borderBottom: '1px solid #e8e5e0' }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '12px',
          background: 'linear-gradient(135deg, #e8ebf5, #d4d8f0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Fraunces", serif', fontSize: '1.2rem', fontWeight: 600, color: '#2c3e7a', mb: 1.5
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Box>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815', mb: '3px' }}>{user?.name}</Typography>
        <Typography sx={{ fontSize: '0.74rem', color: '#9a958f' }}>{user?.email}</Typography>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: '5px', mt: '10px',
          px: '10px', py: '4px', borderRadius: '99px',
          background: 'linear-gradient(135deg, #e8ebf5, #f0f0fb)',
          fontSize: '0.7rem', fontWeight: 600, color: '#2c3e7a'
        }}>👤 Student</Box>
      </Box>
      <Box sx={{ p: '16px 14px', flex: 1 }}>
        {groups.map(g => (
          <Box key={g}>
            <Typography sx={{ fontSize: '0.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#b0aba5', px: '10px', mb: 1, mt: g === 'Overview' ? 0 : 2.5 }}>{g}</Typography>
            {navItems.filter(n => n.group === g).map(n => (
              <Box key={n.id} component="button" onClick={() => setPanel(n.id)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: '10px', px: '12px', py: '9px',
                  borderRadius: '10px', fontSize: '0.84rem', fontWeight: activePanel === n.id ? 600 : 500,
                  color: activePanel === n.id ? '#2c3e7a' : '#5a5550', cursor: 'pointer', border: 'none',
                  background: activePanel === n.id ? 'linear-gradient(135deg, #e8ebf5, #f0f0fb)' : 'transparent',
                  fontFamily: 'inherit', width: '100%', textAlign: 'left', mb: '3px', transition: 'all .2s',
                  '&:hover': { background: activePanel === n.id ? 'linear-gradient(135deg, #e8ebf5, #f0f0fb)' : '#f5f3ef', color: '#1a1815' }
                }}>
                <span style={{ fontSize: '0.95rem', width: 22, textAlign: 'center' }}>{n.icon}</span>{n.label}
              </Box>
            ))}
          </Box>
        ))}
        <Box component="button" onClick={() => { logoutUser(); navigate('/'); }}
          sx={{
            display: 'flex', alignItems: 'center', gap: '10px', px: '12px', py: '9px',
            borderRadius: '10px', fontSize: '0.84rem', fontWeight: 500, color: '#9a958f',
            cursor: 'pointer', border: 'none', background: 'transparent', fontFamily: 'inherit',
            width: '100%', textAlign: 'left', mt: 3, transition: 'all .2s',
            '&:hover': { background: '#fee2e2', color: '#b91c1c' }
          }}>
          <span style={{ width: 22, textAlign: 'center' }}>↩</span>Sign out
        </Box>
      </Box>
    </Box>
  );
};

const StatCard = ({ icon, value, label, color = '#2c3e7a' }) => (
  <Box sx={{
    background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
    p: '22px', display: 'flex', flexDirection: 'column', gap: '8px',
    transition: 'all .2s', '&:hover': { borderColor: '#d0cdc7', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }
  }}>
    <Box sx={{
      width: 38, height: 38, borderRadius: '10px', background: `${color}12`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
    }}>{icon}</Box>
    <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.8rem', fontWeight: 600, color: '#1a1815', lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ fontSize: '0.78rem', color: '#9a958f', fontWeight: 500 }}>{label}</Typography>
  </Box>
);

const ItemRow = ({ name, meta, badge, badgeSx, sub, onDelete }) => (
  <Box sx={{
    background: '#faf9f7', borderRadius: '12px', border: '1px solid #e8e5e0',
    p: { xs: '12px 14px', sm: '16px 18px' }, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    gap: { xs: 1, sm: 2 }, mb: 1.5, transition: 'all .2s',
    '&:hover': { borderColor: '#d0cdc7', background: '#f5f3ef' }
  }}>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: { xs: '0.82rem', sm: '0.9rem' }, fontWeight: 600, color: '#1a1815', mb: '5px', wordBreak: 'break-word' }}>{name}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        {meta.map((m, i) => <React.Fragment key={i}>{i > 0 && <Box sx={{ width: 3, height: 3, borderRadius: '50%', background: '#d0cdc7' }} />}<Typography sx={{ fontSize: { xs: '0.72rem', sm: '0.78rem' }, color: '#9a958f' }}>{m}</Typography></React.Fragment>)}
      </Box>
      {sub && <Typography sx={{ fontSize: { xs: '0.72rem', sm: '0.78rem' }, color: '#9a958f', mt: '6px' }}>{sub}</Typography>}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
      <Box sx={{ fontSize: { xs: '0.64rem', sm: '0.7rem' }, fontWeight: 600, px: { xs: '8px', sm: '10px' }, py: '4px', borderRadius: '99px', whiteSpace: 'nowrap', ...badgeSx }}>{badge}</Box>
      {onDelete && (
        <Tooltip title="Delete" arrow>
          <IconButton onClick={onDelete} size="small" sx={{
            color: '#c0bdb7', width: 30, height: 30,
            '&:hover': { color: '#b91c1c', background: '#fee2e2' }
          }}>
            <Delete sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  </Box>
);

const EmptyState = ({ icon, title, sub, btnLabel, onBtn }) => (
  <Box sx={{
    textAlign: 'center', py: 8, px: 3, color: '#9a958f',
    background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0'
  }}>
    <Typography sx={{ fontSize: '3rem', mb: 2, opacity: .5 }}>{icon}</Typography>
    <Typography sx={{ fontWeight: 600, color: '#1a1815', mb: '6px', fontSize: '1rem' }}>{title}</Typography>
    <Typography sx={{ fontSize: '0.86rem', mb: 3 }}>{sub}</Typography>
    {btnLabel && <Button onClick={onBtn} sx={{
      background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', color: '#fff',
      fontSize: '0.84rem', px: 3, py: 1.1, borderRadius: '10px', fontWeight: 600,
      textTransform: 'none', boxShadow: '0 2px 8px rgba(44,62,122,.2)',
      '&:hover': { background: 'linear-gradient(135deg, #243368, #354897)' }
    }}>{btnLabel}</Button>}
  </Box>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [panel, setPanel] = useState('overview');
  const [regs, setRegs] = useState([]);
  const [vols, setVols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null, name: '' });

  useEffect(() => {
    Promise.all([getMyRegistrations(), getMyAssignments()])
      .then(([r, v]) => { setRegs(r.data); setVols(v.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const openDeleteDialog = (type, id, name) => setDeleteDialog({ open: true, type, id, name });

  const handleDelete = async () => {
    const { type, id, name } = deleteDialog;
    setDeleteDialog({ open: false, type: '', id: null, name: '' });
    try {
      if (type === 'registration') {
        await deleteRegistration(id);
        setRegs(prev => prev.filter(r => r.registration_id !== id));
        showAlert('success', `Removed registration for "${name}"`);
      } else {
        await deleteMyAssignment(id);
        setVols(prev => prev.filter(v => v.assignment_id !== id));
        showAlert('success', `Removed volunteer shift for "${name}"`);
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
      <CircularProgress sx={{ color: '#2c3e7a', mb: 2 }} />
      <Typography sx={{ fontSize: '0.85rem', color: '#9a958f' }}>Loading your dashboard...</Typography>
    </Box>
  );

  const confirmed = regs.filter(r => r.status === 'confirmed').length;

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#faf9f6' }}>
      <Sidebar activePanel={panel} setPanel={setPanel} />
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 5 }, maxWidth: 960 }}>

        {/* Mobile nav tabs */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' }, gap: 1, mb: 2.5,
          overflow: 'auto', pb: 0.5, mx: -0.5, px: 0.5,
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {[
            { id: 'overview', icon: '◻', label: 'Overview' },
            { id: 'events', icon: '🎫', label: 'Events' },
            { id: 'browse', icon: '📅', label: 'Browse' },
            { id: 'shifts', icon: '🙋', label: 'Shifts' },
            { id: 'apply', icon: '➕', label: 'Apply' },
          ].map(n => (
            <Box key={n.id} component="button" onClick={() => setPanel(n.id)}
              sx={{
                display: 'flex', alignItems: 'center', gap: '5px',
                px: '12px', py: '7px', borderRadius: '10px', flexShrink: 0,
                fontSize: '0.76rem', fontWeight: panel === n.id ? 600 : 500,
                color: panel === n.id ? '#2c3e7a' : '#5a5550',
                cursor: 'pointer', border: panel === n.id ? '1.5px solid #2c3e7a' : '1px solid #e8e5e0',
                background: panel === n.id ? '#e8ebf5' : '#fff',
                fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all .2s',
                '&:hover': { borderColor: '#2c3e7a', background: '#f0f0fb' }
              }}>
              <span style={{ fontSize: '0.82rem' }}>{n.icon}</span>{n.label}
            </Box>
          ))}
        </Box>

        {/* Alert */}
        {alert && (
          <Alert severity={alert.type} sx={{
            mb: 3, borderRadius: '12px', border: '1px solid',
            borderColor: alert.type === 'success' ? '#bbf7d0' : '#fecaca',
          }} onClose={() => setAlert(null)}>
            {alert.msg}
          </Alert>
        )}

        {/* OVERVIEW */}
        {panel === 'overview' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>
              Hey, {user?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 4 }}>
              Here's what's happening with your FestZone activity
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}><StatCard icon="🎫" value={regs.length} label="Events Registered" color="#2c3e7a" /></Grid>
              <Grid item xs={6} sm={3}><StatCard icon="🙋" value={vols.length} label="Volunteer Shifts" color="#1a5c3a" /></Grid>
              <Grid item xs={6} sm={3}><StatCard icon="✅" value={confirmed} label="Confirmed" color="#15803d" /></Grid>
              <Grid item xs={6} sm={3}><StatCard icon="📅" value="3" label="Days to Fest" color="#b45309" /></Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0', overflow: 'hidden' }}>
                  <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e8e5e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815' }}>Recent Registrations</Typography>
                    <Button onClick={() => setPanel('events')} sx={{ fontSize: '0.78rem', color: '#2c3e7a', fontWeight: 600, p: 0, minWidth: 0, textTransform: 'none', '&:hover': { background: 'transparent', transform: 'none' } }}>View all →</Button>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {regs.length ? regs.slice(-3).reverse().map((r, i) => (
                      <ItemRow key={i} name={r.event_name} meta={[r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '', r.venue || '']} badge="✓ Confirmed" badgeSx={{ background: '#dcfce7', color: '#15803d' }} />
                    )) : <Box sx={{ py: 3, textAlign: 'center', color: '#9a958f', fontSize: '0.86rem' }}>No registrations yet</Box>}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0', overflow: 'hidden' }}>
                  <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e8e5e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815' }}>Volunteer Shifts</Typography>
                    <Button onClick={() => setPanel('shifts')} sx={{ fontSize: '0.78rem', color: '#2c3e7a', fontWeight: 600, p: 0, minWidth: 0, textTransform: 'none', '&:hover': { background: 'transparent', transform: 'none' } }}>View all →</Button>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {vols.length ? vols.slice(-3).reverse().map((v, i) => (
                      <ItemRow key={i} name={v.event_name} meta={[v.role || 'Volunteer', v.date ? new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '']} badge="Pending" badgeSx={{ background: '#fef3c7', color: '#92400e' }} />
                    )) : <Box sx={{ py: 3, textAlign: 'center', color: '#9a958f', fontSize: '0.86rem' }}>No shifts yet</Box>}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* MY EVENTS (with delete) */}
        {panel === 'events' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>My Events</Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 3.5 }}>
              All events you've signed up for as a participant ({regs.length})
            </Typography>
            {regs.length ? regs.map((r, i) => (
              <ItemRow key={i} name={r.event_name}
                meta={[r.category || '', r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '', r.time ? String(r.time).slice(0, 5) : '', `📍 ${r.venue || ''}`]}
                badge={r.status || 'confirmed'} badgeSx={{ background: '#dcfce7', color: '#15803d' }}
                sub={r.prize_pool && r.prize_pool !== 'N/A' ? `🏆 ${formatRupees(r.prize_pool)}` : undefined}
                onDelete={() => openDeleteDialog('registration', r.registration_id, r.event_name)} />
            )) : <EmptyState icon="📅" title="No registrations yet" sub="Browse events and register to see them here" btnLabel="Browse Events →" onBtn={() => navigate('/events')} />}
          </Box>
        )}

        {/* BROWSE */}
        {panel === 'browse' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>Browse & Register</Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 3.5 }}>Discover events and join as a participant or volunteer</Typography>
            <Button onClick={() => navigate('/events')} sx={{
              background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', color: '#fff',
              px: 4, py: 1.3, borderRadius: '10px', fontWeight: 600, textTransform: 'none',
              boxShadow: '0 2px 8px rgba(44,62,122,.2)',
              '&:hover': { background: 'linear-gradient(135deg, #243368, #354897)' }
            }}>Browse All Events →</Button>
          </Box>
        )}

        {/* VOL SHIFTS (with delete) */}
        {panel === 'shifts' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>My Volunteer Shifts</Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 3.5 }}>
              Events you're helping organise as a volunteer ({vols.length})
            </Typography>
            {vols.length ? vols.map((v, i) => (
              <ItemRow key={i} name={v.event_name}
                meta={[v.role || 'Volunteer', v.date ? new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '', `📍 ${v.venue || ''}`]}
                badge="Pending" badgeSx={{ background: '#fef3c7', color: '#92400e' }}
                sub={`Availability: ${v.availability || 'All days'} · ${v.hours_worked ? `${v.hours_worked} hrs worked` : 'Not started'}`}
                onDelete={() => openDeleteDialog('assignment', v.assignment_id, v.event_name)} />
            )) : <EmptyState icon="🙋" title="No volunteer shifts yet" sub="Apply to volunteer at an event to see your shifts here" btnLabel="Apply to Volunteer →" onBtn={() => setPanel('apply')} />}
          </Box>
        )}

        {/* APPLY VOL */}
        {panel === 'apply' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>Apply to Volunteer</Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 3.5 }}>Open an event page and click "Volunteer" to apply</Typography>
            <Button onClick={() => navigate('/events')} sx={{
              background: 'linear-gradient(135deg, #1a5c3a, #22804e)', color: '#fff',
              px: 4, py: 1.3, borderRadius: '10px', fontWeight: 600, textTransform: 'none',
              boxShadow: '0 2px 8px rgba(26,92,58,.2)',
              '&:hover': { background: 'linear-gradient(135deg, #145030, #1a6b42)' }
            }}>Browse Events to Volunteer →</Button>
          </Box>
        )}

      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}
        PaperProps={{ sx: { borderRadius: '18px', border: '1px solid #e8e5e0', maxWidth: 420, width: '100%' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3, px: 3, pb: 1 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px', background: '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Warning sx={{ color: '#b91c1c', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: '1.15rem', color: '#1a1815' }}>
              Confirm Delete
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: '8px !important' }}>
          <Typography sx={{ fontSize: '0.88rem', color: '#5a5550', lineHeight: 1.7 }}>
            Are you sure you want to delete your {deleteDialog.type === 'registration' ? 'registration' : 'volunteer shift'} for{' '}
            <strong style={{ color: '#1a1815' }}>"{deleteDialog.name}"</strong>?
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#9a958f', mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}
            sx={{
              color: '#5a5550', fontWeight: 500, borderRadius: '10px', px: 2.5,
              border: '1px solid #e8e5e0', textTransform: 'none',
              '&:hover': { background: '#f5f3ef', transform: 'none' }
            }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{
            background: 'linear-gradient(135deg, #b91c1c, #dc2626)', color: '#fff',
            px: 3, borderRadius: '10px', fontWeight: 600, textTransform: 'none',
            boxShadow: '0 2px 8px rgba(185,28,28,.25)',
            '&:hover': { background: 'linear-gradient(135deg, #991b1b, #b91c1c)' }
          }}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;
