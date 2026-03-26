import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRupees } from '../utils/currency';

const CAT_COLORS = {
  Music: { from: 'from-pink-500', to: 'to-rose-600', text: 'text-rose-600', bg: 'bg-rose-50' },
  Dance: { from: 'from-violet-500', to: 'to-purple-600', text: 'text-violet-600', bg: 'bg-violet-50' },
  Tech: { from: 'from-blue-600', to: 'to-indigo-600', text: 'text-blue-600', bg: 'bg-blue-50' },
  Art: { from: 'from-amber-500', to: 'to-orange-500', text: 'text-amber-600', bg: 'bg-amber-50' },
  Sports: { from: 'from-emerald-500', to: 'to-green-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  Drama: { from: 'from-red-500', to: 'to-rose-600', text: 'text-red-600', bg: 'bg-red-50' },
  Literary: { from: 'from-cyan-500', to: 'to-blue-500', text: 'text-cyan-600', bg: 'bg-cyan-50' },
  Photography: { from: 'from-fuchsia-500', to: 'to-purple-600', text: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
  General: { from: 'from-indigo-400', to: 'to-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50' }
};

const CAT_ICONS = { Music: '🎵', Dance: '💃', Tech: '💻', Art: '🎨', Sports: '⚽', Drama: '🎭', Literary: '📖', Photography: '📷', General: '🎪' };

const STATUS_STYLES = {
  upcoming: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', label: 'Upcoming' },
  ongoing: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Live Now' },
  completed: { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200', label: 'Completed' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancelled' }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
};

const EventCard = ({ event, onRegister, onVolunteer, isRegistered, isVolunteer, showActions = true }) => {
  const navigate = useNavigate();
  const catTheme = CAT_COLORS[event.category_name] || CAT_COLORS.General;
  const icon = CAT_ICONS[event.category_name] || CAT_ICONS.General;
  
  const filled = event.current_participants ?? event.registered_count ?? 0;
  const cap = event.max_participants;
  const full = filled >= cap;
  const pct = Math.min((filled / cap) * 100, 100);
  const statusTheme = STATUS_STYLES[event.status] || STATUS_STYLES.upcoming;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => navigate(`/events/${event.event_id}`)}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full cursor-pointer relative group transition-shadow hover:shadow-card-hover"
    >
      {/* Top Accent Gradient */}
      <div className={`absolute top-0 right-0 h-1.5 w-3/5 bg-gradient-to-r ${catTheme.from} ${catTheme.to} rounded-bl-sm opacity-80 group-hover:opacity-100 group-hover:w-full transition-all duration-300`} />

      {/* Category Icon Floater */}
      <div className={`absolute top-4 right-4 w-9 h-9 rounded-xl ${catTheme.bg} flex items-center justify-center text-lg shadow-sm border border-white`}>
        {icon}
      </div>

      <div className="p-5 flex-1 flex flex-col pt-6 z-10">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 pr-10">
          <span className={`text-[10px] uppercase tracking-wider font-bold ${catTheme.text}`}>
            {event.category_name || 'General'}
          </span>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusTheme.bg} ${statusTheme.text} ${statusTheme.border}`}>
            {statusTheme.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-stone-900 text-lg leading-snug mb-4 line-clamp-2">
          {event.name}
        </h3>

        {/* Meta Info */}
        <div className="space-y-2 mb-5 flex-1">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              {event.time ? ` · ${String(event.time).slice(0, 5)}` : ''}
            </span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          {event.prize_pool && event.prize_pool !== 'N/A' && (
            <div className={`flex items-center gap-2 font-medium text-sm mt-1 ${catTheme.text}`}>
              <Trophy className="w-4 h-4 shrink-0" />
              <span>{formatRupees(event.prize_pool)}</span>
            </div>
          )}
        </div>

        {/* Capacity Bar */}
        <div className="mt-auto bg-stone-50 rounded-xl p-3 border border-stone-100">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{filled} / {cap}</span>
            </div>
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${full ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {full ? 'Full' : `${cap - filled} left`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.1, type: "spring" }}
              className={`h-full rounded-full ${full ? 'bg-rose-500' : 'bg-gradient-to-r ' + catTheme.from + ' ' + catTheme.to}`} 
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (onRegister || onVolunteer) && (
        <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex gap-2 z-10 bg-white" onClick={e => e.stopPropagation()}>
          {onRegister && (
            <motion.button 
              whileTap={{ scale: isRegistered || full ? 1 : 0.96 }}
              onClick={() => { if (!isRegistered && !full) onRegister(event.event_id); }}
              disabled={isRegistered || full}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                isRegistered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                full ? 'bg-stone-100 text-stone-400 border border-stone-200' : 
                `bg-gradient-to-br ${catTheme.from} ${catTheme.to} text-white hover:opacity-90`
              }`}
            >
              {isRegistered ? 'Registered' : full ? 'Full' : 'Participate'}
            </motion.button>
          )}
          {onVolunteer && (
            <motion.button
              whileTap={{ scale: isVolunteer ? 1 : 0.96 }}
              onClick={() => { if (!isVolunteer) onVolunteer(event.event_id); }}
              disabled={isVolunteer}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                isVolunteer ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 
                'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {isVolunteer ? 'Volunteering' : 'Volunteer'}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;
