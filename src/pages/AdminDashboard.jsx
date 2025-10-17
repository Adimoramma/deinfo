import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  getActiveNews, createNotice, deleteNotice, updateNotice,
} from '../services/newsService';
import {
  getStudents, addStudent, deleteStudent, updateStudent,
} from '../services/studentService';
import { addResult } from '../services/resultService';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import {
  getAdmins, addAdmin, deleteAdmin, updateAdmin,
} from '../services/adminService';
import { getSiteInfo, setSiteInfo } from '../services/adminService';
import { uploadMedia } from '../services/uploadService';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/global.module.css';
import AdminHeader from '../components/AdminHeader';
import AdminAnalytics from '../components/AdminAnalytics';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

export function AdminDashboard() {
  const [news, setNews] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [siteInfo, setSiteInfoState] = useState({ about: '', quickLinks: [] });
  const [toastMsg, setToastMsg] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [toastVariant, setToastVariant] = useState('info');
  const [quickLinkError, setQuickLinkError] = useState('');
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // add a temporary highlight class
      el.classList.add(styles.flashHighlight);
      setTimeout(() => { el.classList.remove(styles.flashHighlight); }, 1400);
    } catch (e) { /* ignore */ }
  };

  const handleAnalyticsView = (key) => {
    const map = {
      news: 'active-news',
      students: 'students',
      admins: 'admins',
      events: 'events',
    };
    const id = map[key] || key;
    scrollToSection(id);
  };

  const [newNotice, setNewNotice] = useState({
    title: '', summary: '', details: '', file: null,
  });
  const [newsEditingId, setNewsEditingId] = useState(null);
  const [newsEditData, setNewsEditData] = useState({ title: '', summary: '', details: '' });
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [eventEditingId, setEventEditingId] = useState(null);
  const [eventEditData, setEventEditData] = useState({ title: '', date: '', description: '' });
  const [newStudent, setNewStudent] = useState({ name: '', reg_number: '', email: '' });
  const [studentEditingReg, setStudentEditingReg] = useState(null);
  const [studentEditData, setStudentEditData] = useState({ name: '', email: '' });
  const [newResult, setNewResult] = useState({ reg_number: '', course_code: '', grade: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [adminEditingEmail, setAdminEditingEmail] = useState(null);
  const [adminEditData, setAdminEditData] = useState({ name: '' });

  useEffect(() => {
    getActiveNews().then(setNews);
    getStudents().then(setStudents);
    getAdmins().then(setAdmins);
    getEvents().then(setEvents);
    // load site info
    try {
      const si = getSiteInfo();
      if (si) setSiteInfoState({ about: si.about || '', quickLinks: si.quickLinks || [] });
    } catch (err) { /* ignore */ }
  }, []);

  const handleLogout = async () => {
    try { localStorage.removeItem('dev_admin'); } catch (e) { /* ignore */ }
    try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
    navigate('/login');
  };

  const handleCreateNotice = async () => {
    let media_url = null;
    if (newNotice.file) {
      try {
        const url = await uploadMedia(newNotice.file);
        if (!url) {
          // uploadMedia returns null when bucket not found or upload skipped
          setToastVariant('warning');
          setToastMsg('File upload skipped: storage bucket not found or upload disabled');
        } else {
          media_url = url;
        }
      } catch (err) {
        console.error('upload error', err);
        setToastVariant('error');
        setToastMsg('File upload failed: ' + (err.message || 'unknown'));
      }
    }

    await createNotice({
      ...newNotice,
      media_url,
      date_posted: new Date().toISOString(),
      is_archived: false,
    });
    setNewNotice({ title: '', summary: '', details: '', file: null });
    getActiveNews().then(setNews);
  };

  const handleCreateEvent = async () => {
    await createEvent({ ...newEvent, created_at: new Date().toISOString() });
    setNewEvent({ title: '', date: '', description: '' });
    getEvents().then(setEvents);
  };

  // news edit handlers
  const startEditNews = (n) => {
    setNewsEditingId(n.id);
    setNewsEditData({ title: n.title || '', summary: n.summary || '', details: n.details || '' });
  };

  const saveEditNews = async (id) => {
    try {
      await updateNotice(id, newsEditData);
      setNewsEditingId(null);
      setNewsEditData({ title: '', summary: '', details: '' });
      getActiveNews().then(setNews);
    } catch (err) { console.error(err); }
  };

  const cancelEditNews = () => {
    setNewsEditingId(null);
    setNewsEditData({ title: '', summary: '', details: '' });
  };

  // event edit handlers
  const startEditEvent = (ev) => {
    setEventEditingId(ev.id);
    setEventEditData({ title: ev.title || '', date: ev.date || '', description: ev.description || '' });
  };

  const saveEditEvent = async (id) => {
    try {
      await updateEvent(id, eventEditData);
      setEventEditingId(null);
      setEventEditData({ title: '', date: '', description: '' });
      getEvents().then(setEvents);
    } catch (err) { console.error(err); }
  };

  const cancelEditEvent = () => {
    setEventEditingId(null);
    setEventEditData({ title: '', date: '', description: '' });
  };

  // student edit handlers
  const startEditStudent = (s) => {
    setStudentEditingReg(s.reg_number);
    setStudentEditData({ name: s.name || '', email: s.email || '' });
  };

  const saveEditStudent = async (reg) => {
    try {
      await updateStudent(reg, studentEditData);
      setStudentEditingReg(null);
      setStudentEditData({ name: '', email: '' });
      getStudents().then(setStudents);
    } catch (err) { console.error(err); }
  };

  const cancelEditStudent = () => {
    setStudentEditingReg(null);
    setStudentEditData({ name: '', email: '' });
  };

  // admin edit handlers
  const startEditAdmin = (a) => {
    setAdminEditingEmail(a.email);
    setAdminEditData({ name: a.name || '' });
  };

  const saveEditAdmin = async (email) => {
    try {
      await updateAdmin(email, adminEditData);
      setAdminEditingEmail(null);
      setAdminEditData({ name: '' });
      getAdmins().then(setAdmins);
    } catch (err) { console.error(err); }
  };

  const cancelEditAdmin = () => {
    setAdminEditingEmail(null);
    setAdminEditData({ name: '' });
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentCard}>
      <AdminHeader title="Admin Dashboard" subtitle="Manage announcements, events, students, and admins" onLogout={handleLogout} />
      <AdminAnalytics counts={{ news: news.length, students: students.length, admins: admins.length, events: events.length }} onView={handleAnalyticsView} />

      <section id="events">
        <h3>Events</h3>
  <input id="event-title" name="event-title" className={styles.formInput} placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
  <input id="event-date" name="event-date" className={styles.formInput} placeholder="Date" type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
  <input id="event-desc" name="event-desc" className={styles.formInput} placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
  <button className={styles.btnPrimary} onClick={handleCreateEvent}>Create Event</button>

        <div className={styles.grid} style={{ marginTop: 12 }}>
          {events.map(ev => (
            <div key={ev.id} className={styles.notice}>
              {eventEditingId === ev.id ? (
                <div>
                  <input id="event-edit-title" name={`event-edit-title-${eventEditingId}`} value={eventEditData.title} onChange={e => setEventEditData({ ...eventEditData, title: e.target.value })} />
                  <input id="event-edit-date" name={`event-edit-date-${eventEditingId}`} type="date" value={eventEditData.date} onChange={e => setEventEditData({ ...eventEditData, date: e.target.value })} />
                  <input id="event-edit-desc" name={`event-edit-desc-${eventEditingId}`} value={eventEditData.description} onChange={e => setEventEditData({ ...eventEditData, description: e.target.value })} />
                  <button onClick={() => saveEditEvent(ev.id)}>Save</button>
                  <button onClick={cancelEditEvent}>Cancel</button>
                </div>
              ) : (
                <>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                  <small>{ev.date}</small>
                  <div>
                    <button className={styles.btnPrimary} onClick={() => startEditEvent(ev)}>Edit</button>
                    <button className={styles.btnDanger} onClick={async () => { await deleteEvent(ev.id); getEvents().then(setEvents); }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
      

      <section>
        <h3>Create News</h3>
  <input id="notice-title" name="notice-title" className={styles.formInput} placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
  <input id="notice-summary" name="notice-summary" className={styles.formInput} placeholder="Summary" value={newNotice.summary} onChange={e => setNewNotice({ ...newNotice, summary: e.target.value })} />
  <textarea className={styles.formInput} placeholder="Details" value={newNotice.details} onChange={e => setNewNotice({ ...newNotice, details: e.target.value })} />
        {/* media_type removed - admin attaches files directly */}
  <input id="notice-file" name="notice-file" type="file" onChange={e => setNewNotice({ ...newNotice, file: e.target.files[0] })} />
  <button className={styles.btnPrimary} onClick={handleCreateNotice}>Create</button>
      </section>

      <section>
        <h3>Site Info (About & Quick Links)</h3>
        <div>
          <label htmlFor="site-about">About text</label>
          <textarea id="site-about" className={styles.formInput} value={siteInfo.about} onChange={e => setSiteInfoState({ ...siteInfo, about: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <h4>Quick Links</h4>
          <small>Enter label and path, then click Add</small>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <input id="ql-label" name="ql-label" placeholder="Label" className={styles.formInput} style={{ flex: 1 }} />
            <input id="ql-to" name="ql-to" placeholder="/path" className={styles.formInput} style={{ flex: 1 }} />
            <input id="ql-desc" name="ql-desc" placeholder="Short description (optional)" className={styles.formInput} style={{ flex: 1 }} />
            <button className={styles.btnPrimary} onClick={() => {
              setQuickLinkError('');
              const lbl = document.getElementById('ql-label').value.trim();
              const to = document.getElementById('ql-to').value.trim();
              const desc = document.getElementById('ql-desc').value.trim();
              if (!lbl) { setQuickLinkError('Label is required'); setToastVariant('error'); setToastMsg('Label is required'); return; }
              if (!to) { setQuickLinkError('Path is required'); setToastVariant('error'); setToastMsg('Path is required'); return; }
              if (!to.startsWith('/')) { setQuickLinkError('Path must start with /'); setToastVariant('error'); setToastMsg('Path must start with /'); return; }
              const next = { ...siteInfo, quickLinks: [...(siteInfo.quickLinks || []), { label: lbl, to, description: desc }] };
              setSiteInfo(next);
              setSiteInfoState(next);
              document.getElementById('ql-label').value = '';
              document.getElementById('ql-to').value = '';
              document.getElementById('ql-desc').value = '';
              setToastVariant('success'); setToastMsg('Quick link added');
            }}>Add</button>
          </div>
          {quickLinkError && <div className={styles.validationError}>{quickLinkError}</div>}

          <div style={{ marginTop: 12 }}>
            <ul>
              {(siteInfo.quickLinks || []).map((q, i) => (
                <li key={i} style={{ marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className={styles.formInput} value={q.label} onChange={e => {
                    const copy = JSON.parse(JSON.stringify(siteInfo));
                    copy.quickLinks[i].label = e.target.value;
                    setSiteInfoState(copy);
                  }} style={{ flex: 1 }} />
                  <input className={styles.formInput} value={q.to} onChange={e => {
                    const copy = JSON.parse(JSON.stringify(siteInfo));
                    copy.quickLinks[i].to = e.target.value;
                    setSiteInfoState(copy);
                  }} style={{ flex: 1 }} />
                  <input className={styles.formInput} value={q.description || ''} placeholder="Short description" onChange={e => {
                    const copy = JSON.parse(JSON.stringify(siteInfo));
                    copy.quickLinks[i].description = e.target.value;
                    setSiteInfoState(copy);
                  }} style={{ flex: 1 }} />
                  <button className={styles.btnPrimary} onClick={() => { setSiteInfo(siteInfo); setToastVariant('success'); setToastMsg('Quick links updated'); }}>Save</button>
                  <button className={styles.btnDanger} onClick={() => { setConfirmIndex(i); setConfirmOpen(true); }}>Remove</button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 8 }}>
            <button className={styles.btnPrimary} onClick={() => { setSiteInfo(siteInfo); setToastMsg('Site info saved'); setTimeout(() => setToastMsg(''), 3000); }}>Save Site Info</button>
          </div>
        </div>
      </section>

      <ConfirmModal open={confirmOpen} title="Remove Quick Link" message="Are you sure you want to remove this quick link?" onCancel={() => { setConfirmOpen(false); setConfirmIndex(null); }} onConfirm={() => {
        if (confirmIndex === null) { setConfirmOpen(false); return; }
        const copy = JSON.parse(JSON.stringify(siteInfo));
        copy.quickLinks.splice(confirmIndex, 1);
        setSiteInfoState(copy);
        setSiteInfo(copy);
        setConfirmOpen(false);
        setConfirmIndex(null);
        setToastMsg('Quick link removed');
        setTimeout(() => setToastMsg(''), 3000);
      }} />

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <section id="active-news">
        <h3>Active News</h3>
        <div className={styles.grid}>
          {news.map(n => (
            <div key={n.id} className={styles.notice}>
              {newsEditingId === n.id ? (
                <div>
                  <input id="news-edit-title" name={`news-edit-title-${newsEditingId}`} value={newsEditData.title} onChange={e => setNewsEditData({ ...newsEditData, title: e.target.value })} />
                  <input id="news-edit-summary" name={`news-edit-summary-${newsEditingId}`} value={newsEditData.summary} onChange={e => setNewsEditData({ ...newsEditData, summary: e.target.value })} />
                  <textarea id="news-edit-details" name={`news-edit-details-${newsEditingId}`} value={newsEditData.details} onChange={e => setNewsEditData({ ...newsEditData, details: e.target.value })} />
                  <button onClick={() => saveEditNews(n.id)}>Save</button>
                  <button onClick={cancelEditNews}>Cancel</button>
                </div>
              ) : (
                <>
                  <h3>{n.title}</h3>
                  <p>{n.summary}</p>
                  <div>
                    <button onClick={() => startEditNews(n)}>Edit</button>
                    <button onClick={async () => { await deleteNotice(n.id); getActiveNews().then(setNews); }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="students">
        <h3>Register Student</h3>
  <input id="student-name" name="student-name" className={styles.formInput} placeholder="Name" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
  <input id="student-reg" name="student-reg" className={styles.formInput} placeholder="Reg Number" value={newStudent.reg_number} onChange={e => setNewStudent({ ...newStudent, reg_number: e.target.value })} />
  <input id="student-email" name="student-email" className={styles.formInput} placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} autoComplete="email" />
        <button className={styles.btnPrimary} onClick={async () => {
          await addStudent(newStudent.name, newStudent.reg_number, newStudent.email);
          setNewStudent({ name: '', reg_number: '', email: '' });
          getStudents().then(setStudents);
        }}>Add Student</button>

        <div style={{ marginTop: 12 }}>
          <h4>Current Students</h4>
          <ul>
            {students.map(s => (
              <li key={s.reg_number}>
                {studentEditingReg === s.reg_number ? (
                  <span>
                    <input id="student-edit-name" name={`student-edit-name-${s.reg_number}`} value={studentEditData.name} onChange={e => setStudentEditData({ ...studentEditData, name: e.target.value })} />
                    <input id="student-edit-email" name={`student-edit-email-${s.reg_number}`} value={studentEditData.email} onChange={e => setStudentEditData({ ...studentEditData, email: e.target.value })} autoComplete="email" />
                    <button onClick={() => saveEditStudent(s.reg_number)}>Save</button>
                    <button onClick={cancelEditStudent}>Cancel</button>
                  </span>
                ) : (
                  <span>
                    {s.name} — {s.reg_number} — {s.email}
                    <button onClick={() => startEditStudent(s)}>Edit</button>
                    <button onClick={async () => { await deleteStudent(s.reg_number); getStudents().then(setStudents); }}>Remove</button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h3>Enter Result</h3>
  <input id="result-reg" name="result-reg" className={styles.formInput} placeholder="Reg Number" value={newResult.reg_number} onChange={e => setNewResult({ ...newResult, reg_number: e.target.value })} />
  <input id="result-course" name="result-course" className={styles.formInput} placeholder="Course Code" value={newResult.course_code} onChange={e => setNewResult({ ...newResult, course_code: e.target.value })} />
  <input id="result-grade" name="result-grade" className={styles.formInput} placeholder="Grade" value={newResult.grade} onChange={e => setNewResult({ ...newResult, grade: e.target.value })} />
        <button className={styles.btnPrimary} onClick={() => {
          addResult(newResult.reg_number, newResult.course_code, newResult.grade);
          setNewResult({ reg_number: '', course_code: '', grade: '' });
        }}>Add Result</button>
      </section>

      <section id="admins">
        <h3>Add Admin</h3>
  <input id="admin-name" name="admin-name" className={styles.formInput} placeholder="Name" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
  <input id="admin-email" name="admin-email" className={styles.formInput} placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} autoComplete="email" />
  <input id="admin-password" name="admin-password" className={styles.formInput} placeholder="Password" type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} autoComplete="new-password" />
        <button className={styles.btnPrimary} onClick={() => {
          addAdmin(newAdmin.name, newAdmin.email, newAdmin.password);
          setNewAdmin({ name: '', email: '', password: '' });
          getAdmins().then(setAdmins);
        }}>Add Admin</button>
      </section>

      <section>
        <h3>Current Admins</h3>
        {admins.map(a => (
          <div key={a.email}>
            {adminEditingEmail === a.email ? (
              <span>
                <input id={`admin-edit-name-${a.email}`} name={`admin-edit-name-${a.email}`} value={adminEditData.name} onChange={e => setAdminEditData({ ...adminEditData, name: e.target.value })} />
                <button onClick={() => saveEditAdmin(a.email)}>Save</button>
                <button onClick={cancelEditAdmin}>Cancel</button>
              </span>
            ) : (
              <span>
                {a.name} ({a.email})
                <button onClick={() => startEditAdmin(a)}>Edit</button>
                <button onClick={async () => { await deleteAdmin(a.email); getAdmins().then(setAdmins); }}>Remove</button>
              </span>
            )}
          </div>
        ))}
      </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
