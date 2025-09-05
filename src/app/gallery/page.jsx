"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Gallery.module.css";

const RAW = Array.from({ length: 15 }, (_, i) => {
	const idx = i + 1;
	const isColor = idx % 3 === 0; // simple sample tagging
	return {
		id: idx,
		src: `/images/tattoo-${idx}.jpg`,
		alt: `Tattoo ${idx}`,
		kind: isColor ? "color" : "blackgrey",
		likes: 120 + idx * 7,
		comments: 6 + (idx % 5),
	};
});

const FILTERS = [
	{ key: "all", label: "All" },
	{ key: "blackgrey", label: "Black and Grey" },
	{ key: "color", label: "Color" },
	{ key: "popculture", label: "Pop Culture" },
	{ key: "portrait", label: "Portrait" },


];

export default function GalleryPage() {
	const [idx, setIdx] = useState(null); // lightbox index in filtered list
	const [filter, setFilter] = useState("all");
	const [shuffled, setShuffled] = useState(false);

	const data = useMemo(() => {
		const base = filter === "all" ? RAW : RAW.filter(x => x.kind === filter);
		if (!shuffled) return base;
		// lightweight deterministic shuffle for variety
		return [...base].sort((a, b) => (a.id * 37) % 17 - (b.id * 37) % 17);
	}, [filter, shuffled]);

	const open = (i) => setIdx(i);
	const close = () => setIdx(null);
	const prev = (e) => {
		e?.stopPropagation?.();
		setIdx((i) => (i === 0 ? data.length - 1 : i - 1));
	};
	const next = (e) => {
		e?.stopPropagation?.();
		setIdx((i) => (i === data.length - 1 ? 0 : i + 1));
	};

	// Keyboard support
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") close();
			if (idx !== null && e.key === "ArrowLeft") prev();
			if (idx !== null && e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [idx, data.length]);

	// Staggered reveal on scroll
	const gridRef = useRef(null);
	useEffect(() => {
		const el = gridRef.current;
		if (!el) return;
		const tiles = Array.from(el.querySelectorAll(`.${styles.tile}`));
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) entry.target.classList.add(styles.visible);
				});
			},
			{ rootMargin: "80px 0px", threshold: 0.1 }
		);
		tiles.forEach((t) => io.observe(t));
		return () => io.disconnect();
	}, [data, filter, shuffled]);

	return (
		<main className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>Gallery</h1>

				<div className={styles.actions}>
					<div className={styles.filters} role="tablist" aria-label="Filter gallery">
						{FILTERS.map(f => (
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
							onClick={() => setShuffled(s => !s)}
							aria-pressed={shuffled}
							title="Shuffle order"
						>
							{shuffled ? "Unshuffle" : "Shuffle"}
						</button>
					</div>
				</div>
			</header>

			<section
				ref={gridRef}
				className={styles.grid}
				aria-label="Instagram style gallery"
			>
				{data.map((img, i) => (
					<button
						key={img.id}
						className={styles.tile}
						onClick={() => open(i)}
						aria-label={`Open ${img.alt}`}
					>
						<img src={img.src} alt={img.alt} loading="lazy" />
						<span className={styles.badge}>{img.kind === "color" ? "Color" : "B and G"}</span>

					</button>
				))}
			</section>

			{idx !== null && (
				<div
					className={styles.lightbox}
					onClick={close}
					role="dialog"
					aria-modal="true"
					aria-label="Image viewer"
				>
					<button className={styles.close} aria-label="Close" onClick={close}>
						×
					</button>

					<button className={styles.navLeft} aria-label="Previous" onClick={prev}>
						‹
					</button>

					<figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
						<img
							className={styles.lbImg}
							src={data[idx].src}
							alt={data[idx].alt}
						/>
						<figcaption className={styles.caption}>
							<span>{data[idx].alt}</span>
							<span className={styles.sep} />
							<span>{idx + 1} of {data.length}</span>
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