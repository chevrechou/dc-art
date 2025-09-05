// app/upcoming/page.jsx
import ConventionCalendar from "../components/ConventionCalendar";
import styles from "./Upcoming.module.css";

export const metadata = {
  title: "Upcoming - Conventions and Guest Spots",
  description: "See Derek Calkins' upcoming tattoo conventions, expos, and guest artist appearances.",
};

export default function UpcomingPage() {
  return (
    <main className={styles.page}>
      {/* Page header */}
      <header className={styles.hero}>
        <h1 className={styles.title}>Upcoming Events</h1>
        <p className={styles.subhead}>
          Follow Derek’s journey across conventions, expos, and guest spots.
          Meet in person, book a session, or just stop by to say hello —
          these are the best opportunities to see the work live.
        </p>
      </header>

      {/* Calendar */}
      <ConventionCalendar />
    </main>
  );
}
