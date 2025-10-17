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
import { uploadMedia } from '../services/uploadService';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/global.module.css';

export function AdminDashboard() {
  const [news, setNews] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

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
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleCreateNotice = async () => {
    let media_url = '';
    if (newNotice.file) {
      media_url = await uploadMedia(newNotice.file);
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
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>Admin Dashboard</h2>
          <p className={styles.lead}>Manage announcements, events, students, and admins</p>
        </div>
        <div>
          <button className={styles.btnDanger} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <section>
        <h3>Create News</h3>
  <input className={styles.formInput} placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
  <input className={styles.formInput} placeholder="Summary" value={newNotice.summary} onChange={e => setNewNotice({ ...newNotice, summary: e.target.value })} />
  <textarea className={styles.formInput} placeholder="Details" value={newNotice.details} onChange={e => setNewNotice({ ...newNotice, details: e.target.value })} />
        {/* media_type removed - admin attaches files directly */}
        <input type="file" onChange={e => setNewNotice({ ...newNotice, file: e.target.files[0] })} />
  <button className={styles.btnPrimary} onClick={handleCreateNotice}>Create</button>
      </section>

      <section>
        <h3>Events</h3>
  <input className={styles.formInput} placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
  <input className={styles.formInput} placeholder="Date" type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
  <input className={styles.formInput} placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
  <button className={styles.btnPrimary} onClick={handleCreateEvent}>Create Event</button>

        <div className={styles.grid} style={{ marginTop: 12 }}>
          {events.map(ev => (
            <div key={ev.id} className={styles.notice}>
              {eventEditingId === ev.id ? (
                <div>
                  <input value={eventEditData.title} onChange={e => setEventEditData({ ...eventEditData, title: e.target.value })} />
                  <input type="date" value={eventEditData.date} onChange={e => setEventEditData({ ...eventEditData, date: e.target.value })} />
                  <input value={eventEditData.description} onChange={e => setEventEditData({ ...eventEditData, description: e.target.value })} />
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
        <h3>Analytics</h3>
        <div className={styles.grid}>
          <div className={styles.notice}><h3>News</h3><p>{news.length}</p></div>
          <div className={styles.notice}><h3>Students</h3><p>{students.length}</p></div>
          <div className={styles.notice}><h3>Admins</h3><p>{admins.length}</p></div>
          <div className={styles.notice}><h3>Events</h3><p>{events.length}</p></div>
        </div>
      </section>

      <section>
        <h3>Active News</h3>
        <div className={styles.grid}>
          {news.map(n => (
            <div key={n.id} className={styles.notice}>
              {newsEditingId === n.id ? (
                <div>
                  <input value={newsEditData.title} onChange={e => setNewsEditData({ ...newsEditData, title: e.target.value })} />
                  <input value={newsEditData.summary} onChange={e => setNewsEditData({ ...newsEditData, summary: e.target.value })} />
                  <textarea value={newsEditData.details} onChange={e => setNewsEditData({ ...newsEditData, details: e.target.value })} />
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

      <section>
        <h3>Register Student</h3>
        <input className={styles.formInput} placeholder="Name" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
        <input className={styles.formInput} placeholder="Reg Number" value={newStudent.reg_number} onChange={e => setNewStudent({ ...newStudent, reg_number: e.target.value })} />
        <input className={styles.formInput} placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} />
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
                    <input value={studentEditData.name} onChange={e => setStudentEditData({ ...studentEditData, name: e.target.value })} />
                    <input value={studentEditData.email} onChange={e => setStudentEditData({ ...studentEditData, email: e.target.value })} />
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
        <input className={styles.formInput} placeholder="Reg Number" value={newResult.reg_number} onChange={e => setNewResult({ ...newResult, reg_number: e.target.value })} />
        <input className={styles.formInput} placeholder="Course Code" value={newResult.course_code} onChange={e => setNewResult({ ...newResult, course_code: e.target.value })} />
        <input className={styles.formInput} placeholder="Grade" value={newResult.grade} onChange={e => setNewResult({ ...newResult, grade: e.target.value })} />
        <button className={styles.btnPrimary} onClick={() => {
          addResult(newResult.reg_number, newResult.course_code, newResult.grade);
          setNewResult({ reg_number: '', course_code: '', grade: '' });
        }}>Add Result</button>
      </section>

      <section>
        <h3>Add Admin</h3>
        <input className={styles.formInput} placeholder="Name" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
        <input className={styles.formInput} placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
        <input className={styles.formInput} placeholder="Password" type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
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
                <input value={adminEditData.name} onChange={e => setAdminEditData({ ...adminEditData, name: e.target.value })} />
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
    </main>
  );
}

export default AdminDashboard;
