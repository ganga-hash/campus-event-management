import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, Clock, ArrowRight, Music, Code, Image as ImageIcon, Shirt, MonitorPlay, Palette, Camera, Gamepad2 } from 'lucide-react';

const STATS = [
  { n: 20, suffix: '+', l: 'Events', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { n: 5, suffix: 'L+', l: 'Prize Pool', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
  { n: 500, suffix: '+', l: 'Students', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { n: 3, suffix: ' Days', l: 'Duration', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const CATEGORIES = [
  { name: 'Music', icon: Music, color: 'text-pink-600', bg: 'bg-pink-100', desc: 'Battle of bands, solo singing, DJ nights' },
  { name: 'Tech', icon: Code, color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Hackathons, coding, robotics challenges' },
  { name: 'Dance', icon: MonitorPlay, color: 'text-purple-600', bg: 'bg-purple-100', desc: 'Classical, western, group performances' },
  { name: 'Art', icon: Palette, color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Painting, sculpture, digital art contests' },
  { name: 'Sports', icon: Gamepad2, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Futsal, chess, table tennis tournaments' },
  { name: 'Drama', icon: Shirt, color: 'text-red-600', bg: 'bg-red-100', desc: 'Street play, mono act, skit performances' },
  { name: 'Literary', icon: ImageIcon, color: 'text-cyan-600', bg: 'bg-cyan-100', desc: 'Debate, quiz, creative writing events' },
  { name: 'Photography', icon: Camera, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100', desc: 'Portrait, landscape, street photo walks' },
];

const TIMELINE = [
  { day: 'Day 1 · March 14', events: ['24hr Hackathon Kickoff', 'Photo Walk', 'Futsal Tournament', 'Chess Championship', 'Parliamentary Debate', 'Digital Art Contest'] },
  { day: 'Day 2 · March 15', events: ['Battle of Bands', 'Western Dance Showdown', 'Competitive Coding', 'Table Tennis', 'Quizmania', 'Mono Act', 'Group Dance Battle'] },
  { day: 'Day 3 · March 16', events: ['Solo Singing Finals', 'Classical Dance Recital', 'Robotics Rumble', 'Nukkad Natak', 'Creative Writing', 'Neon Nights DJ Festival'] },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-stone-50">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-stone-900 border-b border-stone-800">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]" />
        
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-rose-600/20 blur-[100px]" 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ opacity, y }}
            className="max-w-4xl mx-auto"
          >


            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight leading-[1.1] mb-8">
              Where Talent Finds <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 italic pr-2">Its Stage</span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Three days of competitions, creativity, and community across music, tech, dance, art, and more. Compete, volunteer, or just vibe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/events')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Browse Events
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                Create Account <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <s.icon className={`w-6 h-6 mb-3 ${s.color.replace('text-', 'text-')}`} style={{ color: s.color.includes('indigo') ? '#818cf8' : s.color.includes('emerald') ? '#34d399' : s.color.includes('amber') ? '#fbbf24' : '#fb7185' }} />
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">
                    {s.n}{s.suffix}
                  </h3>
                  <p className="text-sm font-medium text-stone-400">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-stone-50 [clip-path:ellipse(60%_100%_at_50%_100%)]" />
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase mb-3 block">Categories</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-stone-900 tracking-tight">Something for Everyone</h2>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => navigate('/events')}
                className="group bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-xl cursor-pointer transition-shadow"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-6 border border-white shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA SECTION */}
      <section className="py-24 relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[size:40px_40px]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-5xl mb-6 block">🚀</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-6">Ready to Be Part of FestZone?</h2>
            <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Register now to participate in events, volunteer for shifts, and be part of the biggest college fest of 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 group">
                Register Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/events')} className="px-8 py-4 bg-indigo-800 text-white border border-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors">
                Explore Events
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-stone-50 border-t border-stone-200 text-center">
        <p className="text-sm font-medium text-stone-500">
          © 2026 FestZone · Campus Event Management
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
