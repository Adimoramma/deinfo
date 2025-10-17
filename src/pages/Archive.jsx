import React from 'react';
import styles from '../styles/global.module.css';

export function Archive() {
	return (
		<main className={styles.container}>
			<div className={styles.contentCard}>
						<div className={styles.hero}>
							<div>
								<h2 className={styles.pageTitle}>Archive</h2>
								<p className={styles.lead}>Previously published announcements and documents.</p>
							</div>
						</div>
			<div className={styles.grid}>
				<div className={styles.notice}>
										<h3>Old Announcement</h3>
					<p>Archived notices and events will appear here.</p>
				</div>
			</div>
			</div>
		</main>
	);
}

export default Archive;

