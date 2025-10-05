"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Script from "next/script";
import styles from "./Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt, faCopy, faCircleInfo, faListCheck, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import DiagonalBG from "../components/DiagonalBG";
import JsonLd from "../components/JsonLd";

const STUDIO = {
	name: "DC Art - Derek Calkins",
	phone: "+1-725-577-3339",
	email: "dcartcollective514@gmail.com",
	ig: "https://instagram.com/dc_art_collective",
	address: "6910 S Rainbow Blvd #107, Las Vegas, NV 89118",
	maps: "https://maps.app.goo.gl/vEWYfu8qQsFz8xw5A",
};

const data = {
	"@context": "https://schema.org",
	"@type": "LocalBusiness",
	name: "DC Art - Derek Calkins",
	image: "https://dcartstudio.com/images/dc-profile.jpg",
	url: "https://dcartstudio.com/contact",
	telephone: "+1-725-577-3339",
	address: {
		"@type": "PostalAddress",
		streetAddress: "6910 South Rainbow Boulevard Unit 107",
		addressLocality: "Las Vegas",
		addressRegion: "NV",
		postalCode: "89118",
		addressCountry: "US"
	}
};
export default function ContactPage() {
	const reduce = useReducedMotion();

	// page and section variants
	const page = {
		hidden: { opacity: 0.7 },
		show: {
			opacity: 1,
			transition: {
				duration: reduce ? 0 : 0.6,
				ease: [0.42, 1, 0.86, 1],
				when: "beforeChildren",
				staggerChildren: reduce ? 0 : 0.52,
			},
		},
	};

	const up = {
		hidden: { opacity: 0, y: 16 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: reduce ? 0 : 1.8, ease: [0.32, 1, 0.66, 1] },
		},
	};

	const fade = {
		hidden: { opacity: 0.5 },
		show: { opacity: 1, transition: { duration: reduce ? 0 : 0.6, ease: "easeOut" } },
	};

	// form state
	const [fullName, setFullName] = useState("");
	const [replyEmail, setReplyEmail] = useState("");
	const [placement, setPlacement] = useState("");
	const [budget, setBudget] = useState("");
	const [style, setStyle] = useState("Black & Grey");
	const [description, setDescription] = useState("");
	const [refs, setRefs] = useState("");
	const [copied, setCopied] = useState(false);

	// message preview
	const subject = useMemo(() => {
		const who = fullName ? ` for ${fullName}` : "";
		const what = style ? ` - ${style}` : "";
		return `Tattoo Inquiry${what}${who}`;
	}, [fullName, style]);

	const body = useMemo(() => {
		const lines = [
			"Hi Derek,",
			"",
			"I would like to book a tattoo.",
			fullName ? `Name: ${fullName}` : null,
			replyEmail ? `Email: ${replyEmail}` : null,
			placement ? `Placement: ${placement}` : null,
			budget ? `Budget: ${budget}` : null,
			style ? `Style: ${style}` : null,
			description ? `Description: ${description}` : null,
			refs ? `Reference links: ${refs}` : null,
			"",
			"Thank you",
		].filter(Boolean);
		return lines.join("\n");
	}, [fullName, replyEmail, placement, budget, style, description, refs]);

	const bodyURI = encodeURIComponent(body);
	const subjURI = encodeURIComponent(subject);
	const mailtoHref = `mailto:${encodeURIComponent(STUDIO.email)}?subject=${subjURI}&body=${bodyURI}`;
	const smsHref = `sms:${STUDIO.phone}?body=${bodyURI}`;

	const copyBody = async () => {
		try {
			await navigator.clipboard.writeText(`${subject}\n\n${body}`);
			setCopied(true);
			setTimeout(() => setCopied(false), 1200);
		} catch { }
	};

	const requiredOk = () => fullName.trim() && replyEmail.trim() && placement.trim() && description.trim();

	return (
		<motion.main className={styles.page} initial="hidden" animate="show" variants={page}>
			<DiagonalBG />
			<JsonLd data={data} />
			{/* Hero */}
			<motion.section className={styles.hero} variants={up}>
				<h1 className={styles.title}>Contact</h1>
				<p className={styles.kicker}>Let’s work on your next project</p>

				<motion.blockquote className={styles.quote} variants={up}>
					<p>
						Every tattoo I take on is a chance to bring years of practice and passion to life.
						I look for clients who want to collaborate but also trust me with the creative
						freedom to do my best work.
					</p>
					<p>
						My proudest moments are when I create pieces I would be honored to wear myself,
						work that feels timeless, personal, and powerful.
					</p>
					<footer className={styles.cite}>
						<cite>— Derek Calkins</cite>
					</footer>
				</motion.blockquote>

				<div className={styles.actions}>
					<a className={styles.action} href={`tel:${STUDIO.phone}`} aria-label="Call the studio">
						<FontAwesomeIcon icon={faPhone} /> <span>Call</span>
					</a>
					<a className={styles.action} href={`sms:${STUDIO.phone}`} aria-label="Text the studio">
						<FontAwesomeIcon icon={faPhone} /> <span>Text</span>
					</a>
					<a className={styles.action} href={`mailto:${STUDIO.email}`} aria-label="Email the studio">
						<FontAwesomeIcon icon={faEnvelope} /> <span>Email</span>
					</a>
					<a
						className={styles.action}
						href={STUDIO.maps}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Open studio location in Maps"
					>
						<FontAwesomeIcon icon={faMapMarkerAlt} /> <span>Map</span>
					</a>
				</div>
			</motion.section>


			{/* Two column layout */}
			<section className={styles.twoCol}>
				{/* LEFT COLUMN: media */}
				<motion.aside className={styles.mediaCol} variants={up}>
					{/* Video */}
					<motion.div className={styles.videoCard} variants={fade}>
						<div className={styles.videoFrame}>
							<video className={styles.video} autoPlay muted loop playsInline controls poster="/images/video-poster.jpg">
								<source src="/images/tattooing-vid.mp4" type="video/mp4" />
								<source src="/videos/tattoo-progress.webm" type="video/webm" />
								Your browser does not support the video tag.
							</video>
						</div>
						<div className={styles.videoCaption}>Tattoo session in progress.</div>
					</motion.div>

					{/* Instagram embed */}
					<motion.div className={styles.instaCard} variants={up}>
						<h3 className={styles.embedTitle}>Latest on Instagram</h3>
						<blockquote
							className="instagram-media"
							data-instgrm-permalink="https://www.instagram.com/dc_art_collective/?utm_source=ig_embed&amp;utm_campaign=loading"
							data-instgrm-version="14"
							style={{
								background: "#FFF",
								border: 0,
								borderRadius: "12px",
								boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 8px 24px 0 rgba(0,0,0,0.18)",
								margin: "0 auto",
								padding: 0,
								maxWidth: "540px",
								width: "100%",
								minWidth: "none",
							}}
						/>
						<Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
						<p className={styles.instaNote}>
							If the feed does not load,{" "}
							<a href={STUDIO.ig} target="_blank" rel="noreferrer" className={styles.link}>
								open Instagram
							</a>
							.
						</p>
					</motion.div>
				</motion.aside>

				{/* RIGHT COLUMN: form */}
				<motion.div className={styles.formCol} variants={up}>
					<section className={styles.formWrap} aria-label="Tattoo request">
						<h2 className={styles.h2}>Tattoo Request</h2>

						<div className={styles.notice} role="note">
							<FontAwesomeIcon icon={faListCheck} /> How to submit
							<ol style={{ margin: "0.5rem 0 0 1.25rem" }}>
								<li>Fill out the form so we can prep your message.</li>
								<li>
									Click <strong>Open Mail</strong> or <strong>Open Texts</strong>. Your subject and body will auto fill.
								</li>
								<li>
									<strong>Attach your reference images</strong> in the email or text before sending <FontAwesomeIcon icon={faPaperclip} />.
								</li>
								<li>Send your message. You will get a reply with next steps and scheduling.</li>
							</ol>
						</div>

						<div className={styles.notice}>
							<FontAwesomeIcon icon={faCircleInfo} />
							Reference images cannot be uploaded here. Please attach them directly in your email or text.
						</div>

						<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
							<div className={styles.row}>
								<label className={styles.label}>
									Name
									<input className={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" aria-required="true" />
								</label>
								<label className={styles.label}>
									Email
									<input type="email" className={styles.input} value={replyEmail} onChange={(e) => setReplyEmail(e.target.value)} placeholder="you@example.com" aria-required="true" />
								</label>
							</div>

							<div className={styles.row}>
								<label className={styles.label}>
									Placement
									<input className={styles.input} value={placement} onChange={(e) => setPlacement(e.target.value)} placeholder="Right forearm outer" aria-required="true" />
								</label>
								<label className={styles.label}>
									Budget
									<input className={styles.input} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$500 to $800" />
								</label>
							</div>

							<div className={styles.row}>
								<label className={styles.label}>
									Color or Black and Grey
									<select className={styles.select} value={style} onChange={(e) => setStyle(e.target.value)}>
										<option>Black & Grey</option>
										<option>Color</option>
									</select>
								</label>

								<label className={styles.label}>
									Reference links
									<input className={styles.input} value={refs} onChange={(e) => setRefs(e.target.value)} placeholder="Paste 1 to 3 links, comma separated" />
								</label>
							</div>

							<label className={styles.label}>
								Description / Idea
								<textarea
									className={styles.textarea}
									rows={4}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Brief concept, must include elements, cover up details if any"
									aria-required="true"
								/>
							</label>
						</form>

						<div className={styles.output}>
							<div className={styles.outputHeader}>
								<span className={styles.subjLabel}>Subject</span>
								<span className={styles.subject}>{subject}</span>
							</div>
							<pre className={styles.preview} aria-label="Message preview">
								{body}
							</pre>
							<div className={styles.outputActions}>
								<div className={styles.copyWrap}>
									<button className={styles.primaryBtn} onClick={copyBody}>
										<FontAwesomeIcon icon={faCopy} /> Copy
									</button>

									{copied && (
										<span className={styles.popover} role="status" aria-live="polite">
											Copied
											<i className={styles.popoverArrow} />
										</span>
									)}
								</div>

								<a
									className={styles.secondaryBtn}
									href={requiredOk() ? mailtoHref : undefined}
									onClick={(e) => {
										if (!requiredOk()) {
											e.preventDefault();
											alert("Please complete Name, Email, Placement, and Description before opening your email.");
										}
									}}
								>
									<FontAwesomeIcon icon={faEnvelope} /> Open Mail
								</a>

								<a
									className={styles.secondaryBtn}
									href={requiredOk() ? smsHref : undefined}
									onClick={(e) => {
										if (!requiredOk()) {
											e.preventDefault();
											alert("Please complete Name, Email, Placement, and Description before opening your texts.");
										}
									}}
								>
									<FontAwesomeIcon icon={faPhone} /> Open Texts
								</a>
							</div>

							<p className={styles.disclaimer}>
								Attach your reference images in the email or text before you send it. Mailto and SMS links cannot include files automatically.
							</p>
						</div>
					</section>
				</motion.div>
			</section>
		</motion.main>
	);
}
