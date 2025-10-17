import React, { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getActiveNews } from '../services/newsService';
import { Link } from 'react-router-dom';

export default function Announcements() {
	const [news, setNews] = useState([]);

	useEffect(() => {
		let mounted = true;
		// initial load
		getActiveNews().then((data) => { if (mounted) setNews(data || []); }).catch(() => {});

		// poll every 5 seconds to pick up new notices created by admin
		const id = setInterval(() => {
			getActiveNews().then((data) => { if (mounted) setNews(data || []); }).catch(() => {});
		}, 5000);

		return () => { mounted = false; clearInterval(id); };
	}, []);

	return (
		<main className={styles.container}>
			<div className={styles.contentCard}>
			<div className={styles.hero}>
				<div>
					<h2 className={styles.pageTitle}>Announcements</h2>
					<p className={styles.lead}>Latest news and announcements from the department.</p>
				</div>
			</div>
			<div className={styles.grid}>
				{news.length === 0 ? (
					<div className={styles.notice}>
						<h3>No announcements</h3>
						<p>There are no active announcements yet.</p>
					</div>
				) : (
					news.map(n => (
						<div key={n.id} className={styles.notice}>
							<h3><Link to={`/notice/${n.id}`}>{n.title}</Link></h3>
							<small>{n.date_posted ? new Date(n.date_posted).toLocaleString() : ''}</small>
							<p>{n.summary}</p>
						</div>
					))
				)}
			</div>
			</div>
		</main>
	);
}

