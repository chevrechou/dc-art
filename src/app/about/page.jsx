"use client";
import { useEffect, useRef } from "react";
import styles from "./About.module.css";

const bgImages = [
  "/images/tattoo-1.jpg",
  "/images/tattoo-2.jpg",
  "/images/tattoo-3.jpg",
];

export default function About() {
  const bgRefs = useRef([]);
  const rowImgRefs = useRef([]);

  useEffect(() => {
    const tiles = bgRefs.current.filter(Boolean);
    const rows = rowImgRefs.current.filter(Boolean);
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const bleed = window.innerHeight * 0.08; // matches --bg-bleed: 8vh
        // tiles.forEach(el => {
        //   const speed = parseFloat(el.dataset.speed || "0.03"); // small speed
        //   const raw = -(window.scrollY * speed);
        //   const y = Math.max(-bleed, Math.min(bleed, raw));
        //   el.style.transform = `translate3d(0, ${y}px, 0) scale(1.12)`;
        // });
        // background tiles parallax
        tiles.forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "0.8");
          // const y = Math.max(-bleed, Math.min(bleed, raw));
          el.style.transform = `translate3d(0, ${-y * speed}px, 0) scale(1.02)`;
        });

        // row images parallax, lighter amount
        rows.forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "0.12");
          el.style.transform = `translate3d(0, ${-y * speed}px, 0)`;
        });

        ticking = false;
      });
    };

    // reduced motion: disable transforms
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <main className={styles.page}>
      {/* Parallax background tiles */}
      <div className={styles.bgWrap} aria-hidden="true">
        {bgImages.map((src, i) => (
          <div
            key={i}
            className={styles.bgTile}
            style={{ backgroundImage: `url(${src})` }}
            data-speed={i === 0 ? 0.15 : i === 1 ? 0.28 : 0.42}
            ref={(el) => (bgRefs.current[i] = el)}
          />
        ))}
        <div className={styles.bgVignette} />
      </div>

      {/* Artist card */}
      <section className={styles.card} role="region" aria-label="About Derek Calkins">
        <div className={styles.head}>
          <div className={styles.headshot}>
            <img src="/images/dc-profile.jpg" alt="Derek Calkins headshot" />
          </div>

          <div className={styles.titleBlock}>
            <h1 className={styles.name}>
              Derek Calkins
              <span className={styles.aka}> AKA "DC Art" </span>
            </h1>

            <ul className={styles.highlights}>
              <li>Black and Grey Realism</li>
              <li>Color Realism</li>
              <li>Pop Culture</li>
            </ul>

            <p className={styles.summary}>
              Las Vegas based tattoo artist with 17 years of experience. I specialize in
              large scale pieces, black and grey realism, color realism, surrealism, and pop culture.
            </p>

            <div className={styles.sponsorLabel}>Proudly Sponsored By:</div>
            <section className={styles.sponsorStrip} aria-label="Sponsors">
              <a
                href="https://rawpigments.com"
                target="_blank"
                rel="noreferrer"
                className={styles.sponsorCard}
              >
                <img src="/images/raw-logo.jpg" alt="Raw Pigments logo" className={styles.sponsorLogo} />
              </a>
              <a
                href="https://hustlebutter.com"
                target="_blank"
                rel="noreferrer"
                className={styles.sponsorCard}
              >
                <img src="/images/hustle-logo.jpg" alt="Hustle Butter Deluxe logo" className={styles.sponsorLogo} />
              </a>
            </section>
          </div>
        </div>
      </section>

      {/* About rows */}
      <section className={styles.rows}>
        {/* Row 1: image | text */}
        <div className={styles.row}>
          <div
            className={styles.rowImage}
            ref={(el) => (rowImgRefs.current[0] = el)}
            data-speed="0.015"
          >
            <img src="/images/dc-profile-2.jpg" alt="Studio or work in progress" />
          </div>
          <div className={styles.rowText}>
            <h2>Artist Bio</h2>
            <p>
              Derek is a Las Vegas based tattoo artist known for clean execution and
              client centered design. He builds pieces that fit the body well and age
              gracefully, always balancing detail with readability and longevity.
            </p>
            <p>
              His primary focus is <strong>Black and Grey and Color Realism</strong>. He creates
              smooth gradients, deep contrast, and lifelike depth that bring portraits,
              wildlife, and surreal imagery to life. He also works in{" "}
              <strong>Color realism</strong>, blending tones to achieve vibrant yet
              natural results that hold their integrity over time.
            </p>
            <p>
              Derek has a passion for strong design and composition. Every tattoo is
              planned around the body’s flow with careful attention to placement, scale,
              and negative space so the piece reads clearly on day one and still looks
              powerful years later.
            </p>
          </div>
        </div>

        {/* Row 2: text | image */}
        <div className={`${styles.row} ${styles.rowAlt}`}>
          <div className={styles.rowText}>
            <h2>Approach</h2>
            <p>
              Every tattoo is built for longevity and clarity. Derek maps values first
              to ensure solid blacks, structured mid tones, and intentional highlights,
              which keeps realism readable from a distance and crisp as it heals.
            </p>
            <p>
              The process starts with a conversation about story, placement, and scale.
              Reference gathering follows, then a composition pass that considers the
              body’s lines, movement, and how the piece will connect to existing or
              future work. Layouts emphasize flow, balance, and smart use of negative
              space so the design breathes on skin.
            </p>
            <p>
              Before session day, you review the plan together and lock the strategy for
              sessions, including breakpoints for large projects. On the day of, stencil
              placement is adjusted with you for accuracy. Aftercare is explained in clear
              steps because healed results are part of the art.
            </p>
          </div>
          <div
            className={styles.rowImage}
            ref={(el) => (rowImgRefs.current[1] = el)}
            data-speed="0.08"
          >
            <img src="/images/dc-profile-3.jpg" alt="Design sketch or equipment" />
          </div>
        </div>

        {/* Row 3: Conventions and Awards */}
        <div className={styles.row}>
          <div
            className={styles.rowImage}
            ref={(el) => (rowImgRefs.current[2] = el)}
            data-speed="0.06"
          >
            <img src="/images/dc-profile-4.jpg" alt="Tattoo convention floor or award moments" />
          </div>
          <div className={styles.rowText}>
            <h2>Conventions and Awards</h2>
            <p>
              Derek actively participates in major tattoo conventions and guest spots,
              where he shares his approach to composition and realism, connects with
              clients, and learns from peers. His work has earned recognition in realism
              focused categories and he continues to refine his craft through these
              events.
            </p>
            <ul>
              <li>The Allstars Tattoo Convention in Miami, FL</li>
              <li>Longhorn State Tattoo Expo in Dallas, TX</li>
              <li>Golden State Tattoo Expo in Pasadena, CA</li>
            </ul>
            <p className={styles.summary}>
              For upcoming convention dates or a full list of recognitions, please check
              social updates or reach out directly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
