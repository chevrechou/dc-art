"use client";
import { useEffect, useRef } from "react";
import styles from "./DiagonalBG.module.css";

export default function DiagonalBG({
  images = [],
  intensity = 0.15,      // 0.04 to 0.14 recommended
  mouseTilt = 0.5,       // 0 to disable
}) {
  const railRef = useRef(null);

  // useEffect(() => {
  //   const rail = railRef.current;
  //   if (!rail) return;

  //   const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  //   const isMobile = window.matchMedia("(max-width: 900px)").matches;
  //   let enabled = !(prefersReduced || isMobile);
  //   let ticking = false;
  //   let currentTiltX = 0;

  //   const setTransform = (y) => {
  //     // y is scrollY
  //     const offset = 0//-(y * intensity); // move opposite scroll
  //     // combine the base rotate/scale from CSS with a translate for parallax
  //     rail.style.transform = `translate3d(0, ${offset}px, 0) rotate(-12deg) scale(1.15)`;
  //   };

  //   const onScroll = () => {
  //     if (!enabled) return;
  //     if (ticking) return;
  //     ticking = true;
  //     requestAnimationFrame(() => {
  //       setTransform(window.scrollY || 0);
  //       ticking = false;
  //     });
  //   };

  //   const onResize = () => {
  //     const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  //     const mobile = window.matchMedia("(max-width: 900px)").matches;
  //     enabled = !(reduced || mobile);
  //     if (!enabled) {
  //       rail.style.transform = `rotate(-12deg) scale(1.15)`; // reset to base
  //     } else {
  //       setTransform(window.scrollY || 0);
  //     }
  //   };

  //   // optional micro tilt with mouse for depth
  //   const onMouseMove = (e) => {
  //     if (!enabled || mouseTilt <= 0) return;
  //     const { innerWidth, innerHeight } = window;
  //     const nx = (e.clientX / innerWidth) * 2 - 1;   // -1..1
  //     const ny = (e.clientY / innerHeight) * 2 - 1;  // -1..1
  //     // small translate based on cursor
  //     const tiltX = nx * 10 * mouseTilt;  // px
  //     const tiltY = ny * 4 * mouseTilt;  // px
  //     // keep current scroll offset
  //     const y = window.scrollY || 0;
  //     const offset = -(y * intensity);
  //     rail.style.transform = `translate3d(${tiltX}px, ${offset + tiltY}px, 0) rotate(-12deg) scale(1.15)`;
  //     currentTiltX = tiltX;
  //   };

  //   // init
  //   // onResize();
  //   // onScroll();

  //   // window.addEventListener("scroll", onScroll, { passive: true });
  //   // window.addEventListener("resize", onResize);
  //   // window.addEventListener("mousemove", onMouseMove);

  //   return () => {
  //     // window.removeEventListener("scroll", onScroll);
  //     // window.removeEventListener("resize", onResize);
  //     // window.removeEventListener("mousemove", onMouseMove);
  //   };
  // }, [intensity, mouseTilt]);

  const list = images.length
    ? images
    : [
        "/images/tattoo-3.jpg",
        "/images/gallery/bg/bg-5.jpeg",
       "/images/gallery/pop/pop-culture-12.jpeg",
        "/images/gallery/pop/pop-culture-10.jpeg",
        "/images/gallery/color/color-6.jpeg",
        "/images/tattoo-6.jpg",
      ];

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.stripes} ref={railRef}>
        {list.map((src, i) => (
          <div key={i} className={styles.stripe} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
