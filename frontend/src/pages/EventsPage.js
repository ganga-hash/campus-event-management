import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CalendarDays, ArrowUpDown } from 'lucide-react';
import { getEvents, registerForEvent, applyVolunteer, getMyRegistrations, getMyAssignments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import Toast from '../components/ui/Toast';

const CATEGORIES = ['All', 'Music', 'Dance', 'Tech', 'Art', 'Sports', 'Drama', 'Literary', 'Photography'];
const STATUSES = ['All', 'upcoming', 'ongoing', 'completed'];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('date');
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  
  const { user } = useAuth();
  const [userRegs, setUserRegs] = useState({});
  const [userVols, setUserVols] = useState({});

  const showToast = (type, message) => setToast({ show: true, type, message });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getEvents();
        setEvents(res.data);
        if (user) {
          const [regs, vols] = await Promise.all([getMyRegistrations(), getMyAssignments()]);
          const regMap = {}; const volMap = {};
          regs.data.forEach(r => { if (r.status !== 'cancelled') regMap[r.event_id] = true; });
          vols.data.forEach(v => { volMap[v.event_id] = true; });
          setUserRegs(regMap); setUserVols(volMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleRegister = async (eventId) => {
    try {
      if (!user) { showToast('error', 'Please login to register'); return; }
      await registerForEvent(eventId);
      setUserRegs(p => ({ ...p, [eventId]: true }));
      setEvents(evs => evs.map(e => e.event_id === eventId ? { ...e, current_participants: (e.current_participants ?? 0) + 1 } : e));
      showToast('success', 'Successfully registered!');
    } catch (err) { showToast('error', err.response?.data?.message || 'Registration failed'); }
  };

  const handleVolunteer = async (eventId) => {
    try {
      if (!user) { showToast('error', 'Please login to volunteer'); return; }
      await applyVolunteer({ event_id: eventId, role: 'Any / Flexible', availability: 'Flexible', skills: '' });
      setUserVols(p => ({ ...p, [eventId]: true }));
      showToast('success', 'Volunteer application submitted!');
    } catch (err) { showToast('error', err.response?.data?.message || 'Application failed'); }
  };

  const filtered = useMemo(() => {
    return events
      .filter(e => category === 'All' || e.category_name === category)
      .filter(e => status === 'All' || e.status === status)
      .filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || (e.description && e.description.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => {
        if (sort === 'date') return new Date(a.date) - new Date(b.date);
        if (sort === 'capacity') {
          const aFull = (a.current_participants ?? 0) / a.max_participants;
          const bFull = (b.current_participants ?? 0) / b.max_participants;
          return aFull - bFull;
        }
        return 0;
      });
  }, [events, category, status, search, sort]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <Toast {...toast} onClose={() => setToast(p => ({ ...p, show: false }))} />

      {/* Header */}
      <div className="bg-white border-b border-stone-200 pt-8 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-stone-900 tracking-tight mb-4">
              Explore Events
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed">
              Discover opportunities to showcase your talent, learn new skills, and connect with peers across campus.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* Filters Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-glass border border-stone-200/50 p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input 
                type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium placeholder:text-stone-400"
              />
            </div>

            {/* Sort & Status Dropdowns */}
            <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
              <div className="relative">
                <select 
                  value={status} onChange={e => setStatus(e.target.value)}
                  className="pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 appearance-none focus:outline-none focus:border-indigo-600 transition-colors w-full bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
              
              <div className="relative">
                <select 
                  value={sort} onChange={e => setSort(e.target.value)}
                  className="pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 appearance-none focus:outline-none focus:border-indigo-600 transition-colors w-full bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
                >
                  <option value="date">Sort by Date</option>
                  <option value="capacity">Sort by Availability</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 relative px-4 py-2 text-sm font-medium rounded-xl transition-colors ${category === cat ? 'text-indigo-800' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'}`}
              >
                <span className="relative z-10">{cat}</span>
                {category === cat && (
                  <motion.div layoutId="cat-indicator" className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-xl z-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Event Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState 
            icon={CalendarDays} title="No events found" 
            description="We couldn't find any events matching your current filters. Try adjusting your search or category."
            action={<button onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); }} className="text-indigo-600 font-medium hover:text-indigo-800">Clear all filters</button>}
          />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map(event => (
                <EventCard 
                  key={event.event_id} 
                  event={event} 
                  onRegister={user && user.role !== 'admin' ? handleRegister : null} 
                  onVolunteer={user && user.role !== 'admin' ? handleVolunteer : null}
                  isRegistered={!!userRegs[event.event_id]}
                  isVolunteer={!!userVols[event.event_id]}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
