import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  getActiveNews, createNotice, deleteNotice,
} from '../services/newsService';
import {
  getStudents, addStudent, deleteStudent,
} from '../services/studentService';
import { addResult } from '../services/resultService';
import {
  getAdmins, addAdmin, deleteAdmin,
} from '../services/adminService';
import { uploadMedia } from '../services/uploadService';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/global.module.css';

function AdminDashboard() {
  const [news, setNews] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  const [newNotice, setNewNotice] = useState({
    title: '', summary: '', details: '', media_type: '', file: null,
  });
  const [newStudent, setNewStudent] = useState({ name: '', reg_number: '', email: '' });
  const [newResult, setNewResult] = useState({ reg_number: '', course_code: '', grade: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    getActiveNews().then(setNews);
    getStudents().then(setStudents);
    getAdmins().then(setAdmins);
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
    setNewNotice({ title: '', summary: '', details: '', media_type: '', file: null });
    getActiveNews().then(setNews);
  };

  return (
    <main>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <section>
        <h3>Create News</h3>
        <input placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
        <input placeholder="Summary" value={newNotice.summary} onChange={e => setNewNotice({ ...newNotice, summary: e.target.value })} />
        <textarea placeholder="Details" value={newNotice.details} onChange={e => setNewNotice({ ...newNotice, details: e.target.value })} />
        <select value={newNotice.media_type} onChange={e => setNewNotice({ ...newNotice, media_type: e.target.value })}>
          <option value="">Select Media Type</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
        <input type="file" onChange={e => setNewNotice({ ...newNotice, file: e.target.files[0] })} />
        <button onClick={handleCreateNotice}>Create</button>
      </section>

      <section>
        <h3>Active News</h3>
        <div className={styles.grid}>
          {news.map(n => (
            <div key={n.id} className={styles.notice}>
              <h3>{n.title}</h3>
              <p>{n.summary}</p>
              <button onClick={() => deleteNotice(n.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Register Student</h3>
        <input placeholder="Name" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
        <input placeholder="Reg Number" value={newStudent.reg_number} onChange={e => setNewStudent({ ...newStudent, reg_number: e.target.value })} />
        <input placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} />
        <button onClick={() => {
          addStudent(newStudent.name, newStudent.reg_number, newStudent.email);
          setNewStudent({ name: '', reg_number: '', email: '' });
          getStudents().then(setStudents);
        }}>Add Student</button>
      </section>

      <section>
        <h3>Enter Result</h3>
        <input placeholder="Reg Number" value={newResult.reg_number} onChange={e => setNewResult({ ...newResult, reg_number: e.target.value })} />
        <input placeholder="Course Code" value={newResult.course_code} onChange={e => setNewResult({ ...newResult, course_code: e.target.value })} />
        <input placeholder="Grade" value={newResult.grade} onChange={e => setNewResult({ ...newResult, grade: e.target.value })} />
        <button onClick={() => {
          addResult(newResult.reg_number, newResult.course_code, newResult.grade);
          setNewResult({ reg_number: '', course_code: '', grade: '' });
        }}>Add Result</button>
      </section>

      <section>
        <h3>Add Admin</h3>
        <input placeholder="Name" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
        <input placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
        <input placeholder="Password" type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
        <button onClick={() => {
          addAdmin(newAdmin.name, newAdmin.email, newAdmin.password);
          setNewAdmin({ name: '', email: '', password: '' });
          getAdmins().then(setAdmins);
        }}>Add Admin</button>
      </section>

      <section>
        <h3>Current Admins</h3>
        {admins.map(a => (
          <div key={a.email}>
            {a.name} ({a.email})
            <button onClick={() => {
              deleteAdmin(a.email);
              getAdmins().then(setAdmins);
            }}>Remove</button>
          </div>
        ))}
      </section>
    </main>
  );
}

export default AdminDashboard;
