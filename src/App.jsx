import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Archive from './pages/Archive';
import Results from './pages/Results';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NoticeDetail from './pages/NoticeDetail';

import ProtectedRoute from './components/ProtectedRoute';
import StudentPortal from './pages/StudentPortal';
import AdminReset from './pages/AdminReset';


<Route path="/admin" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />


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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reset" element={<AdminReset />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
