import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getNoticeById } from '../services/newsService';

function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getNoticeById(id).then(setNotice);
  }, [id]);

  if (!notice) return <p>Loading...</p>;

  const renderMedia = () => {
    if (!notice.media_url) return null;
    if (notice.media_type === 'image') return <img src={notice.media_url} alt="Media" style={{ maxWidth: '100%' }} />;
    if (notice.media_type === 'video') return <video controls src={notice.media_url} style={{ maxWidth: '100%' }} />;
    if (notice.media_type === 'document') return <a href={notice.media_url} target="_blank">View Document</a>;
    return null;
  };

  return (
    <main>
      <h2>{notice.title}</h2>
      <small>{new Date(notice.date_posted).toDateString()}</small>
      <p>{notice.summary}</p>
      {renderMedia()}
      <p>{notice.details}</p>
    </main>
  );
}

export default NoticeDetail;
