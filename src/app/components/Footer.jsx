"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { FaEnvelope, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.grid}>
        {/* left column */}
        <div>
          <h4 className={styles.h4}>Derek Calkins</h4>
        </div>

        {/* center column: Substack embed */}
        <div className={styles.newsletter}>
          <h3 className={styles.title}>Get studio updates</h3>
          <p className={styles.copy}>
            Subscribe for free tattoo news, flash drops, and openings.
          </p>
          <iframe
            src="https://michael585.substack.com/embed"
            width="500"
            height="150"
            className="substack-iframe"
            style={{ border: "1px solid #a7a7a7", background: "#340404ff" }}

            title="Substack signup"
          ></iframe>
          <p className={styles.smallNote}>No spam. Unsubscribe anytime.</p>
        </div>

        {/* right column */}
        <div className={styles.right}>
          <h4 className={styles.h4}>Visit</h4>
          <address className={styles.addr}>
            <FaMapMarkerAlt className={styles.icon} />
            <div className={styles.addrText}>
              <div> Affinity Ink </div>
              <div>
                6910 South Rainbow
                Boulevard Unit 107, Las Vegas, Nevada 89118, United States
              </div>
            </div>

          </address>
          <div className={styles.links}>
            <div>
              <a href="mailto:dcartcollective514@gmail.com">
                <FaEnvelope className={styles.icon} /> dcartcollective514@gmail.com
              </a>
            </div>
            <div>
              <a
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
