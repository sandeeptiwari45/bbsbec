import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Hash, Loader2, ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    email: '',
    course: 'B.Tech',
    department: 'CSE',
    year: '1st',
    semester: '1',
    section: 'A',
    collegeRollNo: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        await register(formData, formData.code);
        alert('Registration Successful! Please login.');
        navigate('/login');
    } catch (err: any) {
        setError(err.message || 'Registration failed');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-slate-100">
        <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-slate-600 mb-6 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Student Registration</h1>
        <p className="text-slate-500 mb-8">Enter your unique code provided by the administration to create your account.</p>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start">
                <span className="mr-2 mt-0.5">⚠️</span> 
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Unique Registration Code</label>
                <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase tracking-wide"
                        placeholder="e.g. STD-2025-001"
                    />
                </div>
                 <p className="text-xs text-slate-400 mt-1">Try "STD-2025-001" for student, "FAC-2025-001" for faculty.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            {/* Academic Details */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                <select name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="B.Tech">B.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">Mechanical</option>
                    <option value="Civil">Civil</option>
                </select>
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {[1,2,3,4,5,6,7,8].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">College Roll No</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        name="collegeRollNo"
                        value={formData.collegeRollNo}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 1901001"
                    />
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            </div>

            <div className="md:col-span-2 pt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Complete Registration</span>}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
