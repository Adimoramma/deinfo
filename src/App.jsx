import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home';
import Events from './pages/Events.jsx';
import Announcements from './pages/Announcements.jsx';
import Archive from './pages/Archive.jsx';
import Results from './pages/Results';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard';
import NoticeDetail from './pages/NoticeDetail';

import ProtectedRoute from './components/ProtectedRoute';
import StudentPortal from './pages/StudentPortal';
import AdminReset from './pages/AdminReset';
import DebugSupabase from './pages/DebugSupabase';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/results" element={<Results />} />
        <Route path="/portal" element={<StudentPortal />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/reset" element={<AdminReset />} />
  <Route path="/debug-supabase" element={<DebugSupabase />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
