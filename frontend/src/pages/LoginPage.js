import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      if (err.response) setError(err.response.data?.message || `Server error (${err.response.status})`);
      else if (err.request) setError('Cannot connect to server. Check backend.');
      else setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-stone-50">
      <Toast show={!!error} type="error" message={error} onClose={() => setError('')} />

      {/* Left decorative panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:40px_40px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center relative z-10 px-12"
        >
          <span className="text-5xl block mb-6">🎉</span>
          <h1 className="font-display text-4xl font-bold text-white mb-4">Welcome to FestZone</h1>
          <p className="text-lg text-indigo-200 max-w-sm mx-auto leading-relaxed">
            Your one-stop platform for college fest events, registrations, and volunteering.
          </p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 md:flex-none md:w-[480px] lg:w-[560px] flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring', damping: 25 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center sm:text-left">
            <h2 className="font-display text-3xl font-bold text-stone-900 mb-2">Welcome back</h2>
            <p className="text-stone-500">Sign in to your FestZone account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">College Email</label>
              <input 
                type="email" 
                required 
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@college.edu" 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium placeholder:text-stone-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" 
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium placeholder:text-stone-400"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 mt-4 text-[15px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </div>
              ) : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-stone-500 mt-10">
            New here?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
