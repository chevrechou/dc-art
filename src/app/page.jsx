import Link from "next/link";
import styles from "./Home.module.css";

const panels = [
	"/images/tattoo-1.jpg",
	"/images/tattoo-2.jpg",
	"/images/tattoo-3.jpg",
	"/images/tattoo-4.jpg",
	"/images/tattoo-5.jpg",
	"/images/tattoo-6.jpg",
];

export default function Home() {
	return (
		<div className={styles.wrap}>
			<div className={styles.panels}>
				{panels.map((src, i) => (
					<div
						key={i}
						className={styles.panel}
						style={{ backgroundImage: `url(${src})` }}
						aria-hidden="true"
					/>
				))}
			</div>

			<div className={styles.overlay}>
				<h1 className={styles.name}>Derek Calkins</h1>

				{/* overlay links */}
				<nav className={styles.overlayNav} aria-label="Primary">
					<Link href="/" className={styles.overlayLink}>Home</Link>
					<Link href="/about" className={styles.overlayLink}>About</Link>
					<Link href="/gallery" className={styles.overlayLink}>Gallery</Link>
					<Link href="/contact" className={styles.overlayLink}>Contact</Link>

				</nav>

				<p className={styles.tag}>Tattoo Artist - Black and Grey - Fine Line</p>
			</div>
		</div>
	);
}
