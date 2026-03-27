import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Ticket, CheckCircle2, X } from 'lucide-react';
import { getMyRegistrations, getMyAssignments, cancelRegistration, deleteMyAssignment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkeletonRow from '../components/ui/SkeletonRow';
import EmptyState from '../components/ui/EmptyState';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const TABS = [
  { id: 'registrations', label: 'My Events', icon: Ticket },
  { id: 'volunteer', label: 'Volunteer Roles', icon: Users },
  { id: 'past', label: 'Past Events', icon: Calendar }
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registrations');
  const [regs, setRegs] = useState([]);
  const [vols, setVols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [cancelModal, setCancelModal] = useState({ open: false, regId: null, volId: null, eventName: '', type: '' });

  const showToast = (type, message) => setToast({ show: true, type, message });

  const loadData = async () => {
    setLoading(true);
    try {
      const [r, v] = await Promise.all([getMyRegistrations(), getMyAssignments()]);
      setRegs(r.data || []);
      setVols(v.data || []);
    } catch (err) {
      showToast('error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCancel = async () => {
    try {
      if (cancelModal.type === 'registration') {
        await cancelRegistration(cancelModal.regId);
        setRegs(regs.map(r => r.registration_id === cancelModal.regId ? { ...r, status: 'cancelled' } : r));
        showToast('success', 'Registration cancelled successfully');
      } else if (cancelModal.type === 'volunteer') {
        await deleteMyAssignment(cancelModal.volId);
        setVols(vols.filter(v => v.assignment_id !== cancelModal.volId));
        showToast('success', 'Volunteer role cancelled successfully');
      }
      setCancelModal({ open: false, regId: null, volId: null, eventName: '', type: '' });
    } catch (err) { showToast('error', 'Cancellation failed'); }
  };

  const activeRegs = regs.filter(r => r.status !== 'cancelled' && r.event_status !== 'completed');
  const pastRegs = regs.filter(r => r.event_status === 'completed' || r.status === 'cancelled');

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color.bg} ${color.text}`}>
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

      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-72 border-r border-stone-200 bg-white sticky top-16 h-[calc(100vh-64px)] p-6 z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-stone-900 mb-2">Dashboard</h2>
          <p className="text-stone-500 text-sm">Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>
        <div className="space-y-2 flex-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative group font-semibold text-sm ${isActive ? 'text-indigo-800' : 'text-stone-600 hover:bg-stone-50'}`}>
                {isActive && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-xl" />}
                <tab.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-indigo-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden bg-white border-b border-stone-200 sticky top-16 z-30 px-4 py-3 overflow-x-auto scrollbar-none">
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-800 border border-indigo-100' : 'bg-stone-50 text-stone-600 border border-stone-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
          <StatCard icon={Ticket} label="Upcoming Events" value={activeRegs.length} color={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }} />
          <StatCard icon={Users} label="Volunteer Roles" value={vols.length} color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }} />
          <StatCard icon={CheckCircle2} label="Completed" value={pastRegs.length} color={{ bg: 'bg-stone-100', text: 'text-stone-600' }} />
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
          <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/50">
            <h3 className="font-display font-semibold text-lg text-stone-800">
              {TABS.find(t => t.id === activeTab)?.label}
            </h3>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="p-0">
              {loading ? (
                <div className="w-full">
                  <table className="w-full"><tbody>{[...Array(3)].map((_, i) => <SkeletonRow key={i} columns={4} />)}</tbody></table>
                </div>
              ) : activeTab === 'registrations' && activeRegs.length === 0 ? (
                <EmptyState icon={Ticket} title="No upcoming events" description="You haven't registered for any upcoming events yet." action={<Button onClick={() => navigate('/events')}>Browse Events</Button>} />
              ) : activeTab === 'volunteer' && vols.length === 0 ? (
                <EmptyState icon={Users} title="No volunteer roles" description="You haven't applied for any volunteer roles yet." action={<Button onClick={() => navigate('/events')}>Find Opportunities</Button>} />
              ) : activeTab === 'past' && pastRegs.length === 0 ? (
                <EmptyState icon={Calendar} title="No past events" description="Your cancelled and completed events will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-stone-100 text-xs uppercase tracking-wider text-stone-400">
                        <th className="px-6 py-4 font-semibold">Event</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">{activeTab === 'volunteer' ? 'Role' : 'Status'}</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(activeTab === 'registrations' ? activeRegs : activeTab === 'volunteer' ? vols : pastRegs).map(item => (
                        <tr key={item.registration_id || item.assignment_id} className="hover:bg-stone-50 transition-colors group">
                          <td className="px-6 py-4">
                            <Link to={`/events/${item.event_id}`} className="font-semibold text-stone-800 hover:text-indigo-600 transition-colors line-clamp-1">{item.event_name}</Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                            {new Date(item.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            {activeTab === 'volunteer' ? (
                              <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                                item.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                item.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                item.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-stone-50 text-stone-500 border-stone-200'
                              }`}>
                                {item.status} ({item.role})
                              </span>
                            ) : (
                              <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                                item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                item.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                item.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-stone-50 text-stone-500 border-stone-200'
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {activeTab === 'registrations' && (item.status === 'confirmed' || item.status === 'pending') ? (
                              <button onClick={() => setCancelModal({ open: true, regId: item.registration_id, eventName: item.event_name, type: 'registration' })} className="text-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors md:opacity-0 md:group-hover:opacity-100">
                                Cancel
                              </button>
                            ) : activeTab === 'volunteer' && (item.status === 'accepted' || item.status === 'pending') ? (
                              <button onClick={() => setCancelModal({ open: true, volId: item.assignment_id, eventName: item.event_name, type: 'volunteer' })} className="text-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors md:opacity-0 md:group-hover:opacity-100">
                                Cancel
                              </button>
                            ) : (
                              <Link to={`/events/${item.event_id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                View
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Modal 
        isOpen={cancelModal.open} onClose={() => setCancelModal({ open: false, regId: null, volId: null, eventName: '', type: '' })}
        title={`Cancel ${cancelModal.type === 'registration' ? 'Registration' : 'Volunteer Role'}`} icon={X} iconBg="bg-rose-100" iconColor="text-rose-600"
        actions={<div className="flex justify-end gap-3 w-full"><Button variant="ghost" onClick={() => setCancelModal({ open: false, regId: null, volId: null, eventName: '', type: '' })}>Keep It</Button><Button variant="danger" onClick={handleCancel}>Yes, Cancel</Button></div>}
      >
        <p className="text-stone-600 font-medium">Are you sure you want to cancel your {cancelModal.type} for <strong className="text-stone-900">{cancelModal.eventName}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};
export default StudentDashboard;
