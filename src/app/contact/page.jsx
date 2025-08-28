"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Contact.module.css";
import DiagonalBG from "../components/DiagonalBG";

const STUDIO = {
  name: "DC Art - Derek Calkins",
  phone: "+1-702-555-0123",         // <--- replace
  email: "booking@dcartstudio.com", // <--- replace
  ig: "https://instagram.com/dcart",// <--- replace
  address: "123 Ink Ave, Las Vegas, NV 89101", // <--- replace
  maps: "https://maps.apple.com/?q=123+Ink+Ave+Las+Vegas+NV+89101" // or Google Maps link
};

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [placement, setPlacement] = useState("");
  const [size, setSize] = useState("");
  const [style, setStyle] = useState("Black and Grey Realism");
  const [budget, setBudget] = useState("");
  const [availability, setAvailability] = useState("");
  const [refs, setRefs] = useState("");
  const [notes, setNotes] = useState("");

  const subject = useMemo(() => {
    const who = fullName ? ` from ${fullName}` : "";
    const what = style ? ` - ${style}` : "";
    return `Tattoo Inquiry${what}${who}`;
  }, [fullName, style]);

  const body = useMemo(() => {
    const lines = [
      `Hi Derek,`,
      ``,
      `I would like to book a tattoo.`,
      fullName ? `Name: ${fullName}` : null,
      replyEmail ? `Email: ${replyEmail}` : null,
      phone ? `Phone: ${phone}` : null,
      placement ? `Placement: ${placement}` : null,
      size ? `Approx size: ${size}` : null,
      style ? `Style: ${style}` : null,
      budget ? `Budget: ${budget}` : null,
      availability ? `Availability: ${availability}` : null,
      refs ? `Reference links: ${refs}` : null,
      notes ? `Notes: ${notes}` : null,
      ``,
      `Thank you`
    ].filter(Boolean);
    return lines.join("\n");
  }, [fullName, replyEmail, phone, placement, size, style, budget, availability, refs, notes]);

  const bodyURI = useMemo(() => encodeURIComponent(body), [body]);
  const subjURI = useMemo(() => encodeURIComponent(subject), [subject]);

  const mailtoHref = useMemo(() => {
    return `mailto:${encodeURIComponent(STUDIO.email)}?subject=${subjURI}&body=${bodyURI}`;
  }, [subjURI, bodyURI]);

  const smsHref = useMemo(() => {
    const base = `sms:${STUDIO.phone}`;
    const sep = navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") ? "&" : "?";
    return `${base}${sep}body=${bodyURI}`;
  }, [bodyURI]);

  const copyBtnRef = useRef(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const copyBody = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      copyBtnRef.current?.focus();
    } catch {
      // no-op
    }
  };

  return (
    <main className={styles.page}>
        <DiagonalBG/>
      <header className={styles.hero}>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.kicker}>Best way to reach Derek for new projects and bookings.</p>
        <div className={styles.quickActions}>
          <a className={styles.action} href={`tel:${STUDIO.phone}`} aria-label="Call studio">Call</a>
          <a className={styles.action} href={`sms:${STUDIO.phone}`} aria-label="Text studio">Text</a>
          <a className={styles.action} href={`mailto:${STUDIO.email}`} aria-label="Email studio">Email</a>
          <a className={styles.action} href={STUDIO.ig} target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
        </div>
      </header>

      <section className={styles.infoGrid} aria-label="Studio information">
        <div className={styles.infoCard}>
          <h2 className={styles.h2}>Studio</h2>
          <p className={styles.p}>{STUDIO.name}</p>
          <p className={styles.p}><a className={styles.link} href={STUDIO.maps} target="_blank" rel="noreferrer">{STUDIO.address}</a></p>
          <ul className={styles.meta}>
            <li>Hours - by appointment</li>
            <li>Parking - street and lot behind the shop</li>
            <li>18+ with valid ID - no minors</li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h2 className={styles.h2}>Booking tips</h2>
          <ul className={styles.meta}>
            <li>Tell me placement, size, and style</li>
            <li>Share 1 to 3 reference links</li>
            <li>Mention target budget and availability</li>
          </ul>
          <p className={styles.pSmall}>Average wait is 2 to 6 weeks depending on project size.</p>
        </div>

        <div className={styles.infoCard}>
          <h2 className={styles.h2}>Policies</h2>
          <ul className={styles.meta}>
            <li>Deposits are required to secure dates</li>
            <li>48 hour reschedule notice</li>
            <li>Aftercare instructions will be provided</li>
          </ul>
        </div>
      </section>

      <section className={styles.formWrap} aria-label="Message builder">
        <h2 className={styles.h2}>Build your message</h2>
        <p className={styles.pSmall}>Fill what you can. You can copy or open your mail or text app with this message.</p>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.row}>
            <label className={styles.label}>
              Full name
              <input className={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe" />
            </label>
            <label className={styles.label}>
              Reply email
              <input className={styles.input} type="email" value={replyEmail} onChange={e => setReplyEmail(e.target.value)} placeholder="you@example.com" />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Phone
              <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
            </label>
            <label className={styles.label}>
              Placement
              <input className={styles.input} value={placement} onChange={e => setPlacement(e.target.value)} placeholder="Forearm outer - right" />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Approx size
              <input className={styles.input} value={size} onChange={e => setSize(e.target.value)} placeholder="6 in tall by 3 in wide" />
            </label>
            <label className={styles.label}>
              Style
              <select className={styles.input} value={style} onChange={e => setStyle(e.target.value)}>
                <option>Black and Grey Realism</option>
                <option>Color Realism</option>
                <option>Surrealism</option>
                <option>Pop culture</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Budget
              <input className={styles.input} value={budget} onChange={e => setBudget(e.target.value)} placeholder="$500 to $800" />
            </label>
            <label className={styles.label}>
              Availability
              <input className={styles.input} value={availability} onChange={e => setAvailability(e.target.value)} placeholder="Weekdays after 2 pm" />
            </label>
          </div>

          <label className={styles.label}>
            Reference links
            <input className={styles.input} value={refs} onChange={e => setRefs(e.target.value)} placeholder="Paste 1 to 3 links separated by commas" />
          </label>

          <label className={styles.label}>
            Notes
            <textarea className={styles.textarea} rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any story, must include, or cover up details" />
          </label>
        </form>

        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <span className={styles.subjLabel}>Subject</span>
            <span className={styles.subject}>{subject}</span>
          </div>
          <pre className={styles.preview} aria-label="Message preview">{body}</pre>
          <div className={styles.outputActions}>
            <button ref={copyBtnRef} className={styles.primaryBtn} onClick={copyBody}>
              {copied ? "Copied" : "Copy message"}
            </button>
            <a className={styles.secondaryBtn} href={mailtoHref}>Open in Mail</a>
            <a className={styles.secondaryBtn} href={smsHref}>Open in Texts</a>
          </div>
          <p className={styles.disclaimer}>
            This does not send anything. It prepares a message you can copy or opens your email or text app with the message filled in.
          </p>
        </div>
      </section>
    </main>
  );
}
