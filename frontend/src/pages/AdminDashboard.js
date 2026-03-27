import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, CalendarDays, Users, Pencil, Trash2, Plus, CheckCircle, XCircle, DollarSign, Link as LinkIcon } from 'lucide-react';
import { 
  getEvents, createEvent, updateEvent, deleteEvent,
  getAllRegistrations, adminUpdateRegistrationStatus, adminDeleteRegistration,
  getAllAssignments, adminUpdateAssignmentStatus, adminDeleteAssignment,
  getSponsors, addSponsor, linkSponsorToEvent, addSponsorContribution, deleteSponsor
} from '../services/api';
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
  const [activeTab, setActiveTab] = useState('events'); // events, registrations, volunteers
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '', type: '', hasContributions: false });
  const [sponsorDeleteAcknowledged, setSponsorDeleteAcknowledged] = useState(false);
  
  const [sponsorModal, setSponsorModal] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({ name: '', contact_email: '', contact_phone: '', tier: 'silver', website: '', logo_url: '' });
  const [contributionModal, setContributionModal] = useState({ open: false, sponsor_id: null, sponsorName: '' });
  const [contributionForm, setContributionForm] = useState({ event_id: '', additional_amount: '' });
  const [linkModal, setLinkModal] = useState({ open: false, event_id: null, eventName: '' });
  const [linkForm, setLinkForm] = useState({ sponsor_id: '', sponsorship_amount: '' });
  
  const initialForm = { name: '', description: '', date: '', time: '', venue: '', category_name: 'General', event_type: 'open', max_participants: 100, prize_pool: '', status: 'upcoming' };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const showToast = (type, message) => setToast({ show: true, type, message });

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, title: '', type: '', hasContributions: false });
    setSponsorDeleteAcknowledged(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [evRes, regRes, volRes, spRes] = await Promise.all([
        getEvents(), getAllRegistrations(), getAllAssignments(), getSponsors()
      ]);
      setEvents(evRes.data);
      setRegistrations(regRes.data);
      setAssignments(volRes.data);
      setSponsors(spRes.data);
    } catch (err) {
      showToast('error', 'Failed to load data');
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
      event_type: ev.event_type || 'open', max_participants: ev.max_participants, prize_pool: ev.prize_pool || '', status: ev.status
    });
    setEditingId(ev.event_id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteModal.type === 'event') {
        await deleteEvent(deleteModal.id);
        showToast('success', 'Event deleted successfully');
      } else if (deleteModal.type === 'registration') {
        await adminDeleteRegistration(deleteModal.id);
        showToast('success', 'Registration deleted successfully');
      } else if (deleteModal.type === 'assignment') {
        await adminDeleteAssignment(deleteModal.id);
        showToast('success', 'Volunteer assignment deleted successfully');
      } else if (deleteModal.type === 'sponsor') {
        if (deleteModal.hasContributions && !sponsorDeleteAcknowledged) {
          showToast('error', 'Please confirm force delete for sponsors with contributions');
          return;
        }
        await deleteSponsor(deleteModal.id, deleteModal.hasContributions && sponsorDeleteAcknowledged);
        showToast('success', 'Sponsor deleted successfully');
      }
      closeDeleteModal();
      loadData();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  const updateRegStatus = async (id, status) => {
    try {
      await adminUpdateRegistrationStatus(id, status);
      showToast('success', `Registration ${status}`);
      loadData();
    } catch (err) { showToast('error', 'Update failed'); }
  };

  const updateVolStatus = async (id, status) => {
    try {
      await adminUpdateAssignmentStatus(id, status);
      showToast('success', `Volunteer ${status}`);
      loadData();
    } catch (err) { showToast('error', 'Update failed'); }
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSponsor(sponsorForm);
      showToast('success', 'Sponsor added successfully');
      setSponsorModal(false);
      setSponsorForm({ name: '', contact_email: '', contact_phone: '', tier: 'silver', website: '', logo_url: '' });
      loadData();
    } catch (err) { showToast('error', 'Failed to add sponsor'); }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      await linkSponsorToEvent({ event_id: linkModal.event_id, sponsor_id: linkForm.sponsor_id, sponsorship_amount: linkForm.sponsorship_amount });
      showToast('success', 'Sponsor linked to event');
      setLinkModal({ open: false, event_id: null, eventName: '' });
      setLinkForm({ sponsor_id: '', sponsorship_amount: '' });
      loadData();
    } catch (err) { showToast('error', 'Failed to link sponsor'); }
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSponsorContribution({
        event_id: contributionForm.event_id,
        sponsor_id: contributionModal.sponsor_id,
        additional_amount: contributionForm.additional_amount
      });
      showToast('success', 'Contribution added successfully');
      setContributionModal({ open: false, sponsor_id: null, sponsorName: '' });
      setContributionForm({ event_id: '', additional_amount: '' });
      loadData();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to add contribution');
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
        <div className="p-4 space-y-2 flex-1">
          {[
            { id: 'events', label: 'Dashboard & Events', icon: LayoutDashboard },
            { id: 'registrations', label: 'Registrations', icon: Users },
            { id: 'volunteers', label: 'Volunteers', icon: CalendarDays },
            { id: 'sponsors', label: 'Sponsors', icon: DollarSign }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold text-sm ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-800' : 'text-stone-600 hover:bg-stone-50'}`}>
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-stone-400'}`} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden bg-white border-b border-stone-200 sticky top-16 z-30 px-4 py-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2">
          {['events', 'registrations', 'volunteers', 'sponsors'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === t ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' : 'bg-stone-50 text-stone-600 border border-stone-200'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-stone-900">Dashboard Overview</h1>
                <p className="text-stone-500 font-medium mt-1">Manage events and monitor analytics.</p>
              </div>
              <Button onClick={() => { setForm(initialForm); setEditingId(null); setModalOpen(true); }} className="shrink-0 gap-2 font-medium">
                <Plus className="w-4 h-4" /> New Event
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={CalendarDays} label="Total Events" value={metrics.totalEvents} colorIdx={0} />
              <StatCard icon={LayoutDashboard} label="Active Events" value={metrics.activeEvents} colorIdx={1} />
              <StatCard icon={Users} label="Total Capacity" value={metrics.totalCapacity} colorIdx={2} />
              <StatCard icon={Users} label="Registrations" value={metrics.totalRegistrations} colorIdx={3} />
            </div>

            {!loading && events.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
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

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/50">
                <h3 className="font-display font-semibold text-lg text-stone-800">All Events Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-stone-100 text-xs uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4 font-semibold">Event Name</th>
                      <th className="px-6 py-4 font-semibold">Date & Time</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
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
                          <p className="text-xs text-stone-500 mt-0.5 truncate font-medium">{event.category_name}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap font-medium">
                          {new Date(event.date).toLocaleDateString()}
                          {event.time && <span className="block text-[11px] text-stone-400 mt-0.5">{event.time.slice(0,5)}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider ${event.event_type === 'approval_required' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {event.event_type}
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
                            <button onClick={() => setLinkModal({ open: true, event_id: event.event_id, eventName: event.name })} className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border max-sm:hidden" title="Link Sponsor"><LinkIcon className="w-4 h-4" /></button>
                            <button onClick={() => handleEditClick(event)} className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => { setSponsorDeleteAcknowledged(false); setDeleteModal({ open: true, id: event.event_id, title: event.name, type: 'event', hasContributions: false }); }} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-stone-900">Manage Registrations</h1>
              <p className="text-stone-500 font-medium mt-1">Accept or reject participant applications.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-stone-100 text-xs uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Event</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      [...Array(5)].map((_, i) => <SkeletonRow key={i} columns={4} />)
                    ) : registrations.map(reg => (
                      <tr key={reg.registration_id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-stone-800">{reg.student_name}</p>
                          <p className="text-xs text-stone-500 font-medium">{reg.email}</p>
                        </td>
                        <td className="px-6 py-4"><span className="font-medium text-stone-700 text-sm whitespace-nowrap">{reg.event_name}</span></td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${
                            reg.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            reg.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            reg.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-stone-50 text-stone-500 border-stone-200'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {reg.status === 'pending' && (
                              <>
                                <button onClick={() => updateRegStatus(reg.registration_id, 'confirmed')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                                <button onClick={() => updateRegStatus(reg.registration_id, 'rejected')} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                              </>
                            )}
                            <button onClick={() => { setSponsorDeleteAcknowledged(false); setDeleteModal({ open: true, id: reg.registration_id, title: `registration by ${reg.student_name}`, type: 'registration', hasContributions: false }); }} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Volunteers Tab */}
        {activeTab === 'volunteers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-stone-900">Manage Volunteers</h1>
              <p className="text-stone-500 font-medium mt-1">Accept or reject volunteer assignments.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-stone-100 text-xs uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4 font-semibold">Volunteer</th>
                      <th className="px-6 py-4 font-semibold">Event & Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      [...Array(5)].map((_, i) => <SkeletonRow key={i} columns={4} />)
                    ) : assignments.map(asn => (
                      <tr key={asn.assignment_id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-stone-800">{asn.volunteer_name}</p>
                          <p className="text-xs text-stone-500 font-medium">{asn.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-stone-700 text-sm">{asn.event_name}</p>
                          <p className="text-xs text-stone-500 font-medium">{asn.role}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${
                            asn.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            asn.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            asn.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-stone-50 text-stone-500 border-stone-200'
                          }`}>
                            {asn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {asn.status === 'pending' && (
                              <>
                                <button onClick={() => updateVolStatus(asn.assignment_id, 'accepted')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                                <button onClick={() => updateVolStatus(asn.assignment_id, 'rejected')} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                              </>
                            )}
                            <button onClick={() => { setSponsorDeleteAcknowledged(false); setDeleteModal({ open: true, id: asn.assignment_id, title: `volunteer ${asn.volunteer_name}`, type: 'assignment', hasContributions: false }); }} className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sponsors Tab */}
        {activeTab === 'sponsors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-stone-900">Manage Sponsors</h1>
                <p className="text-stone-500 font-medium mt-1">Add sponsors and track their contributions.</p>
              </div>
              <Button onClick={() => setSponsorModal(true)} className="shrink-0 gap-2 font-medium bg-emerald-700 hover:bg-emerald-800 shadow-glow-emerald">
                <Plus className="w-4 h-4" /> Add Sponsor
              </Button>
            </div>
            
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-stone-100 text-xs uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4 font-semibold">Sponsor Name</th>
                      <th className="px-6 py-4 font-semibold">Tier</th>
                      <th className="px-6 py-4 font-semibold text-center">Events Sponsored</th>
                      <th className="px-6 py-4 font-semibold text-right">Total Contribution</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      [...Array(3)].map((_, i) => <SkeletonRow key={i} columns={5} />)
                    ) : sponsors.map(s => (
                      <tr key={s.sponsor_id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-stone-800">{s.sponsor_name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            s.tier === 'platinum' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                            s.tier === 'gold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            s.tier === 'silver' ? 'bg-stone-100 text-stone-500 border-stone-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>{s.tier}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-stone-600">{s.events_sponsored || 0}</td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">₹{s.total_contribution || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setContributionModal({ open: true, sponsor_id: s.sponsor_id, sponsorName: s.sponsor_name });
                                setContributionForm({ event_id: '', additional_amount: '' });
                              }}
                              className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Add Contribution"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSponsorDeleteAcknowledged(false);
                                setDeleteModal({
                                  open: true,
                                  id: s.sponsor_id,
                                  title: s.sponsor_name,
                                  type: 'sponsor',
                                  hasContributions: (s.events_sponsored || 0) > 0 || Number(s.total_contribution || 0) > 0
                                });
                              }}
                              className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
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
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModal.open} onClose={closeDeleteModal}
        title={`Delete ${deleteModal.type}`} icon={Trash2} iconBg="bg-rose-100" iconColor="text-rose-600"
        actions={<div className="flex w-full gap-3 justify-end"><Button variant="ghost" onClick={closeDeleteModal}>Cancel</Button><Button variant="danger" disabled={deleteModal.type === 'sponsor' && deleteModal.hasContributions && !sponsorDeleteAcknowledged} onClick={handleDelete}>Yes, Delete</Button></div>}
      >
        <div className="space-y-3">
          <p className="text-stone-600 font-medium">Are you sure you want to delete <strong className="text-stone-900">{deleteModal.title}</strong>? This action cannot be undone.</p>
          {deleteModal.type === 'sponsor' && deleteModal.hasContributions && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-sm font-semibold text-rose-700">This sponsor has active contributions linked to events.</p>
              <label className="mt-2 flex items-start gap-2 text-sm text-rose-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={sponsorDeleteAcknowledged}
                  onChange={(e) => setSponsorDeleteAcknowledged(e.target.checked)}
                />
                I understand this will remove sponsor links and contribution records from associated events.
              </label>
            </div>
          )}
        </div>
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
        <form id="event-form" onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto px-1 scrollbar-none">
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
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Type</label>
              <select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-700">
                <option value="open">Open (Auto-confirm)</option>
                <option value="approval_required">Selected Participants (Approval Required)</option>
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
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-700">
                {['upcoming', 'ongoing', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Sponsor Modals */}
      <Modal 
        isOpen={sponsorModal} onClose={() => setSponsorModal(false)}
        title="Add New Sponsor" icon={DollarSign}
        actions={
          <div className="w-full flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSponsorModal(false)}>Cancel</Button>
            <Button className="bg-emerald-700 shadow-glow-emerald hover:bg-emerald-800" onClick={handleSponsorSubmit}>Save Sponsor</Button>
          </div>
        }
      >
        <form onSubmit={handleSponsorSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Sponsor Name</label>
            <input type="text" required value={sponsorForm.name} onChange={e => setSponsorForm({...sponsorForm, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Tier</label>
              <select value={sponsorForm.tier} onChange={e => setSponsorForm({...sponsorForm, tier: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-medium text-stone-700">
                {['platinum', 'gold', 'silver', 'bronze'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Website (optional)</label>
              <input type="url" value={sponsorForm.website} onChange={e => setSponsorForm({...sponsorForm, website: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-medium placeholder:text-stone-400" placeholder="https://" />
            </div>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={linkModal.open} onClose={() => setLinkModal({ open: false, event_id: null, eventName: '' })}
        title={`Link Sponsor to ${linkModal.eventName}`} icon={LinkIcon}
        actions={
          <div className="w-full flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setLinkModal({ open: false, event_id: null, eventName: '' })}>Cancel</Button>
            <Button className="bg-indigo-700 shadow-glow-indigo hover:bg-indigo-800" onClick={handleLinkSubmit}>Link Sponsor</Button>
          </div>
        }
      >
        <form onSubmit={handleLinkSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Select Sponsor</label>
            <select required value={linkForm.sponsor_id} onChange={e => setLinkForm({...linkForm, sponsor_id: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-700">
              <option value="" disabled>Choose a Sponsor...</option>
              {sponsors.map(s => <option key={s.sponsor_id} value={s.sponsor_id}>{s.sponsor_name} ({s.tier})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Sponsorship Amount (₹)</label>
            <input type="number" min="0" required value={linkForm.sponsorship_amount} onChange={e => setLinkForm({...linkForm, sponsorship_amount: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium" placeholder="e.g. 15000" />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={contributionModal.open}
        onClose={() => setContributionModal({ open: false, sponsor_id: null, sponsorName: '' })}
        title={`Add Contribution: ${contributionModal.sponsorName}`}
        icon={DollarSign}
        actions={
          <div className="w-full flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setContributionModal({ open: false, sponsor_id: null, sponsorName: '' })}>Cancel</Button>
            <Button className="bg-indigo-700 shadow-glow-indigo hover:bg-indigo-800" onClick={handleContributionSubmit}>Add Amount</Button>
          </div>
        }
      >
        <form onSubmit={handleContributionSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Select Event</label>
            <select
              required
              value={contributionForm.event_id}
              onChange={(e) => setContributionForm({ ...contributionForm, event_id: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-stone-700"
            >
              <option value="" disabled>Choose an Event...</option>
              {events.map(ev => (
                <option key={ev.event_id} value={ev.event_id}>{ev.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Additional Amount (₹)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={contributionForm.additional_amount}
              onChange={(e) => setContributionForm({ ...contributionForm, additional_amount: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium"
              placeholder="e.g. 5000"
            />
            <p className="mt-1 text-xs text-stone-500 font-medium">Use this to increase an existing sponsor contribution for the selected event.</p>
          </div>
        </form>
      </Modal>

    </div>
  );
};
export default AdminDashboard;
