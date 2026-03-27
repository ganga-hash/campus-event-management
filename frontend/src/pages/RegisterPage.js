import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: 'Computer Science', year: '2', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      if (err.response) setError(err.response.data?.message || `Server error (${err.response.status})`);
      else if (err.request) setError('Cannot connect to server. Check backend.');
      else setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-stone-50">
      <Toast show={!!error} type="error" message={error} onClose={() => setError('')} />

      {/* Left decorative panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:40px_40px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10 px-12"
        >
          <span className="text-5xl block mb-6">🎓</span>
          <h1 className="font-display text-4xl font-bold text-white mb-4">Join the Community</h1>
          <p className="text-lg text-emerald-200 max-w-sm mx-auto leading-relaxed">
            Register to participate in events, volunteer for shifts, and be part of FestZone.
          </p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 md:flex-none md:w-[480px] lg:w-[560px] flex items-center justify-center p-6 sm:p-12 border-l border-stone-200">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring', damping: 25 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center sm:text-left">
            <h2 className="font-display text-3xl font-bold text-stone-900 mb-2">Create Account</h2>
            <p className="text-stone-500">Join FestZone and explore events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Toggle */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center mb-6 relative">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'student' })}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-lg z-10 transition-colors ${form.role === 'student' ? 'text-white' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'admin' })}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-lg z-10 transition-colors ${form.role === 'admin' ? 'text-white' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Admin
              </button>
              <div className="absolute inset-1 flex pointer-events-none">
                <motion.div 
                  initial={false}
                  animate={{ x: form.role === 'student' ? 0 : '100%' }}
                  transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  className={`w-1/2 h-full rounded-lg shadow-sm ${form.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                required 
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Aarav Sharma" 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium placeholder:text-stone-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">College Email</label>
              <input 
                type="email" 
                required 
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="aarav@college.edu" 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password" 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium placeholder:text-stone-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Department</label>
                <select 
                  value={form.department} 
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium text-stone-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'IT', 'Biotechnology'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Year</label>
                <select 
                  value={form.year} 
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium text-stone-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-3.5 mt-2 text-[15px] ${form.role === 'admin' ? 'bg-gradient-to-br from-indigo-800 to-indigo-700 hover:from-indigo-900 hover:to-indigo-800 shadow-glow-indigo' : 'bg-gradient-to-br from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 shadow-glow-emerald'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </div>
              ) : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-stone-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 hover:text-emerald-800 transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
