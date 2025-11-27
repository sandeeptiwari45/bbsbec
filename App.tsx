import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/student/StudentHome';
import StudentCalendar from './pages/student/StudentCalendar';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CreateNotice from './pages/faculty/CreateNotice';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <div className="p-8 text-center text-red-600">Access Denied</div>;
  }

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute roles={['student']}>
              <Routes>
                <Route path="home" element={<StudentHome />} />
                <Route path="calendar" element={<StudentCalendar />} />
                <Route path="favourites" element={<div className="text-slate-500">Favourites Page Implementation is similar to Home (filtered by ID)</div>} />
                <Route path="profile" element={<div className="text-slate-500">Profile Page (Mock)</div>} />
                <Route path="*" element={<Navigate to="home" />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Faculty Routes */}
          <Route path="/faculty/*" element={
            <ProtectedRoute roles={['faculty']}>
              <Routes>
                <Route path="" element={<FacultyDashboard />} />
                <Route path="create" element={<CreateNotice />} />
                <Route path="*" element={<Navigate to="" />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
