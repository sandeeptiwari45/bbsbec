import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, User, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email);
      const u = JSON.parse(localStorage.getItem('bbsbec_current_user') || '{}');
      if (u.role === 'student') navigate('/student/home');
      else if (u.role === 'faculty') navigate('/faculty');
      else if (u.role === 'admin') navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div
        className={`
          bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50
          transform transition-all duration-700 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white mb-6 shadow-lg shadow-blue-500/20 transform transition-transform hover:scale-110 duration-300 overflow-hidden p-2">
            <img src="/assets/logo.png" alt="BBSBEC Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500">Sign in to BBSBEC Digital Notice Board</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center shadow-sm border border-red-100 animate-shake">
            <span className="mr-2 text-lg">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 hover:bg-white"
                placeholder="student@bbsbec.edu"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 hover:bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign In</span> <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">Register with Unique Code</Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 text-center mb-3 uppercase tracking-wider">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => handleDemoLogin('admin@bbsbec.edu')} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200 flex items-center justify-center space-x-1">
              <Shield className="w-3 h-3" /> <span>Admin</span>
            </button>
            <button onClick={() => handleDemoLogin('faculty@bbsbec.edu')} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200 flex items-center justify-center space-x-1">
              <User className="w-3 h-3" /> <span>Faculty (CSE)</span>
            </button>
            <button onClick={() => handleDemoLogin('student@bbsbec.edu')} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200 flex items-center justify-center space-x-1">
              <User className="w-3 h-3" /> <span>Student (CSE)</span>
            </button>
            <button onClick={() => handleDemoLogin('amit.k@bbsbec.edu')} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200 flex items-center justify-center space-x-1">
              <User className="w-3 h-3" /> <span>Student (BCA)</span>
            </button>
            <button onClick={() => handleDemoLogin('neha.g@bbsbec.edu')} className="col-span-2 p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200 flex items-center justify-center space-x-1">
              <User className="w-3 h-3" /> <span>Student (Civil)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
