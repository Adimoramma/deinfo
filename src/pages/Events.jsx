import React, { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { getEvents } from '../services/eventService';

export function Events() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		let mounted = true;
		getEvents().then(data => { if (mounted) setEvents(data || []); }).catch(() => {});
		const id = setInterval(() => { getEvents().then(data => { if (mounted) setEvents(data || []); }).catch(() => {}); }, 5000);
		return () => { mounted = false; clearInterval(id); };
	}, []);

	return (
		<main className={styles.container}>
			<div className={styles.contentCard}>
				<h2>Events</h2>
				<div className={styles.grid}>
				{events.length === 0 ? (
					<div className={styles.notice}>
						<h3>No upcoming events</h3>
						<p>Events created by admins will appear here.</p>
					</div>
				) : (
					events.map(ev => (
						<div key={ev.id} className={styles.notice}>
							<h3>{ev.title}</h3>
							<small>{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</small>
							<p>{ev.description}</p>
						</div>
					))
				)}
				</div>
			</div>
		</main>
	);
}

export default Events;
