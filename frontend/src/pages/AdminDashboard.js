import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, CalendarDays, Users, Pencil, Trash2, Plus } from 'lucide-react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkeletonRow from '../components/ui/SkeletonRow';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toISOString().split('T')[0];
};

const STATS_COLORS = [
  { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-amber-50', text: 'text-amber-600' },
  { bg: 'bg-rose-50', text: 'text-rose-600' }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, eventId: null, eventName: '' });
  
  const initialForm = { name: '', description: '', date: '', time: '', venue: '', category_name: 'General', max_participants: 100, prize_pool: '', status: 'upcoming' };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const showToast = (type, message) => setToast({ show: true, type, message });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      showToast('error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, max_participants: parseInt(form.max_participants) || 100 };
      if (editingId) {
        await updateEvent(editingId, payload);
        showToast('success', 'Event updated successfully');
      } else {
        await createEvent(payload);
        showToast('success', 'Event created successfully');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEditClick = (ev) => {
    setForm({
      name: ev.name, description: ev.description || '', date: formatDateForInput(ev.date),
      time: ev.time ? ev.time.slice(0, 5) : '', venue: ev.venue || '', category_name: ev.category_name,
      max_participants: ev.max_participants, prize_pool: ev.prize_pool || '', status: ev.status
    });
    setEditingId(ev.event_id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(deleteModal.eventId);
      showToast('success', 'Event deleted successfully');
      setDeleteModal({ open: false, eventId: null, eventName: '' });
      loadData();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  const metrics = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status !== 'cancelled' && e.status !== 'completed').length,
    totalCapacity: events.reduce((acc, e) => acc + (e.max_participants || 0), 0),
    totalRegistrations: events.reduce((acc, e) => acc + (e.current_participants || 0), 0)
  };

  const chartData = events.slice(0, 8).map(e => ({ name: e.name.substring(0, 15)+'...', regs: e.current_participants || 0, cap: e.max_participants }));

  const StatCard = ({ icon: Icon, label, value, colorIdx }) => (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${STATS_COLORS[colorIdx].bg} ${STATS_COLORS[colorIdx].text}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-500 mb-1 tracking-wide">{label}</p>
        <p className="text-3xl font-display font-bold text-stone-900">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-stone-50 flex flex-col md:flex-row">
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r border-stone-200 bg-white sticky top-16 h-[calc(100vh-64px)] z-10">
        <div className="p-6 pb-2">
          <h2 className="text-2xl font-display font-bold text-indigo-900 mb-1">Admin Panel</h2>
          <p className="text-stone-500 text-sm font-medium">FestZone Management</p>
        </div>
        <div className="p-4 flex-1">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-800 font-semibold text-sm">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" /> Dashboard Overview
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-stone-900">Dashboard Overview</h1>
            <p className="text-stone-500 font-medium mt-1">Manage events, registrations, and monitor analytics.</p>
          </div>
          <Button onClick={() => { setForm(initialForm); setEditingId(null); setModalOpen(true); }} className="shrink-0 gap-2 font-medium">
            <Plus className="w-4 h-4" /> New Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={CalendarDays} label="Total Events" value={metrics.totalEvents} colorIdx={0} />
          <StatCard icon={LayoutDashboard} label="Active Events" value={metrics.activeEvents} colorIdx={1} />
          <StatCard icon={Users} label="Total Capacity" value={metrics.totalCapacity} colorIdx={2} />
          <StatCard icon={Users} label="Registrations" value={metrics.totalRegistrations} colorIdx={3} />
        </div>

        {/* Charts */}
        {!loading && events.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm mb-8">
            <h3 className="font-display font-semibold text-lg text-stone-800 mb-6">Registration Analytics (Top 8 Recent)</h3>
            <div className="h-[300px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e5e0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9a958f', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9a958f', fontSize: 12, fontWeight: 500}} />
                  <Tooltip cursor={{fill: '#f5f3ef'}} contentStyle={{borderRadius: '12px', border: '1px solid #e8e5e0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontWeight: 500}} />
                  <Bar dataKey="regs" name="Registered" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="cap" name="Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h3 className="font-display font-semibold text-lg text-stone-800">All Events Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-stone-100 text-xs uppercase tracking-wider text-stone-400">
                  <th className="px-6 py-4 font-semibold">Event Name</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Filled</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} columns={6} />)
                ) : events.map(event => (
                  <tr key={event.event_id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-stone-800 line-clamp-1">{event.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5 max-w-[200px] truncate font-medium">{event.venue}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap font-medium">
                      {new Date(event.date).toLocaleDateString()}
                      {event.time && <span className="block text-[11px] text-stone-400 mt-0.5">{event.time.slice(0,5)}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider">
                        {event.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${
                        event.status === 'upcoming' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        event.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        event.status === 'completed' ? 'bg-stone-50 text-stone-500 border-stone-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center bg-stone-100 text-stone-700 text-[11px] font-bold px-2 py-1 rounded">
                        {event.current_participants || 0} / {event.max_participants}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(event)} className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal({ open: true, eventId: event.event_id, eventName: event.name })} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, eventId: null, eventName: '' })}
        title="Delete Event" icon={Trash2} iconBg="bg-rose-100" iconColor="text-rose-600"
        actions={<div className="flex w-full gap-3 justify-end"><Button variant="ghost" onClick={() => setDeleteModal({ open: false, eventId: null, eventName: '' })}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Yes, Delete event</Button></div>}
      >
        <p className="text-stone-600 font-medium">Are you sure you want to delete <strong className="text-stone-900">{deleteModal.eventName}</strong>? This action will remove all registrations and cannot be undone.</p>
      </Modal>

      {/* Create/Edit Event Modal */}
      <Modal 
        isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Event" : "Create New Event"} icon={editingId ? Pencil : Plus}
        actions={
          <div className="w-full flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-br from-indigo-800 to-indigo-700 shadow-glow-indigo" onClick={handleSubmit}>{editingId ? "Save Changes" : "Publish Event"}</Button>
          </div>
        }
      >
        <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 resize-none font-medium text-stone-600" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Date</label>
              <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Time</label>
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-600" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Venue</label>
              <input type="text" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Category</label>
              <select value={form.category_name} onChange={e => setForm({...form, category_name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-700">
                {['Music', 'Dance', 'Tech', 'Art', 'Sports', 'Drama', 'Literary', 'Photography', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Max Participants</label>
              <input type="number" min="1" required value={form.max_participants} onChange={e => setForm({...form, max_participants: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Prize Pool</label>
              <input type="text" value={form.prize_pool} onChange={e => setForm({...form, prize_pool: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-600 placeholder:text-stone-400" placeholder="e.g. 50000" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-700">
                {['upcoming', 'ongoing', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminDashboard;
