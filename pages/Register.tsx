import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Hash, Loader2, ArrowLeft, GraduationCap, BookOpen, Calendar, Layers } from 'lucide-react';

const Register: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        fullName: '',
        email: '',
        course: '',
        department: '',
        year: '',
        semester: '',
        section: '',
        collegeRollNo: '',
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData, formData.code, ['student']);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div
                className={`
            bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50
            transform transition-all duration-700 ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}
            >
                <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 text-sm font-medium transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Login
                </Link>

                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4 shadow-md overflow-hidden p-2">
                        <img src="/assets/logo.png" alt="BBSBEC Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Student Registration</h1>
                    <p className="text-slate-500">Join the BBSBEC Digital Notice Board community.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-start shadow-sm border border-red-100 animate-shake">
                        <span className="mr-2 mt-0.5 text-lg">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Unique Registration Code</label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                            <input
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-mono uppercase tracking-wide transition-all"
                                placeholder="e.g. BBSBEC347520"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
                            Ask your faculty advisor for your unique code.
                        </p>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:bg-white"
                                placeholder="Sandeep Tiwari"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:bg-white"
                                placeholder="sandeep@bbsbec.edu"
                            />
                        </div>
                    </div>

                    {/* Academic Details Section Divider */}
                    <div className="md:col-span-2 pt-2 pb-1">
                        <div className="h-px bg-slate-100 w-full"></div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-1">Academic Details</p>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Course</label>
                        <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <select name="course" value={formData.course} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all text-slate-700">
                                <option value="" disabled>Select Course</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="BCA">BCA</option>
                                <option value="BBA">BBA</option>
                                <option value="MCA">MCA</option>
                                <option value="MBA">MBA</option>
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Department</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <select name="department" value={formData.department} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all text-slate-700">
                                <option value="" disabled>Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="ME">Mechanical</option>
                                <option value="Civil">Civil</option>
                                <option value="IT">IT</option>
                                <option value="Computer Applications">Computer Applications</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Year</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <select name="year" value={formData.year} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all text-slate-700">
                                <option value="" disabled>Select Year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Semester</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <select name="semester" value={formData.semester} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all text-slate-700">
                                <option value="" disabled>Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <option key={i} value={i}>Semester {i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 group-focus-within:text-blue-600 transition-colors">College Roll No</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                            <input
                                name="collegeRollNo"
                                value={formData.collegeRollNo}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:bg-white"
                                placeholder="e.g. 236612"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Section</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <select name="section" value={formData.section} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all text-slate-700">
                                <option value="" disabled>Select Section</option>
                                <option value="A">Section A</option>
                                <option value="B">Section B</option>
                                <option value="C">Section C</option>
                                <option value="D">Section D</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
