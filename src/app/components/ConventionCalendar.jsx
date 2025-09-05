"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./ConventionCalendar.module.css";

export default function ConventionCalendar({ src = "/events.json" }) {
    // prevent hydration mismatch with dates
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [selected, setSelected] = useState(null);

    // parse "YYYY-MM-DD" as a local date at midnight
    function parseLocalDate(str) {
        if (typeof str === "string" && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
            const [y, m, d] = str.split("-").map(Number);
            return new Date(y, m - 1, d);
        }
        const d = new Date(str);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    // fetch events
    useEffect(() => {
        let active = true;
        fetch(src, { cache: "no-store" })
            .then((r) => r.json())
            .then((list) => {
                if (!active) return;
                const cleaned = list.map((e) => {
                    const s = parseLocalDate(e.start);
                    const er = e.end ? parseLocalDate(e.end) : s;
                    const start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
                    const end = new Date(er.getFullYear(), er.getMonth(), er.getDate());
                    const id =
                        e.id ??
                        `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}::${e.title ?? ""}`;
                    return { ...e, id, start, end };
                });
                cleaned.sort((a, b) => a.start - b.start);
                setEvents(cleaned);
                if (cleaned.length && !selected) setSelected(cleaned[0]);
            })
            .catch(() => setEvents([]));
        return () => {
            active = false;
        };
    }, [src]); // do not depend on selected to avoid re-running

    const monthMatrix = useMemo(() => buildMonthMatrix(month), [month]);

    // events mapped to each day inside the visible month
    const eventsByDay = useMemo(() => {
        const map = new Map();
        for (const ev of events) {
            const start = ev.start;
            const end = ev.end || ev.start;
            for (const d of daysBetween(start, end, month)) {
                const key = keyForDate(d);
                if (!map.has(key)) map.set(key, []);
                map.get(key).push(ev);
            }
        }
        return map;
    }, [events, month]);

    // events that touch the visible month
    const monthEvents = useMemo(() => {
        return events.filter(
            (ev) => isSameMonth(ev.start, month) || (ev.end && isSameMonth(ev.end, month))
        );
    }, [events, month]);

    // keep selection in sync with visible month
    useEffect(() => {
        if (!monthEvents.length) {
            setSelected(null);
            return;
        }
        const inThisMonth = selected && monthEvents.some((e) => e.id === selected.id);
        if (!inThisMonth) {
            setSelected(monthEvents[0]);
        }
    }, [month, monthEvents, selected]);

    const prevMonth = () =>
        setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
    const nextMonth = () =>
        setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

    // compute arrow enabled state for the detail card
    const visibleList = monthEvents;
    const currIndex =
        selected && visibleList.length
            ? visibleList.findIndex((e) => e.id === selected.id)
            : -1;
    const canPrev = currIndex > 0;
    const canNext = currIndex > -1 && currIndex < visibleList.length - 1;

    if (!mounted) return null;

    return (
        <section className={styles.wrap} aria-label="Conventions and guest spots">
            <header className={styles.header}>
                <h2 className={styles.title}>Conventions and Guest Spots</h2>
            </header>

            <div className={styles.monthView}>
                <div className={styles.monthBox}>
                    <div className={styles.monthBar}>
                        <button className={styles.nav} onClick={prevMonth} aria-label="Previous month">
                            ‹
                        </button>
                        <div className={styles.monthLabel}>
                            {month.toLocaleString("en-US", { month: "long", year: "numeric" })}
                        </div>
                        <button className={styles.nav} onClick={nextMonth} aria-label="Next month">
                            ›
                        </button>
                    </div>

                    <div className={styles.calendar}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className={`${styles.cell} ${styles.dow}`}>
                                {d}
                            </div>
                        ))}
                        {monthMatrix.map((week, wi) =>
                            week.map((day, di) => {
                                const key = keyForDate(day);
                                const inMonth = day.getMonth() === month.getMonth();
                                const dayEvents = eventsByDay.get(key) || [];
                                const hasEvent = inMonth && dayEvents.length > 0;
                                const isSelectedDay = selected && dayEvents.includes(selected);

                                return (
                                    <button
                                        key={`${wi}-${di}`}
                                        className={[
                                            styles.cell,
                                            styles.day,
                                            !inMonth ? styles.muted : "",
                                            hasEvent ? styles.hasEvent : "",
                                            isSelectedDay ? styles.daySelected : "",
                                        ].join(" ")}
                                        onClick={() => {
                                            if (dayEvents.length) setSelected(dayEvents[0]);
                                        }}
                                        aria-label={`${fmtDayLabel(day)}${dayEvents.length ? `, ${dayEvents.length} event` : ""
                                            }`}
                                        aria-pressed={isSelectedDay}
                                        data-has-event={hasEvent ? "true" : "false"}
                                    >
                                        <span className={styles.dayNum}>{day.getDate()}</span>
                                        <span className={styles.dots}>
                                            {dayEvents.slice(0, 3).map((ev, i) => (
                                                <i
                                                    key={i}
                                                    className={`${styles.dot} ${styles["t_" + ev.type]}`}
                                                    title={ev.title}
                                                />
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <i
                                                    className={styles.dotMore}
                                                    title={`${dayEvents.length - 3} more`}
                                                />
                                            )}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className={styles.detail}>
                    {monthEvents.length === 0 ? (
                        <div className={styles.empty}>
                            No conventions or guest spots scheduled this month.
                        </div>
                    ) : selected ? (
                        <EventCard
                            ev={selected}
                            onPrev={() => cycleEvent(-1)}
                            onNext={() => cycleEvent(1)}
                            canPrev={canPrev}
                            canNext={canNext}
                        />
                    ) : (
                        <div className={styles.empty}>Select a date dot to view details</div>
                    )}
                </div>
            </div>
        </section>
    );

    // no wrap: clamp to first and last event of the visible month
    function cycleEvent(dir) {
        const list = monthEvents;
        if (!list.length || !selected) return;

        const i = list.findIndex((e) => e.id === selected.id);
        if (i === -1) return;

        const target = i + dir;
        if (target < 0 || target >= list.length) return;
        setSelected(list[target]);
    }
}

/* detail card */
function EventCard({ ev, onPrev, onNext, canPrev, canNext }) {
    if (!ev) return null;
    return (
        <div className={styles.card}>
            <div className={styles.cardTop}>
                <span className={`${styles.badge} ${styles["b_" + ev.type]}`}>
                    {labelForType(ev.type)}
                </span>
                <div className={styles.cardNav}>
                    <button
                        type="button"
                        className={`${styles.arrow} ${!canPrev ? styles.arrowDisabled : ""}`}
                        onClick={onPrev}
                        aria-label="Previous event"
                        disabled={!canPrev}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className={`${styles.arrow} ${!canNext ? styles.arrowDisabled : ""}`}
                        onClick={onNext}
                        aria-label="Next event"
                        disabled={!canNext}
                    >
                        ›
                    </button>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{ev.title}</h3>
            <div className={styles.meta}>
                <span className={styles.when}>{formatRange(ev.start, ev.end)}</span>
                <span className={styles.sepDot}>•</span>
                <span className={styles.city}>{ev.city}</span>
            </div>
            {ev.details && <p className={styles.details}>{ev.details}</p>}
            {ev.link ? (
                <a className={styles.link} href={ev.link} target="_blank" rel="noreferrer">
                    Event site
                </a>
            ) : null}
        </div>
    );
}

/* helpers */
function buildMonthMatrix(month) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay()); // back to Sunday
    const weeks = [];
    let d = new Date(start);
    for (let w = 0; w < 6; w++) {
        const row = [];
        for (let i = 0; i < 7; i++) {
            row.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        weeks.push(row);
    }
    return weeks;
}

// inclusive, but only returns days inside currentMonth
function daysBetween(a, b, currentMonth) {
    const out = [];
    const d = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    while (d <= end) {
        if (
            d.getMonth() === currentMonth.getMonth() &&
            d.getFullYear() === currentMonth.getFullYear()
        ) {
            out.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
    }
    return out;
}

function keyForDate(d) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function isSameMonth(d, m) {
    return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth();
}
function monthName(d) {
    return d.toLocaleString("en-US", { month: "short" });
}
function fmt(d) {
    return `${monthName(d)} ${d.getDate()}, ${d.getFullYear()}`;
}
function formatRange(start, end) {
    if (!end) return fmt(start);
    const sameMonth =
        start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
    const endText = sameMonth ? `${end.getDate()}, ${end.getFullYear()}` : fmt(end);
    return sameMonth
        ? `${monthName(start)} ${start.getDate()} to ${endText}`
        : `${fmt(start)} to ${fmt(end)}`;
}
function labelForType(t) {
    if (t === "convention") return "Convention";
    if (t === "expo") return "Expo";
    if (t === "guest") return "Guest spot";
    return "Event";
}
function fmtDayLabel(d) {
    return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
