"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Gallery.module.css";

/* =========
	 Portfolio (existing gallery)
	 ========= */
const RAW = Array.from({ length: 15 }, (_, i) => {
	const idx = i + 1;
	const isColor = idx % 3 === 0;
	return {
		id: `w-${idx}`,
		src: `/images/tattoo-${idx}.jpg`,
		alt: `Tattoo ${idx}`,
		kind: isColor ? "color" : "blackgrey",
	};
});

const FILTERS = [
	{ key: "all", label: "All" },
	{ key: "blackgrey", label: "Black and Grey" },
	{ key: "color", label: "Color" },
	{ key: "popculture", label: "Pop Culture" },
	{ key: "portrait", label: "Portrait" },
];

/* =========
	 Flash (new section)
	 Images live in /public/flash
	 Example files: /public/flash/flash-1.jpg ... flash-12.jpg
	 ========= */
const FLASH = Array.from({ length: 12 }, (_, i) => {
	const idx = i + 1;
	const stylesPool = ["linework", "color", "anime", "surreal"];
	const style = stylesPool[idx % stylesPool.length];
	const available = idx % 5 !== 0; // every 5th is “claimed” just for demo
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
	/* ---- portfolio state ---- */
	const [idx, setIdx] = useState(null); // index within active list
	const [activeSet, setActiveSet] = useState(null); // 'work' | 'flash' | null (for lightbox source)
	const [filter, setFilter] = useState("all");
	const [shuffled, setShuffled] = useState(false);

	/* ---- flash state ---- */
	const [flashStyle, setFlashStyle] = useState("all");
	const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

	/* ---- derived lists ---- */
	const workData = useMemo(() => {
		const base = filter === "all" ? RAW : RAW.filter((x) => x.kind === filter);
		if (!shuffled) return base;
		return [...base].sort((a, b) => ((a.id.length * 37) % 17) - ((b.id.length * 37) % 17));
	}, [filter, shuffled]);

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

	/* ---- reveal on scroll (portfolio section) ---- */
	const gridRef1 = useRef(null);
	useEffect(() => {
		const el = gridRef1.current;
		if (!el) return;
		const tiles = Array.from(el.querySelectorAll(`.${styles.tile}`));
		const io = new IntersectionObserver(
			(entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add(styles.visible)),
			{ rootMargin: "80px 0px", threshold: 0.1 }
		);
		tiles.forEach((t) => io.observe(t));
		return () => io.disconnect();
	}, [workData]);

	/* ---- reveal on scroll (flash section) ---- */
	const gridRef2 = useRef(null);
	useEffect(() => {
		const el = gridRef2.current;
		if (!el) return;
		const tiles = Array.from(el.querySelectorAll(`.${styles.tile}`));
		const io = new IntersectionObserver(
			(entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add(styles.visible)),
			{ rootMargin: "80px 0px", threshold: 0.1 }
		);
		tiles.forEach((t) => io.observe(t));
		return () => io.disconnect();
	}, [flashData]);

	return (
		<main className={styles.page}>
			{/* ===== Portfolio (existing) ===== */}
			<header className={styles.header}>
				<h1 className={styles.title}>Gallery</h1>
				<p className={styles.kicker}>
					A curated collection of my work — from large-scale realism to vibrant pop culture and anime pieces.
				</p>
				<div className={styles.actions}>
					<div className={styles.filters} role="tablist" aria-label="Filter gallery">
						{FILTERS.map((f) => (
							<button
								key={f.key}
								role="tab"
								aria-selected={filter === f.key}
								className={`${styles.pill} ${filter === f.key ? styles.pillActive : ""}`}
								onClick={() => setFilter(f.key)}
							>
								{f.label}
							</button>
						))}
					</div>

					<div className={styles.rightActions}>
						<button
							className={styles.pill}
							onClick={() => setShuffled((s) => !s)}
							aria-pressed={shuffled}
							title="Shuffle order"
						>
							{shuffled ? "Unshuffle" : "Shuffle"}
						</button>
					</div>
				</div>
			</header>

			<section ref={gridRef1} className={styles.grid} aria-label="Portfolio gallery">
				{workData.map((img, i) => (
					<button
						key={img.id}
						className={styles.tile}
						onClick={() => openFrom("work", i)}
						aria-label={`Open ${img.alt}`}
					>
						<img src={img.src} alt={img.alt} loading="lazy" />
						<span className={styles.badge}>{img.kind === "color" ? "Color" : "B & G"}</span>
					</button>
				))}
			</section>

			{/* ===== Flash (new) ===== */}
			<section className={styles.flashSection} aria-label="Pre-Designed Flash" id="flash">
				<header className={styles.header}>
					<h2 className={styles.flashTitle}>Pre-Designed Flash</h2>
					<p className={styles.kicker}>
						One-off original designs—first come, first served. DM or email to claim.
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

				<section ref={gridRef2} className={styles.grid} aria-label="Flash gallery">
					{flashData.length === 0 ? (
						<div className={styles.empty}>No flash matches those filters—try another combo.</div>
					) : (
						flashData.map((img, i) => (
							<button
								key={img.id}
								className={`${styles.tile} ${!img.available ? styles.tileDisabled : ""}`}
								onClick={() => openFrom("flash", i)}
								aria-label={`Open ${img.alt}`}
								disabled={!img.available}
								title={!img.available ? "Claimed" : "Available"}
							>
								<img src={img.src} alt={img.alt} loading="lazy" />
								<span className={styles.badgeRow}>
									<span className={styles.badge}>{img.style}</span>
									<span className={`${styles.badge} ${img.available ? styles.badgeOk : styles.badgeMuted}`}>
										{img.available ? "Available" : "Claimed"}
									</span>
								</span>
							</button>
						))
					)}
				</section>
			</section>

			{/* ===== Shared Lightbox ===== */}
			{idx !== null && activeList[idx] && (
				<div className={styles.lightbox} onClick={close} role="dialog" aria-modal="true" aria-label="Image viewer">
					<button className={styles.close} aria-label="Close" onClick={close}>
						×
					</button>

					<button className={styles.navLeft} aria-label="Previous" onClick={prev}>
						‹
					</button>

					<figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
						<img className={styles.lbImg} src={activeList[idx].src} alt={activeList[idx].alt} />
						<figcaption className={styles.caption}>
							<span>{activeList[idx].alt}</span>
							<span className={styles.sep} />
							<span>
								{idx + 1} of {activeList.length}
							</span>
						</figcaption>
					</figure>

					<button className={styles.navRight} aria-label="Next" onClick={next}>
						›
					</button>
				</div>
			)}
		</main>
	);
}
