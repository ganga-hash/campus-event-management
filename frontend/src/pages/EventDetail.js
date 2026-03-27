import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, Users, ArrowLeft, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { getEventById, registerForEvent, applyVolunteer, getMyRegistrations, getMyAssignments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatRupees } from '../utils/currency';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

const CAT_THEMES = {
  Music: { from: 'from-pink-500', to: 'to-rose-600', text: 'text-rose-600', bg: 'bg-rose-50', icon: '🎵' },
  Dance: { from: 'from-violet-500', to: 'to-purple-600', text: 'text-violet-600', bg: 'bg-violet-50', icon: '💃' },
  Tech: { from: 'from-blue-600', to: 'to-indigo-600', text: 'text-blue-600', bg: 'bg-blue-50', icon: '💻' },
  Art: { from: 'from-amber-500', to: 'to-orange-500', text: 'text-amber-600', bg: 'bg-amber-50', icon: '🎨' },
  Sports: { from: 'from-emerald-500', to: 'to-green-600', text: 'text-emerald-600', bg: 'bg-emerald-50', icon: '⚽' },
  General: { from: 'from-indigo-400', to: 'to-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50', icon: '🎪' }
};

const STATUS_STYLES = {
  upcoming: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', label: 'Upcoming' },
  ongoing: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Live Now' },
  completed: { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200', label: 'Completed' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancelled' }
};

const InfoCard = ({ icon: Icon, label, value, theme }) => (
  <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 group hover:border-stone-300 transition-colors shadow-sm">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">{label}</p>
      <p className="text-sm sm:text-base font-semibold text-stone-800 truncate">{value}</p>
    </div>
  </div>
);

const EventDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const [roleModal, setRoleModal] = useState(false);
  const [volForm, setVolForm] = useState({ role: 'Any / Flexible', availability: 'All 3 Days', skills: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);

  const showToast = (type, message) => setToast({ show: true, type, message });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const eventRes = await getEventById(id);
        setEvent(eventRes.data);

        if (user) {
          const [regRes, volRes] = await Promise.all([getMyRegistrations(), getMyAssignments()]);
          const eventIdNum = Number(id);
          setIsRegistered(regRes.data.some(r => Number(r.event_id) === eventIdNum && r.status !== 'cancelled'));
          setIsVolunteer(volRes.data.some(v => Number(v.event_id) === eventIdNum));
        } else {
          setIsRegistered(false);
          setIsVolunteer(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  const handleParticipate = async () => {
    try {
      const res = await registerForEvent(event.event_id);
      setIsRegistered(true);
      setEvent(prev => ({ ...prev, current_participants: res.data.current_participants ?? (prev.current_participants + 1) }));
      showToast('success', `Registered for ${event.name}!`);
    } catch (err) { showToast('error', err.response?.data?.message || 'Registration failed'); }
  };

  const handleVolunteer = async () => {
    try {
      await applyVolunteer({ event_id: event.event_id, ...volForm });
      setIsVolunteer(true); setRoleModal(false);
      showToast('success', `Volunteer application submitted!`);
    } catch (err) { showToast('error', err.response?.data?.message || 'Application failed'); setRoleModal(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="h-6 w-24 bg-stone-200 rounded-md animate-pulse mb-8" />
      <div className="h-48 bg-stone-200 rounded-3xl animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-stone-200 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-stone-50">
      <span className="text-6xl mb-4 block">😕</span>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Event not found</h2>
      <Button variant="ghost" onClick={() => navigate('/events')}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Events</Button>
    </div>
  );

  const theme = CAT_THEMES[event.category_name] || CAT_THEMES.General;
  const statusTheme = STATUS_STYLES[event.status] || STATUS_STYLES.upcoming;
  const filled = event.current_participants || 0;
  const cap = event.max_participants;
  const full = filled >= cap;
  const pct = Math.min((filled / cap) * 100, 100);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <Toast {...toast} onClose={() => setToast(p => ({ ...p, show: false }))} />

      {/* Hero Header */}
      <div className={`relative pt-8 pb-16 overflow-hidden bg-gradient-to-br ${theme.bg} to-white border-b border-stone-200 shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button onClick={() => navigate('/events')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white text-sm font-semibold text-stone-600 transition-colors mb-6 backdrop-blur-sm border border-stone-200/50">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-sm`}>
              {event.category_name || 'General'}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${statusTheme.bg} ${statusTheme.text} ${statusTheme.border}`}>
              {statusTheme.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-stone-900 tracking-tight leading-tight mb-4 pr-16">
            {event.name}
          </h1>

          {event.description && (
            <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
              {event.description}
            </p>
          )}

          <div className={`hidden md:flex absolute top-12 md:top-1/2 md:-translate-y-1/2 right-4 md:right-8 w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white shadow-xl rotate-3 items-center justify-center text-4xl md:text-5xl border border-stone-100`}>
            {theme.icon}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <InfoCard icon={Calendar} label="Date" theme={theme} value={new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
          <InfoCard icon={Clock} label="Time" theme={theme} value={event.time ? String(event.time).slice(0, 5) : 'TBD'} />
          <InfoCard icon={MapPin} label="Venue" theme={theme} value={event.venue || 'TBD'} />
          <InfoCard icon={Trophy} label="Prize Pool" theme={{bg: 'bg-amber-50', text: 'text-amber-600'}} value={event.prize_pool ? formatRupees(event.prize_pool) : 'Certificate'} />
          <InfoCard icon={Users} label="Capacity" theme={theme} value={`${cap} max`} />
          <InfoCard icon={Info} label="Status" theme={{bg: statusTheme.bg, text: statusTheme.text}} value={statusTheme.label} />
        </div>

        {/* Capacity Bar */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-stone-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-stone-400" />
              Registration Progress
            </h3>
            <span className={`text-sm font-bold ${full ? 'text-rose-600' : 'text-emerald-600'}`}>
              {full ? 'Event Full' : `${cap - filled} spots remaining`}
            </span>
          </div>
          <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden mb-3">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, type: "spring" }}
              className={`h-full rounded-full ${full ? 'bg-rose-500' : `bg-gradient-to-r ${theme.from} ${theme.to}`}`} 
            />
          </div>
          <p className="text-right text-xs font-semibold text-stone-400 uppercase tracking-wide">
            {filled} / {cap} Registered ({Math.round(pct)}%)
          </p>
        </div>

        {/* Action Panel */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          {!user ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 text-2xl shadow-inner">🔐</div>
              <h3 className="text-xl font-display font-semibold text-stone-900 mb-2">Sign in to participate</h3>
              <p className="text-stone-500 mb-6 font-medium">Create an account or sign in to register for this event.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={() => navigate('/login')}>Sign In</Button>
                <Button variant="secondary" onClick={() => navigate('/register')}>Create Account</Button>
              </div>
            </div>
          ) : (
            <div>
              {/* Status Banners */}
              <AnimatePresence>
                {isRegistered && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 text-xl shadow-sm">🎫</div>
                      <div>
                        <h4 className="font-semibold text-emerald-800">You're registered as a Participant!</h4>
                        <p className="text-sm text-emerald-600 mt-0.5 font-medium">Your spot is confirmed. See you there!</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {isVolunteer && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 text-xl shadow-sm">🙋</div>
                      <div>
                        <h4 className="font-semibold text-indigo-800">Volunteer application submitted!</h4>
                        <p className="text-sm text-indigo-600 mt-0.5 font-medium">We'll confirm your shift soon.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {full && !isRegistered && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
                      <AlertCircle className="shrink-0 text-rose-600" />
                      <p className="font-medium text-sm">Participant spots are full — you can still volunteer!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {user?.role !== 'admin' && (
                <>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 pb-2 border-b border-stone-100">Ways to Join</h4>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {!full && !isRegistered && !isVolunteer && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleParticipate}
                        className={`bg-white border-2 border-stone-100 rounded-2xl p-5 cursor-pointer hover:border-transparent hover:shadow-glow-indigo transition-all group`}
                      >
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">🎫</div>
                        <h4 className="font-bold text-stone-800 mb-1">Participate</h4>
                        <p className="text-sm text-stone-500 font-medium">Compete and win prizes. Your name goes on the scoreboard.</p>
                      </motion.div>
                    )}
                    
                    {!isVolunteer && !isRegistered && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setRoleModal(true)}
                        className={`bg-white border-2 border-stone-100 rounded-2xl p-5 cursor-pointer hover:border-transparent hover:shadow-glow-emerald transition-all group`}
                      >
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">🙋</div>
                        <h4 className="font-bold text-stone-800 mb-1">Volunteer</h4>
                        <p className="text-sm text-stone-500 font-medium">Help organise. Get a certificate and volunteer hours.</p>
                      </motion.div>
                    )}
                  </div>
                  
                  {(isRegistered || isVolunteer) && (
                    <p className="text-sm text-stone-400 mt-6 text-center font-medium bg-stone-50 py-3 rounded-xl border border-stone-100">You can only join this event in one role.</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={roleModal} 
        onClose={() => setRoleModal(false)} 
        title="Volunteer Application"
        icon={Users}
        iconBg="bg-emerald-100" iconColor="text-emerald-600"
        actions={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="ghost" onClick={() => setRoleModal(false)}>Cancel</Button>
            <Button className="bg-gradient-to-br from-emerald-700 to-emerald-600 shadow-glow-emerald" onClick={handleVolunteer}>Submit Application</Button>
          </div>
        }
      >
        <p className="text-sm text-stone-600 mb-6 leading-relaxed font-medium">
          Tell us about yourself so we can place you in the right role for <strong className="text-stone-900">{event.name}</strong>.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Preferred Role</label>
            <select value={volForm.role} onChange={e => setVolForm({ ...volForm, role: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 hover:border-stone-300 font-medium text-stone-700">
              {['Any / Flexible', 'Event Coordinator', 'Registration Desk', 'Stage Management', 'Photography', 'First Aid'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Availability</label>
            <select value={volForm.availability} onChange={e => setVolForm({ ...volForm, availability: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 hover:border-stone-300 font-medium text-stone-700">
              {['All 3 Days', 'Day 1 only', 'Day 2 only', 'Day 3 only'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Skills / Experience (optional)</label>
            <input type="text" value={volForm.skills} onChange={e => setVolForm({ ...volForm, skills: e.target.value })} placeholder="e.g. Photography, crowd control" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 hover:border-stone-300 placeholder:text-stone-400 font-medium" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetail;
