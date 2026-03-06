import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Tooltip, Alert, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete, Warning } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, LabelList } from 'recharts';
import { getDashboardStats, getRegistrationsPerEvent, getCategoryBreakdown, getVolunteerDistribution, getAllRegistrations, getAllAssignments, createEvent, deleteEvent, getEvents, adminDeleteRegistration, adminDeleteAssignment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CAT_COLORS = { Music: '#be185d', Dance: '#7c3aed', Tech: '#1d4ed8', Art: '#b45309', Sports: '#15803d', Drama: '#b91c1c', Literary: '#0e7490', Photography: '#6b21a8' };
const COLORS = Object.values(CAT_COLORS);

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', background: '#faf9f7', fontSize: '0.88rem',
    '& fieldset': { borderColor: '#e8e5e0' },
    '&:hover fieldset': { borderColor: '#c0bdb7' },
    '&.Mui-focused fieldset': { borderColor: '#2c3e7a', borderWidth: '1.5px' },
  }
};

const Sidebar = ({ activePanel, setPanel }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    { id: 'overview', icon: '◻', label: 'Overview' },
    { id: 'events', icon: '📅', label: 'Events' },
    { id: 'registrations', icon: '🎫', label: 'Registrations' },
    { id: 'volunteers', icon: '🙋', label: 'Volunteers' },
  ];

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
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', mb: 1.5
        }}>⚙️</Box>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815', mb: '3px' }}>Admin Panel</Typography>
        <Typography sx={{ fontSize: '0.74rem', color: '#9a958f' }}>admin@college.edu</Typography>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: '5px', mt: '10px',
          px: '10px', py: '4px', borderRadius: '99px',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          fontSize: '0.7rem', fontWeight: 600, color: '#92400e'
        }}>⚙️ Administrator</Box>
      </Box>
      <Box sx={{ p: '16px 14px', flex: 1 }}>
        <Typography sx={{ fontSize: '0.66rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#b0aba5', px: '10px', mb: 1 }}>Dashboard</Typography>
        {navItems.map(n => (
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
    p: '22px', transition: 'all .2s',
    '&:hover': { borderColor: '#d0cdc7', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }
  }}>
    <Box sx={{
      width: 38, height: 38, borderRadius: '10px', background: `${color}12`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', mb: 1.5
    }}>{icon}</Box>
    <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '2rem', fontWeight: 600, color: '#1a1815', lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ fontSize: '0.78rem', color: '#9a958f', fontWeight: 500, mt: '6px' }}>{label}</Typography>
  </Box>
);

const MobileNav = ({ activePanel, setPanel }) => {
  const navItems = [
    { id: 'overview', icon: '◻', label: 'Overview' },
    { id: 'events', icon: '📅', label: 'Events' },
    { id: 'registrations', icon: '🎫', label: 'Regs' },
    { id: 'volunteers', icon: '🙋', label: 'Vols' },
  ];
  return (
    <Box sx={{
      display: { xs: 'flex', md: 'none' }, gap: 1, mb: 2.5,
      overflow: 'auto', pb: 0.5, mx: -1, px: 1,
      '&::-webkit-scrollbar': { display: 'none' }
    }}>
      {navItems.map(n => (
        <Box key={n.id} component="button" onClick={() => setPanel(n.id)}
          sx={{
            display: 'flex', alignItems: 'center', gap: '6px',
            px: '14px', py: '8px', borderRadius: '10px', flexShrink: 0,
            fontSize: '0.78rem', fontWeight: activePanel === n.id ? 600 : 500,
            color: activePanel === n.id ? '#2c3e7a' : '#5a5550',
            cursor: 'pointer', border: activePanel === n.id ? '1.5px solid #2c3e7a' : '1px solid #e8e5e0',
            background: activePanel === n.id ? '#e8ebf5' : '#fff',
            fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all .2s',
            '&:hover': { borderColor: '#2c3e7a', background: '#f0f0fb' }
          }}>
          <span style={{ fontSize: '0.85rem' }}>{n.icon}</span>{n.label}
        </Box>
      ))}
    </Box>
  );
};

const StyledTable = ({ headers, rows, onDelete }) => (
  <Paper sx={{
    borderRadius: '14px', border: '1px solid #e8e5e0', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,.03)'
  }}>
    <Box sx={{ overflowX: 'auto' }}>
    <Table sx={{ minWidth: 600 }}>
      <TableHead>
        <TableRow>
          {headers.map(h => (
            <TableCell key={h} sx={{
              fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '.08em', color: '#9a958f', background: '#faf9f7',
              borderBottom: '1px solid #e8e5e0', py: 1.5
            }}>{h}</TableCell>
          ))}
          {onDelete && (
            <TableCell sx={{
              fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '.08em', color: '#9a958f', background: '#faf9f7',
              borderBottom: '1px solid #e8e5e0', py: 1.5, width: 60, textAlign: 'center'
            }}>Action</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length ? rows.map((row, i) => (
          <TableRow key={i} sx={{ '&:hover td': { background: '#faf9f7' }, transition: 'all .15s' }}>
            {row.cells.map((cell, j) => (
              <TableCell key={j} sx={{ fontSize: '0.84rem', color: '#5a5550', borderBottom: '1px solid #f0eef2', py: 1.5 }}>{cell}</TableCell>
            ))}
            {onDelete && (
              <TableCell sx={{ borderBottom: '1px solid #f0eef2', textAlign: 'center', py: 1.5 }}>
                <Tooltip title="Delete" arrow>
                  <IconButton onClick={() => onDelete(row.id, row.label)} size="small" sx={{
                    color: '#c0bdb7', width: 32, height: 32,
                    '&:hover': { color: '#b91c1c', background: '#fee2e2' }
                  }}>
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            )}
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={headers.length + (onDelete ? 1 : 0)} sx={{
              textAlign: 'center', py: 6, color: '#9a958f', fontSize: '0.86rem'
            }}>No data yet</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [panel, setPanel] = useState('overview');
  const [stats, setStats] = useState({});
  const [regChart, setRegChart] = useState([]);
  const [catChart, setCatChart] = useState([]);
  const [regs, setRegs] = useState([]);
  const [vols, setVols] = useState([]);
  const [events, setEventsData] = useState([]);
  const [volChart, setVolChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvOpen, setNewEvOpen] = useState(false);
  const [newEv, setNewEv] = useState({ name: '', category_id: 1, date: '', time: '10:00', venue: '', max_participants: 50, prize_pool: '', description: '' });
  const [alert, setAlert] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null, name: '' });
  const isMobile = useMediaQuery('(max-width:899px)');

  useEffect(() => {
    Promise.all([getDashboardStats(), getRegistrationsPerEvent(), getCategoryBreakdown(), getVolunteerDistribution(), getAllRegistrations(), getAllAssignments(), getEvents()])
      .then(([s, r, c, v, regsData, volsData, eventsData]) => {
        setStats(s.data); setRegChart(r.data); setCatChart(c.data); setVolChart(v.data); setRegs(regsData.data); setVols(volsData.data); setEventsData(eventsData.data);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleCreateEvent = async () => {
    try {
      await createEvent(newEv); setNewEvOpen(false);
      showAlert('success', 'Event created successfully!');
    } catch (err) { showAlert('error', err.response?.data?.message || 'Failed to create event'); }
  };

  const openDeleteDialog = (type, id, name) => setDeleteDialog({ open: true, type, id, name });

  const handleDelete = async () => {
    const { type, id, name } = deleteDialog;
    setDeleteDialog({ open: false, type: '', id: null, name: '' });
    try {
      if (type === 'event') {
        await deleteEvent(id);
        setEventsData(prev => prev.filter(e => e.event_id !== id));
        setRegChart(prev => prev.filter(e => e.event_id !== id));
        showAlert('success', `Deleted event "${name}"`);
      } else if (type === 'registration') {
        await adminDeleteRegistration(id);
        setRegs(prev => prev.filter(r => r.registration_id !== id));
        showAlert('success', `Deleted registration for "${name}"`);
      } else {
        await adminDeleteAssignment(id);
        setVols(prev => prev.filter(v => v.assignment_id !== id));
        showAlert('success', `Deleted volunteer assignment for "${name}"`);
      }
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
      <CircularProgress sx={{ color: '#2c3e7a', mb: 2 }} />
      <Typography sx={{ fontSize: '0.85rem', color: '#9a958f' }}>Loading admin panel...</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#faf9f6' }}>
      <Sidebar activePanel={panel} setPanel={setPanel} />
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 5 }, maxWidth: 1060 }}>

        {/* Mobile nav tabs */}
        <MobileNav activePanel={panel} setPanel={setPanel} />

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
              Admin Overview
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 4 }}>FestZone management at a glance</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}><StatCard icon="📅" value={stats.total_events || 0} label="Total Events" color="#2c3e7a" /></Grid>
              <Grid item xs={6} sm={3}><StatCard icon="👥" value={stats.total_students || 0} label="Students" color="#7c3aed" /></Grid>
              <Grid item xs={6} sm={3}><StatCard icon="🎫" value={stats.total_registrations || 0} label="Registrations" color="#15803d" /></Grid>
              <Grid item xs={6} sm={3}><StatCard icon="🙋" value={stats.total_volunteers || 0} label="Volunteers" color="#b45309" /></Grid>
            </Grid>
            {/* Top Event Highlight */}
            {regChart.length > 0 && (
              <Box sx={{
                background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', borderRadius: '14px',
                p: { xs: 2.5, md: 3 }, mb: 3, color: '#fff', display: 'flex', alignItems: 'center', gap: 2,
                boxShadow: '0 4px 16px rgba(44,62,122,.2)'
              }}>
                <Box sx={{ fontSize: '2rem' }}>🏆</Box>
                <Box>
                  <Typography sx={{ fontSize: '0.74rem', fontWeight: 500, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Most Popular Event</Typography>
                  <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.15rem', fontWeight: 600, mt: '2px' }}>
                    {regChart[0].event_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.7)', mt: '2px' }}>
                    {regChart[0].total_registrations} registrations
                  </Typography>
                </Box>
              </Box>
            )}

            <Grid container spacing={3}>
              {/* Registrations per Event - Bar Chart */}
              <Grid item xs={12} md={8}>
                <Box sx={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
                  p: { xs: 2.5, md: 3 }, boxShadow: '0 1px 3px rgba(0,0,0,.03)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815' }}>Registrations per Event</Typography>
                      <Typography sx={{ fontSize: '0.74rem', color: '#9a958f', mt: '2px' }}>Number of confirmed participant sign-ups for each event</Typography>
                    </Box>
                    <Box sx={{ px: '10px', py: '4px', borderRadius: '8px', background: '#f0f0fb', fontSize: '0.72rem', fontWeight: 600, color: '#2c3e7a' }}>
                      Top {Math.min(regChart.length, 8)} events
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={regChart.slice(0, 8)} margin={{ top: 10, right: 10, left: 0, bottom: 55 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e5e0" vertical={false} />
                      <XAxis dataKey="event_name" tick={{ fontSize: 9, fill: '#9a958f' }} angle={-35} textAnchor="end" interval={0} />
                      <YAxis tick={{ fontSize: 10, fill: '#9a958f' }} label={{ value: 'Registrations', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#9a958f' } }} allowDecimals={false} />
                      <ReTooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8e5e0', fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }} formatter={(value) => [`${value} registrations`, 'Count']} />
                      <Bar dataKey="total_registrations" fill="#2c3e7a" radius={[6, 6, 0, 0]} name="Registrations">
                        <LabelList dataKey="total_registrations" position="top" style={{ fontSize: 10, fill: '#5a5550', fontWeight: 600 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              {/* Events by Category - Pie Chart */}
              <Grid item xs={12} md={4}>
                <Box sx={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
                  p: { xs: 2.5, md: 3 }, height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,.03)'
                }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815', mb: '2px' }}>Events by Category</Typography>
                  <Typography sx={{ fontSize: '0.74rem', color: '#9a958f', mb: 2 }}>Distribution of events across categories</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={catChart} dataKey="event_count" nameKey="category" cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={2}>
                        {catChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8e5e0', fontSize: '0.8rem' }} formatter={(value, name) => [`${value} events`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend below pie */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', mt: 1 }}>
                    {catChart.map((c, i) => (
                      <Box key={c.category} sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.68rem', color: '#5a5550' }}>{c.category} ({c.event_count})</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Volunteer Distribution - Bar Chart */}
              <Grid item xs={12} md={8}>
                <Box sx={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
                  p: { xs: 2.5, md: 3 }, boxShadow: '0 1px 3px rgba(0,0,0,.03)'
                }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815' }}>Volunteer Distribution</Typography>
                    <Typography sx={{ fontSize: '0.74rem', color: '#9a958f', mt: '2px' }}>Number of volunteers assigned to each event</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={volChart.slice(0, 8)} margin={{ top: 10, right: 10, left: 0, bottom: 55 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e5e0" vertical={false} />
                      <XAxis dataKey="event_name" tick={{ fontSize: 9, fill: '#9a958f' }} angle={-35} textAnchor="end" interval={0} />
                      <YAxis tick={{ fontSize: 10, fill: '#9a958f' }} label={{ value: 'Volunteers', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#9a958f' } }} allowDecimals={false} />
                      <ReTooltip contentStyle={{ borderRadius: 10, border: '1px solid #e8e5e0', fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }} formatter={(value) => [`${value} volunteers`, 'Count']} />
                      <Bar dataKey="volunteer_count" fill="#b45309" radius={[6, 6, 0, 0]} name="Volunteers">
                        <LabelList dataKey="volunteer_count" position="top" style={{ fontSize: 10, fill: '#5a5550', fontWeight: 600 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              {/* Category Participants Summary Table */}
              <Grid item xs={12} md={4}>
                <Box sx={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #e8e5e0',
                  p: { xs: 2.5, md: 3 }, height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,.03)'
                }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1815', mb: '2px' }}>Category Summary</Typography>
                  <Typography sx={{ fontSize: '0.74rem', color: '#9a958f', mb: 2 }}>Events and participants per category</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {catChart.map((c, i) => (
                      <Box key={c.category} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px 12px', borderRadius: '10px', background: '#faf9f7', border: '1px solid #f0eef2' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '3px', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a1815' }}>{c.category}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9a958f' }}>{c.event_count} events</Typography>
                          <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#2c3e7a', background: '#e8ebf5', px: '8px', py: '2px', borderRadius: '6px' }}>{c.total_participants} participants</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* EVENTS */}
        {panel === 'events' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>Events</Typography>
                <Typography sx={{ fontSize: '0.88rem', color: '#9a958f' }}>Manage all fest events ({regChart.length})</Typography>
              </Box>
              <Button onClick={() => setNewEvOpen(true)} sx={{
                background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', color: '#fff',
                fontSize: '0.84rem', px: 3, py: 1.1, borderRadius: '10px', fontWeight: 600,
                textTransform: 'none', boxShadow: '0 2px 8px rgba(44,62,122,.2)',
                '&:hover': { background: 'linear-gradient(135deg, #243368, #354897)' }
              }}>+ New Event</Button>
            </Box>
            <StyledTable
              headers={['Event', 'Category', 'Date', 'Venue', 'Capacity', 'Prize']}
              onDelete={(id, name) => openDeleteDialog('event', id, name)}
              rows={(events.length ? events : regChart).map(e => ({
                id: e.event_id,
                label: e.event_name || e.name,
                cells: [
                  <Typography sx={{ fontWeight: 600, color: '#1a1815', fontSize: '0.86rem' }}>{e.event_name || e.name}</Typography>,
                  <Box sx={{ display: 'inline-block', px: '10px', py: '3px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, background: `${CAT_COLORS[e.category_name] || '#2c3e7a'}12`, color: CAT_COLORS[e.category_name] || '#2c3e7a' }}>{e.category_name}</Box>,
                  new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                  e.venue || '—',
                  `${e.participant_count || e.current_participants || 0} / ${e.max_participants}`,
                  e.prize_pool || '—'
                ]
              }))}
            />
          </Box>
        )}

        {/* REGISTRATIONS (with delete) */}
        {panel === 'registrations' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>All Registrations</Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 4 }}>Participant sign-ups across all events ({regs.length})</Typography>
            <StyledTable
              headers={['Student', 'Email', 'Event', 'Category', 'Date Registered', 'Status']}
              onDelete={(id, name) => openDeleteDialog('registration', id, name)}
              rows={regs.map(r => ({
                id: r.registration_id,
                label: `${r.student_name} - ${r.event_name}`,
                cells: [
                  <Typography sx={{ fontWeight: 600, color: '#1a1815', fontSize: '0.86rem' }}>{r.student_name}</Typography>,
                  <Typography sx={{ fontSize: '0.82rem', color: '#9a958f' }}>{r.student_email}</Typography>,
                  r.event_name,
                  <Box sx={{ display: 'inline-block', px: '10px', py: '3px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, background: `${CAT_COLORS[r.category] || '#2c3e7a'}12`, color: CAT_COLORS[r.category] || '#2c3e7a' }}>{r.category}</Box>,
                  new Date(r.registration_date || r.registered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                  <Box sx={{ display: 'inline-block', px: '10px', py: '3px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>✓ {r.status || 'confirmed'}</Box>
                ]
              }))}
            />
          </Box>
        )}

        {/* VOLUNTEERS (with delete) */}
        {panel === 'volunteers' && (
          <Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 600, color: '#1a1815', mb: '6px' }}>Volunteer Applications</Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#9a958f', mb: 4 }}>Students who applied to volunteer ({vols.length})</Typography>
            <StyledTable
              headers={['Student', 'Email', 'Event', 'Role', 'Availability', 'Status']}
              onDelete={(id, name) => openDeleteDialog('assignment', id, name)}
              rows={vols.map(v => ({
                id: v.assignment_id,
                label: `${v.volunteer_name} - ${v.event_name}`,
                cells: [
                  <Typography sx={{ fontWeight: 600, color: '#1a1815', fontSize: '0.86rem' }}>{v.volunteer_name}</Typography>,
                  <Typography sx={{ fontSize: '0.82rem', color: '#9a958f' }}>{v.email}</Typography>,
                  v.event_name,
                  v.role || 'Any',
                  v.availability || 'All days',
                  <Box sx={{ display: 'inline-block', px: '10px', py: '3px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>Pending</Box>
                ]
              }))}
            />
          </Box>
        )}
      </Box>

      {/* New Event Dialog */}
      <Dialog open={newEvOpen} onClose={() => setNewEvOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : '18px', border: isMobile ? 'none' : '1px solid #e8e5e0' } }}>
        <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: '1.25rem', color: '#1a1815', pt: 3, px: 3, pb: 1 }}>
          Create New Event
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {[['name', 'Event Name', 'text', '24hr Hackathon'], ['date', 'Date', 'date', ''], ['time', 'Time', 'time', '10:00'], ['venue', 'Venue', 'text', 'CS Lab Block'], ['max_participants', 'Max Participants', 'number', '50'], ['prize_pool', 'Prize Pool', 'text', '₹50,000'], ['description', 'Description', 'text', '']].map(([k, l, t, p]) => (
              <Box key={k}>
                <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#5a5550', mb: '8px' }}>{l}</Typography>
                <TextField size="small" fullWidth type={t} value={newEv[k]}
                  onChange={e => setNewEv({ ...newEv, [k]: e.target.value })}
                  placeholder={p} sx={inputSx} />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button onClick={() => setNewEvOpen(false)} sx={{
            color: '#5a5550', fontWeight: 500, borderRadius: '10px', px: 2.5,
            border: '1px solid #e8e5e0', textTransform: 'none',
            '&:hover': { background: '#f5f3ef', transform: 'none' }
          }}>Cancel</Button>
          <Button onClick={handleCreateEvent} sx={{
            background: 'linear-gradient(135deg, #2c3e7a, #3d52a8)', color: '#fff',
            px: 3, borderRadius: '10px', fontWeight: 600, textTransform: 'none',
            '&:hover': { background: 'linear-gradient(135deg, #243368, #354897)' }
          }}>Create Event</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}
        PaperProps={{ sx: { borderRadius: isMobile ? '14px' : '18px', border: '1px solid #e8e5e0', maxWidth: 440, width: '100%', mx: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3, px: 3, pb: 1 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px', background: '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Warning sx={{ color: '#b91c1c', fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: '1.15rem', color: '#1a1815' }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: '8px !important' }}>
          <Typography sx={{ fontSize: '0.88rem', color: '#5a5550', lineHeight: 1.7 }}>
            Are you sure you want to delete this {deleteDialog.type === 'event' ? 'event' : deleteDialog.type === 'registration' ? 'registration' : 'volunteer assignment'}?
          </Typography>
          <Box sx={{
            mt: 1.5, p: '12px 16px', background: '#faf9f7', borderRadius: '10px',
            border: '1px solid #e8e5e0', fontSize: '0.86rem', fontWeight: 600, color: '#1a1815'
          }}>
            {deleteDialog.name}
          </Box>
          <Typography sx={{ fontSize: '0.82rem', color: '#9a958f', mt: 1.5 }}>
            This action cannot be undone. The record will be permanently removed.
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

export default AdminDashboard;
