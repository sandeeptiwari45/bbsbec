import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/student/StudentHome';
import StudentCalendar from './pages/student/StudentCalendar';
import StudentProfile from './pages/student/StudentProfile';
import StudentFavourites from './pages/student/StudentFavourites';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyCalendar from './pages/faculty/FacultyCalendar';
import FacultyProfile from './pages/faculty/FacultyProfile';
import CreateNotice from './pages/faculty/CreateNotice';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminStudents from './pages/admin/AdminStudents';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminNotices from './pages/admin/AdminNotices';
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
    <ThemeProvider>
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
                  <Route path="favourites" element={<StudentFavourites />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="*" element={<Navigate to="home" />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Faculty Routes */}
            <Route path="/faculty/*" element={
              <ProtectedRoute roles={['faculty', 'admin']}>
                <Routes>
                  <Route path="" element={<FacultyDashboard />} />
                  <Route path="create" element={<CreateNotice />} />
                  <Route path="calendar" element={<FacultyCalendar />} />
                  <Route path="profile" element={<FacultyProfile />} />
                  <Route path="*" element={<Navigate to="" />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute roles={['admin']}>
                <Routes>
                  <Route path="" element={<AdminDashboard />} />
                  <Route path="notices" element={<AdminNotices />} />
                  <Route path="calendar" element={<AdminCalendar />} />
                  <Route path="students" element={<AdminStudents />} />
                  <Route path="faculty" element={<AdminFaculty />} />
                  <Route path="*" element={<Navigate to="" />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
