"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./About.module.css";
import JsonLd from "../components/JsonLd";

const bgImages = ["/images/tattoo-1.jpg", "/images/tattoo-2.jpg", "/images/tattoo-3.jpg"];
const data = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "About Derek Calkins",
  mainEntity: {
    "@type": "Person",
    name: "Derek Calkins",
    url: "https://www.derekcalkinstattoo.com/about"
  }
};

export default function About() {
  const reduce = useReducedMotion();
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  // Smooth page + section variants
  const page = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.12
      }
    }
  };

  const up = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.32, 1, 0.56, 1] } }
  };

  const fade = {
    hidden: { opacity: 0.3 },
    show: { opacity: 1, transition: { duration: 1.3, ease: "easeOut" } }
  };

  // Parallax on scroll (unchanged, but gated)
  useEffect(() => {
    if (reduce) return; // respect reduced motion

    let ticking = false;
    let enabled = false;
    let tiles = [];
    let rows = [];

    const collect = () => {
      tiles = Array.from(document.querySelectorAll(`.${styles.bgTile}`));
      rows = Array.from(document.querySelectorAll(`.${styles.rowImage}`));
    };

    const resetTransforms = () => {
      [...tiles, ...rows].forEach((el) => (el.style.transform = ""));
    };

    const evaluate = () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 960px)").matches;
      enabled = !(prefersReduced || isMobile);
      setParallaxEnabled(enabled);
      if (!enabled) resetTransforms();
    };

    const onScroll = () => {
      if (!enabled || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        tiles.forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "2.5");
          const offset = -y * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.02)`;
        });
        rows.forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "1.3");
          const offset = -y * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
        ticking = false;
      });
    };

    const onResize = () => {
      collect();
      evaluate();
      onScroll();
    };

    collect();
    evaluate();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <motion.main
      className={styles.page}
      initial="hidden"
      animate="show"
      variants={page}
    >
      <JsonLd data={data} />
      {/* background tiles: fade only, no translate to avoid transform conflict */}
      <motion.div className={styles.bgWrap} aria-hidden="true" variants={fade}>
        {bgImages.map((src, i) => (
          <div
            key={i}
            className={styles.bgTile}
            style={{ backgroundImage: `url(${src})` }}
            data-speed={i === 0 ? 0.12 : i === 1 ? 0.15 : 0.19}
          />
        ))}
        <div className={styles.bgVignette} />
      </motion.div>

      {/* artist card */}
      <motion.section
        className={`${styles.card} ${styles.willChange}`}
        role="region"
        aria-label="About Derek Calkins"
        variants={up}
        layout="position">

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
              Derek is a Las Vegas based tattoo artist with 17 years of experience. He specializes in large scale pieces,
              black and grey realism, color realism, and surrealism. His work is bold and detailed, flows with the body,
              and holds up beautifully over time.
            </p>

            <div className={styles.sponsors}>
              <div className={styles.sponsorLabel}>Proudly Sponsored By:</div>
              <section className={styles.sponsorStrip} aria-label="Sponsors">
                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorLabel}>Raw Pigments</div>
                  <img src="/images/raw-logo.jpg" alt="Raw Pigments logo" className={styles.sponsorLogo} />
                </div>

                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorLabel}>Hustle Butter</div>
                  <img src="/images/hustle-logo.jpg" alt="Hustle Butter Deluxe logo" className={styles.sponsorLogo} />
                </div>
              </section>
            </div>
          </div>
        </div>
      </motion.section>

      {/* rows: reveal on first view for extra smoothness */}
      <section className={styles.rows}>
        <motion.div
          className={`${styles.row} ${styles.willChange}`}
          variants={up}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.rowImage} data-speed="0.1">
            <img src="/images/dc-profile-2.jpg" alt="Studio or work in progress" />
          </div>
          <div className={styles.rowText}>
            <h2>Artist Bio</h2>
            <p>
              Derek is known for clean execution and client centered design. He builds pieces that fit the body and age
              gracefully, balancing detail with readability and longevity.
            </p>
            <p>
              He specializes in <strong>Color realism</strong> and <strong>Black and Grey realism</strong>, creating smooth gradients,
              deep contrast, and lifelike depth for portraits, wildlife, and surreal imagery.
            </p>
            <p>
              Every tattoo is planned around flow, placement, and smart negative space so the design reads clearly on day one
              and years later.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.row} ${styles.rowAlt} ${styles.willChange}`}
          variants={up}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.rowText}>
            <h2>Approach</h2>
            <p>
              Longevity and clarity first. Values are mapped for solid blacks, structured mid tones, and intentional highlights.
              That keeps realism readable from a distance and crisp as it heals.
            </p>
            <p>
              The process covers story, placement, and scale. References are gathered, then a composition pass aligns with the body.
              Layouts emphasize flow, balance, and breathable negative space.
            </p>
            <p>
              Before session day you review the plan together. On the day of, stencil placement is adjusted for accuracy, and aftercare
              is explained step by step.
            </p>
          </div>
          <div className={styles.rowImage} data-speed="0.08">
            <img src="/images/dc-profile-3.jpg" alt="Design sketch or equipment" />
          </div>
        </motion.div>

        <motion.div
          className={`${styles.row} ${styles.willChange}`}
          variants={up}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.rowImage} data-speed="0.03">
            <img src="/images/dc-profile-4.jpg" alt="Tattoo convention floor or award moments" />
          </div>
          <div className={styles.rowText}>
            <h2>Conventions and Awards</h2>
            <p>
              Derek is active at major conventions and guest spots. He shares his approach, connects with clients, and learns from peers.
              His work has earned recognition in realism categories.
            </p>
            <ul>
              <li>The Allstars Tattoo Convention in Miami, FL</li>
              <li>Longhorn State Tattoo Expo in Dallas, TX</li>
              <li>Golden State Tattoo Expo in Pasadena, CA</li>
            </ul>
            <p className={styles.summary}>
              For upcoming dates or a full list of recognitions, check social updates or reach out.
            </p>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}
