"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/contact", label: "Contact" },
  ];
  // Hide on scroll (desktop and mobile)
  useEffect(() => {
    const onScroll = () => {
      setHidden(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHidden(false), 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Close menu on Escape or viewport resize up to desktop
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 768) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const stateClass = hidden ? styles.animHide : styles.animShow;

  return (
    <header className={`${styles.header} ${stateClass}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          Derek Calkins
        </Link>

        {/* Desktop nav */}
        <nav className={styles.navDesktop}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Burger button (mobile) */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        className={`${styles.mobileWrap} ${open ? styles.open : ""}`}
      >
        <nav className={styles.navMobile} aria-label="Mobile Primary">
          <Link href="/" className={styles.mLink} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/about" className={styles.mLink} onClick={() => setOpen(false)}>About</Link>
          <Link href="/gallery" className={styles.mLink} onClick={() => setOpen(false)}>Gallery</Link>
          <Link href="/upcoming" className={styles.mLink} onClick={() => setOpen(false)}>Upcoming</Link>
          <Link href="/contact" className={styles.mLink} onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      </div>

      {/* Clickable dim overlay */}
      {open && <button className={styles.scrim} aria-label="Close menu overlay" onClick={() => setOpen(false)} />}
    </header>
  );
}
