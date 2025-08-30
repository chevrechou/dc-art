"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import { FaEnvelope, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    if (!email) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to subscribe");

      setStatus({ type: "success", msg: "Check your inbox to confirm." });
      if (emailRef.current) emailRef.current.value = "";
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.grid}>
        {/* left column */}
        <div>
          <h4 className={styles.h4}>Derek Calkins</h4>
        </div>

        {/* center column: newsletter */}
        <div className={styles.newsletter}>
          <h3 className={styles.title}>Get studio updates</h3>
          <p className={styles.copy}>
            Be first to know about flash, openings, and convention dates.
          </p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <input
              ref={emailRef}
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className={styles.input}
              aria-label="Email address"
              autoComplete="email"
            />
            <button className={styles.button} disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {status.msg && (
            <p
              className={
                status.type === "success" ? styles.success : styles.error
              }
              role="status"
            >
              {status.msg}
            </p>
          )}

          <p className={styles.smallNote}>No spam. Unsubscribe anytime.</p>
        </div>

        {/* right column */}
        <div className={styles.right}>
          <h4 className={styles.h4}>Visit</h4>
          <address className={styles.addr}>
            <FaMapMarkerAlt className={styles.icon} /> Las Vegas NV -  By appointment only
          </address>
          <div className={styles.links}>
            <div>
              <a href="mailto:dcartcollective514@gmail.com">
                <FaEnvelope className={styles.icon} /> dcartcollective514@gmail.com
              </a>
            </div>
            <div><a
              href="https://www.instagram.com/dc_art_collective/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram className={styles.icon} /> @dc_art_collective
            </a>
            </div>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} Derek Calkins. All rights reserved.
      </div>
    </footer>
  );
}
