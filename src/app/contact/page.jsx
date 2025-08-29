"use client";
import { useMemo, useRef, useState } from "react";
import Script from "next/script";
import styles from "./Contact.module.css";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPhone,
	faEnvelope,
	faMapMarkerAlt,
	faCopy,
	faTrash,
	faLink,
	faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import DiagonalBG from "../components/DiagonalBG";

const STUDIO = {
	name: "DC Art - Derek Calkins",
	phone: "+1-702-555-0123",
	email: "booking@dcartstudio.com",
	ig: "https://instagram.com/dc_art_collective",
	address: "123 Ink Ave, Las Vegas, NV 89101",
	maps: "https://maps.google.com/?q=123+Ink+Ave,+Las+Vegas,+NV+89101",
};

export default function ContactPage() {
	// form state
	const [fullName, setFullName] = useState("");
	const [replyEmail, setReplyEmail] = useState("");
	const [placement, setPlacement] = useState("");
	const [budget, setBudget] = useState("");
	const [style, setStyle] = useState("Black & Grey");
	const [description, setDescription] = useState("");
	const [refs, setRefs] = useState("");
	const [images, setImages] = useState([]); // {file, url}
	const [copied, setCopied] = useState(false);

	const fileInputRef = useRef(null);
	const MAX_FILES = 5;

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
			images.length ? `Images to attach: ${images.map((x) => x.file.name).join(", ")}` : null,
			"",
			"Thank you",
		].filter(Boolean);
		return lines.join("\n");
	}, [fullName, replyEmail, placement, budget, style, description, refs, images]);

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

	// local previews only
	const onFiles = (filesList) => {
		const files = Array.from(filesList || []);
		if (!files.length) return;
		const next = [...images];
		for (const f of files) {
			if (!f.type.startsWith("image/")) continue;
			if (next.length >= MAX_FILES) break;
			next.push({ file: f, url: URL.createObjectURL(f) });
		}
		setImages(next);
	};

	const removeImage = (idx) => {
		setImages((prev) => {
			const copy = [...prev];
			const [removed] = copy.splice(idx, 1);
			if (removed?.url) URL.revokeObjectURL(removed.url);
			return copy;
		});
	};

	return (
		<main className={styles.page}>
			<DiagonalBG />
			{/* Hero */}
			<section className={styles.hero}>
				<h1 className={styles.title}>Contact</h1>
				<p className={styles.kicker}>
					Start your project. Fill the form and open your email or text app. Attach reference images there.
				</p>
				<div className={styles.actions}>
					<a className={styles.action} href={`tel:${STUDIO.phone}`}>
						<FontAwesomeIcon icon={faPhone} /> Call
					</a>
					<a className={styles.action} href={`sms:${STUDIO.phone}`}>
						<FontAwesomeIcon icon={faPhone} /> Text
					</a>
					<a className={styles.action} href={`mailto:${STUDIO.email}`}>
						<FontAwesomeIcon icon={faEnvelope} /> Email
					</a>
					<a className={styles.action} href={STUDIO.maps} target="_blank" rel="noreferrer">
						<FontAwesomeIcon icon={faMapMarkerAlt} /> Map
					</a>
				</div>
			</section>

			{/* Two column layout */}
			<section className={styles.twoCol}>
				{/* LEFT COLUMN: media grid */}
				<aside className={styles.mediaCol}>
					{/* Row 1: Video */}
					<div className={styles.videoCard}>
						<div className={styles.videoFrame}>
							{/* Replace sources with your actual video files */}
							<video
								className={styles.video}
								autoPlay
								muted
								loop
								playsInline
								controls
								poster="/images/video-poster.jpg"
							>
								<source src="/images/tattooing-vid.mp4" type="video/mp4" />
								<source src="/videos/tattoo-progress.webm" type="video/webm" />
								Your browser does not support the video tag.
							</video>
						</div>
						<div className={styles.videoCaption}>
							Tattoo session in progress.
						</div>
					</div>

					{/* Row 2: Instagram embed */}
					<div className={styles.instaCard}>
						<h3 className={styles.embedTitle}>Latest on Instagram</h3>

						<blockquote
							className="instagram-media"
							data-instgrm-permalink="https://www.instagram.com/dc_art_collective/?utm_source=ig_embed&amp;utm_campaign=loading"
							data-instgrm-version="14"
							style={{
								background: "#FFF",
								border: 0,
								borderRadius: "12px",
								boxShadow:
									"0 0 1px 0 rgba(0,0,0,0.5), 0 8px 24px 0 rgba(0,0,0,0.18)",
								margin: "0 auto",
								padding: 0,
								maxWidth: "540px",
								width: "100%",
							}}
						/>
						<Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
						<p className={styles.instaNote}>
							If the feed does not load,{" "}
							<a href={STUDIO.ig} target="_blank" rel="noreferrer" className={styles.link}>
								open Instagram
							</a>
							.
						</p>
					</div>
				</aside>

				{/* RIGHT COLUMN: form */}
				<div className={styles.formCol}>
					<section className={styles.formWrap} aria-label="Tattoo request">
						<h2 className={styles.h2}>Tattoo Request</h2>

						{/* Clear notice above uploads */}
						<div className={styles.notice}>
							<FontAwesomeIcon icon={faCircleInfo} />
							Please attach your reference images in the email or text after you click Open Mail or Open Texts.
						</div>

						<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
							<div className={styles.row}>
								<label className={styles.label}>
									Name
									<input
										className={styles.input}
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										placeholder="Jane Doe"
									/>
								</label>
								<label className={styles.label}>
									Email
									<input
										type="email"
										className={styles.input}
										value={replyEmail}
										onChange={(e) => setReplyEmail(e.target.value)}
										placeholder="you@example.com"
									/>
								</label>
							</div>

							<div className={styles.row}>
								<label className={styles.label}>
									Placement
									<input
										className={styles.input}
										value={placement}
										onChange={(e) => setPlacement(e.target.value)}
										placeholder="Right forearm outer"
									/>
								</label>
								<label className={styles.label}>
									Budget
									<input
										className={styles.input}
										value={budget}
										onChange={(e) => setBudget(e.target.value)}
										placeholder="$500 to $800"
									/>
								</label>
							</div>

							<div className={styles.row}>
								<label className={styles.label}>
									Color or Black and Grey
									<select
										className={styles.select}
										value={style}
										onChange={(e) => setStyle(e.target.value)}
									>
										<option>Black & Grey</option>
										<option>Color</option>
									</select>
								</label>

								<label className={styles.label}>
									Reference links
									<input
										className={styles.input}
										value={refs}
										onChange={(e) => setRefs(e.target.value)}
										placeholder="Paste 1 to 3 links, comma separated"
									/>
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
										<span
											className={styles.popover}
											role="status"
											aria-live="polite"
										>
											Copied
											<i className={styles.popoverArrow} />
										</span>
									)}
								</div>

								<a className={styles.secondaryBtn} href={mailtoHref}>
									<FontAwesomeIcon icon={faEnvelope} /> Open Mail
								</a>
								<a className={styles.secondaryBtn} href={smsHref}>
									<FontAwesomeIcon icon={faPhone} /> Open Texts
								</a>
							</div>

							<p className={styles.disclaimer}>
								Attach your reference images in the email or text before you send it. Mailto and SMS links do not include files automatically.
							</p>
						</div>
					</section>
				</div>
			</section>
		</main>
	);
}
