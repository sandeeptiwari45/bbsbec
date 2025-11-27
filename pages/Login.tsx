import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // For demo purposes we just ask for email as password isn't real in this mock
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email);
      // Determine redirect based on user role (handled in AuthContext, but navigate here for clarity)
      // Actually AuthContext just sets user. We need to check user role. 
      // Since `login` is async, we can get user from context immediately? No, state update.
      // We will rely on `useEffect` in `App.tsx` or simple navigation here if we returned user.
      
      // Let's grab the user from localStorage for instant redirect logic
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to BBSBEC Digital Notice Board</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center">
                <span className="mr-2">⚠️</span> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="student@bbsbec.edu"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="password" 
                        required 
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign In</span> <ArrowRight className="w-5 h-5" /></>}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Register with Unique Code</Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-2">Demo Credentials:</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
                <button onClick={() => setEmail('student@bbsbec.edu')} className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">Student</button>
                <button onClick={() => setEmail('faculty@bbsbec.edu')} className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">Faculty</button>
                <button onClick={() => setEmail('admin@bbsbec.edu')} className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">Admin</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
