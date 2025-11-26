import Link from "next/link";
import styles from "./Home.module.css";
import SeoSchema from "./components/SeoSchema";
import JsonLd from "./components/JsonLd";

const panels = [
	"/images/tattoo-1.jpg",
	"/images/tattoo-2.jpg",
	"/images/tattoo-3.jpg",
	"/images/tattoo-4.jpg",
	"/images/tattoo-5.jpg",
	"/images/tattoo-6.jpg",
];

const data = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Derek Calkins",
	jobTitle: "Tattoo Artist",
	url: "https://www.derekcalkinstattoo.com",
	image: "https://www.derekcalkinstattoo.com/images/dc-profile.jpg",
	sameAs: [
		"https://www.instagram.com/dc_art_collective/",
		"https://michael585.substack.com/"
	],
	address: {
		"@type": "PostalAddress",
		streetAddress: "6910 South Rainbow Boulevard Unit 107",
		addressLocality: "Las Vegas",
		addressRegion: "NV",
		postalCode: "89118",
		addressCountry: "US"
	}
};

export default function Home() {
	return (
		<>
			<SeoSchema />
			<JsonLd data={data} />
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

						<Link href="/about" className={styles.overlayLink}>About</Link>
						<Link href="/gallery" className={styles.overlayLink}>Gallery</Link>
						<Link href="/upcoming" className={styles.overlayLink}>Upcoming</Link>
						<Link href="/contact" className={styles.overlayLink}>Contact</Link>

					</nav>

					<p className={styles.tag}>Black and Grey  -  Color  -  Pop Culture  -  Portraits</p>
				</div>
			</div>
		</>
	);
}
