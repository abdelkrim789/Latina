import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = cursorDot.current;
    const ring = cursorRing.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power2.out' });
    };

    const onEnterLink = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.4, duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onEnterHero = () => {
      gsap.to(ring, { scale: 3, borderColor: '#C9A96E', duration: 0.4 });
    };

    const onLeaveHero = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.6)', duration: 0.4 });
    };

    window.addEventListener('mousemove', onMove);

    const links = document.querySelectorAll('a, button, [data-cursor="link"]');
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    const heroEl = document.querySelector('[data-cursor="hero"]');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', onEnterHero);
      heroEl.addEventListener('mouseleave', onLeaveHero);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorDot}
        className="fixed top-0 left-0 w-2 h-2 bg-[#C9A96E] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={cursorRing}
        className="fixed top-0 left-0 w-8 h-8 border border-white/60 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
