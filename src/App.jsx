import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AboutQuickLinks from './components/AboutQuickLinks.jsx';
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
import styles from './styles/global.module.css';


function MainRouter() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
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

      {/* show About + Quick Links on all non-admin pages above the footer */}
      {!isAdminRoute && <AboutQuickLinks />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

function AppInner() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className={styles.appShell}>
      {!isAdminRoute && <Navbar />}
      <main className={styles.mainContent}>
        <MainRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
