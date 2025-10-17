"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./FrameNav.module.css";

export default function FrameNav() {
  const [hidden, setHidden] = useState(false);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setHidden(true);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setHidden(false), 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer.current);
    };
  }, []);

  const cls = (side) =>
    `${styles.panel} ${styles[side]} ${hidden ? styles.hidden : ""}`;

  return (
    <>
      <div className={cls("top")}>
        <Link href="/" className={styles.link} aria-label="Home">Home</Link>
      </div>

      <div className={cls("left")}>
        <Link href="/about" className={styles.link} aria-label="About">About</Link>
      </div>

      <div className={cls("right")}>
        <Link href="/gallery" className={styles.link} aria-label="Gallery">Gallery</Link>
      </div>

      <div className={cls("bottom")}>
        <Link href="/contact" className={styles.link} aria-label="Contact">Contact</Link>
      </div>
    </>
  );
}
