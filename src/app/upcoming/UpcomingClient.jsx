"use client";

import { motion, useReducedMotion } from "framer-motion";
import ConventionCalendar from "../components/ConventionCalendar";
import styles from "./Upcoming.module.css";

export default function UpcomingClient() {
	const reduce = useReducedMotion();

	const page = {
		hidden: { opacity: 0.3 },
		show: {
			opacity: 1,
			transition: {
				duration: reduce ? 0 : 0.65,
				ease: [0.32, 0.8 , 0.46, 0.8],
				when: "beforeChildren",
				staggerChildren: reduce ? 0 : 0.5,
			},
		},
	};

	const up = {
		hidden: { opacity: 0, y: 16 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: reduce ? 0 : 2.5, ease: [0.32, 1, 0.56, 1] },
		},
	};

	return (
		<motion.main
			className={styles.page}
			initial="hidden"
			animate="show"
			variants={page}
		>
			<motion.header className={styles.hero} variants={up}>
				<h1 className={styles.title}>Upcoming Events</h1>
				<p className={styles.subhead}>
					Follow Derek's journey across conventions, expos, and guest spots.
					Meet in person, book a session, or stop by to say hello. These are
					great chances to see the work live.
				</p>
			</motion.header>

			<motion.div
				className={styles.calendarWrap}
				variants={up}
				viewport={{ once: true, amount: 0.2 }}  // reveal when scrolled into view
			>
				<ConventionCalendar />
			</motion.div>
		</motion.main>
	);
}
