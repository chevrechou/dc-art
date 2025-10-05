"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "./Gallery.module.css";
import JsonLd from "../components/JsonLd";
import RAW from "./raw";

const data = {
	"@context": "https://schema.org",
	"@type": "CollectionPage",
	name: "Tattoo Gallery",
	url: "https://dcartstudio.com/gallery",
	hasPart: [
		{ "@type": "CreativeWork", name: "Black and Grey Realism" },
		{ "@type": "CreativeWork", name: "Color Realism" },
		{ "@type": "CreativeWork", name: "Pop Culture" }
	]
};
/* =========
	 Portfolio (existing gallery)
	 ========= */

const KIND_LABEL = {
	blackgrey: "B & G",
	color: "Color",
	popculture: "Pop Culture",
	portraits: "Portrait",
};
const FILTERS = [
	{ key: "all", label: "All" },
	{ key: "blackgrey", label: "Black and Grey" },
	{ key: "color", label: "Color" },
	{ key: "popculture", label: "Pop Culture" },
	{ key: "portraits", label: "Portrait" },
];

/* =========
	 Flash (new section)
	 ========= */
const FLASH = Array.from({ length: 12 }, (_, i) => {
	const idx = i + 1;
	const stylesPool = ["linework", "color", "anime", "surreal"];
	const style = stylesPool[idx % stylesPool.length];
	const available = idx % 5 !== 0; // every 5th is claimed for demo
	return {
		id: `f-${idx}`,
		// src: `/flash/flash-${idx}.jpg`,
		src: `/images/tattoo-${idx}.jpg`,
		alt: `Flash design ${idx}`,
		style,
		available,
	};
});

const FLASH_STYLE = [
	{ key: "all", label: "All" },
	{ key: "linework", label: "Linework" },
	{ key: "color", label: "Color" },
	{ key: "anime", label: "Anime" },
	{ key: "surreal", label: "Surreal" },
];

export default function GalleryPage() {
	const reduce = false //

	/* ---- portfolio state ---- */
	const [idx, setIdx] = useState(null); // index within active list
	const [activeSet, setActiveSet] = useState(null); // "work" | "flash" | null
	const [filter, setFilter] = useState("all");
	const [workOrder, setWorkOrder] = useState(RAW);
	const [filtering, setFiltering] = useState(false);

	// randomize once per page load (client side only)
	useEffect(() => {
		setWorkOrder(shuffle(RAW));
	}, []);

	/* ---- flash state ---- */
	const [flashStyle, setFlashStyle] = useState("all");
	const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

	/* ---- derived lists ---- */
	const workData = useMemo(() => {
		return filter === "all"
			? workOrder
			: workOrder.filter((x) => x.kind === filter);
	}, [filter, workOrder]);

	const flashData = useMemo(() => {
		return FLASH.filter((f) => {
			const styleOk = flashStyle === "all" || f.style === flashStyle;
			const availOk = !showOnlyAvailable || f.available;
			return styleOk && availOk;
		});
	}, [flashStyle, showOnlyAvailable]);

	/* ---- lightbox helpers ---- */
	const openFrom = (setName, i) => {
		setActiveSet(setName);
		setIdx(i);
	};
	const close = () => {
		setIdx(null);
		setActiveSet(null);
	};
	const activeList = activeSet === "flash" ? flashData : workData;

	const prev = (e) => {
		e?.stopPropagation?.();
		setIdx((i) => (!activeList.length ? null : i === 0 ? activeList.length - 1 : i - 1));
	};
	const next = (e) => {
		e?.stopPropagation?.();
		setIdx((i) => (!activeList.length ? null : i === activeList.length - 1 ? 0 : i + 1));
	};

	const handleFilter = (next) => {
		if (next === filter) return;
		setFiltering(true);
		setFilter(next);
		// 2 RAFs to ensure browser commits the "prep" state before we remove it
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setFiltering(false));
		});
	};

	/* ---- keyboard support ---- */
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") close();
			if (idx !== null && e.key === "ArrowLeft") prev();
			if (idx !== null && e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idx, activeList.length]);

	/* ---- framer variants ---- */
	const page = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				duration: reduce ? 0 : 0.6,
				ease: [0.42, 1, 0.76, 1],
				when: "beforeChildren",
				staggerChildren: reduce ? 0 : 0.3,
			},
		},
	};

	const up = {
		hidden: { opacity: 0, y: 16 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: reduce ? 0 : 1.5, ease: [0.32, 1, 0.66, 1] },
		},
	};

	const tileV = {
		hidden: { opacity: 0, scale: 0.98 },
		show: {
			opacity: 1,
			scale: 1,
			transition: { duration: reduce ? 0 : 1.95, ease: [0.32, 1, 0.56, 1] },
		},
		exit: {
			opacity: 0,
			scale: 0.98,
			transition: { duration: reduce ? 0 : 2.54 },
		},
	};

	const shuffle = (arr) => {
		const a = arr.slice();
		for (let i = a.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	};

	return (
		<motion.main className={styles.page} initial="hidden" animate="show" variants={page} >
			<JsonLd data={data} />
			{/* ===== Portfolio (existing) ===== */}
			<motion.header className={styles.header} variants={up}>
				<h1 className={styles.title}>Gallery</h1>
				<p className={styles.kicker}>
					A curated collection of my work, from large scale realism to vibrant pop culture and anime pieces.
				</p>
				<div className={styles.actions}>
					<div className={styles.filters} role="tablist" aria-label="Filter gallery">
						{FILTERS.map((f) => (
							<button
								key={f.key}
								role="tab"
								aria-selected={filter === f.key}
								className={`${styles.pill} ${filter === f.key ? styles.pillActive : ""}`}
								onClick={() => handleFilter(f.key)}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>
			</motion.header>

			{/* <motion.section
				className={styles.grid}
				aria-label="Portfolio gallery"
				variants={up}
				layout="position"
			>
				{workData.map((img, i) => (
					<motion.button
						key={img.id}
						className={styles.tile}
						onClick={() => openFrom("work", i)}
						aria-label={`Open ${img.alt}`}
						variants={tileV}
						initial={false}
						exit="exit"
						// animate={{ opacity: 1, scale: 1 }}
						whileHover={{ y: -5 }}
						whileTap={{ scale: 0.88 }}
					>
						<img src={img.src} alt={img.alt} loading="lazy" />
						<span className={styles.badge}>
							{KIND_LABEL[img.kind] ?? "Other"}
						</span>
					</motion.button>
				))}
			</motion.section> */}
			<motion.section
				aria-label="Portfolio gallery"
				variants={up}
				layout="position"
			>
				<section
					className={`${styles.grid} ${filtering ? styles.prep : styles.play}`}
					aria-label="Portfolio gallery"
				>
					{workData.map((img, i) => (
						<button
							key={`${filter}-${img.id}`} // remount on filter for clean CSS transition
							className={styles.tile}
							style={{ "--i": i }}
							aria-label={`Open ${img.alt}`}
							onClick={() => {
								// open your lightbox the same way you did before
								openFrom("work", i);
							}}
						>
							<img src={img.src} alt={img.alt} loading={i < 8 ? "eager" : "lazy"} decoding="async" />
							<span className={styles.badge}>{KIND_LABEL[img.kind] ?? "Other"}</span>
						</button>
					))}
				</section>
			</motion.section>
			{/* ===== Flash (new) ===== */}
			{/* <motion.section
				className={styles.flashSection}
				aria-label="Pre-Designed Flash"
				id="flash"
				variants={up}
				layout="position"
			>

				<header className={styles.header}>
					<h2 className={styles.flashTitle}>Pre-Designed Flash</h2>
					<p className={styles.kicker}>
						One off original designs, first come first served. DM or email to claim.
					</p>

					<div className={styles.actions}>
						<div className={styles.filters} aria-label="Flash style filters">
							{FLASH_STYLE.map((f) => (
								<button
									key={f.key}
									className={`${styles.pill} ${flashStyle === f.key ? styles.pillActive : ""}`}
									onClick={() => setFlashStyle(f.key)}
								>
									{f.label}
								</button>
							))}
						</div>

						<div className={styles.rightActions}>
							<label className={styles.toggleLabel}>
								<input
									type="checkbox"
									checked={showOnlyAvailable}
									onChange={(e) => setShowOnlyAvailable(e.target.checked)}
								/>
								Show only available
							</label>
						</div>
					</div>
				</header>

				<motion.section className={styles.grid} aria-label="Flash gallery" layout="position">
					{flashData.length === 0 ? (
						<div className={styles.empty}>No flash matches those filters, try another combo.</div>
					) : (
						<AnimatePresence mode="popLayout">
							{flashData.map((img, i) => (
								<motion.button
									key={img.id}
									className={`${styles.tile} ${!img.available ? styles.tileDisabled : ""}`}
									onClick={() => openFrom("flash", i)}
									aria-label={`Open ${img.alt}`}
									disabled={!img.available}
									title={!img.available ? "Claimed" : "Available"}
									variants={tileV}
									initial="hidden"
									animate="show"
									exit="exit"
									layout
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.98 }}
								>
									<img src={img.src} alt={img.alt} loading="lazy" />
									<span className={styles.badgeRow}>
										<span className={styles.badge}>{img.style}</span>
										<span className={`${styles.badge} ${img.available ? styles.badgeOk : styles.badgeMuted}`}>
											{img.available ? "Available" : "Claimed"}
										</span>
									</span>
								</motion.button>
							))}
						</AnimatePresence>
					)}
				</motion.section>
			</motion.section> */}

			{/* ===== Shared Lightbox ===== */}
			<AnimatePresence>
				{idx !== null && activeList[idx] && (
					<motion.div
						className={styles.lightbox}
						onClick={close}
						role="dialog"
						aria-modal="true"
						aria-label="Image viewer"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reduce ? 0 : 0.2 }}
					>
						<button className={styles.close} aria-label="Close" onClick={close}>
							×
						</button>

						<button className={styles.navLeft} aria-label="Previous" onClick={prev}>
							‹
						</button>

						<motion.figure
							className={styles.figure}
							onClick={(e) => e.stopPropagation()}
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.98 }}
							transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
						>
							<img
								className={styles.lbImg}
								src={activeList[idx].src}
								alt={activeList[idx].alt}
							/>
							<figcaption className={styles.caption}>
								<span>{activeList[idx].alt}</span>
								<span className={styles.sep} />
								<span>
									{idx + 1} of {activeList.length}
								</span>
							</figcaption>
						</motion.figure>

						<button className={styles.navRight} aria-label="Next" onClick={next}>
							›
						</button>
					</motion.div>
				)}
			</AnimatePresence>
			{/* ===== More on Instagram ===== */}
			<section className={styles.more}>
				<h2 className={styles.moreTitle}>See more on Instagram</h2>
				<p className={styles.moreCopy}>
					Follow &nbsp;
					<strong >
						<a
							href="https://www.instagram.com/dc_art_collective/"
							target="_blank"
							rel="noreferrer"
							aria-label="Open Instagram @dc_art_collective"
						>
							@dc_art_collective </a>
					</strong>
					&nbsp; for work in progress, healed shots, and flash.
				</p>
				<a
					href="https://www.instagram.com/dc_art_collective/"
					target="_blank"
					rel="noreferrer"
					className={styles.igBtn}
					aria-label="Open Instagram @dc_art_collective"
				>
					View more on Instagram
				</a>
			</section>

		</motion.main >
	);
}
