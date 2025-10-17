import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import styles from '../styles/global.module.css';
import jsPDF from 'jspdf';


function StudentPortal() {
  const [regNumber, setRegNumber] = useState('');
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: studentData, error } = await supabase
      .from('students')
      .select('*')
      .eq('reg_number', regNumber)
      .single();

    if (error || !studentData) {
      alert('Student not found');
      setLoading(false);
      return;
    }

    setStudent(studentData);

    const { data: resultData } = await supabase
      .from('results')
      .select('*')
      .eq('student_id', studentData.id);

    setResults(resultData);
    setLoading(false);
  };

  return (
    <main>
      <h2>Student Portal</h2>
      {!student ? (
        <form onSubmit={handleLogin}>
          <input
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            placeholder="Enter Registration Number"
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h3>Welcome, {student.name}</h3>
          <p>Email: {student.email}</p>
          <h4>Your Results</h4>
          <div className={styles.grid}>
            {results.map((r, i) => (
              <div key={i} className={styles.notice}>
                <h3>{r.course_code}</h3>
                <p>Grade: {r.grade}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
    </main>
  );
}
const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Student: ${student.name}`, 10, 20);
  doc.text(`Email: ${student.email}`, 10, 30);
  doc.text('Results:', 10, 40);

  results.forEach((r, i) => {
    doc.text(`${r.course_code}: ${r.grade}`, 10, 50 + i * 10);
  });

  doc.save(`${student.reg_number}_results.pdf`);
};

<button onClick={handleDownloadPDF}>Download Results as PDF</button>


export default StudentPortal;
