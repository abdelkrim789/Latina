'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

type EntryExperienceProps = {
  prompt: string;
  skip: string;
  onComplete: () => void;
};

export function EntryExperience({ prompt, skip, onComplete }: EntryExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const shoeRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLButtonElement>(null);

  const [visible, setVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [animating, setAnimating] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 4,
        x: -120 + Math.random() * 240,
        y: -140 + Math.random() * 220
      })),
    []
  );

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited') === 'true';

    if (hasVisited) {
      setVisible(false);
      setShowSkip(false);
      onComplete();
      return;
    }

    const pulseTween = boxRef.current
      ? gsap.to(boxRef.current, {
          boxShadow: '0 0 60px rgba(196,67,90,0.4)',
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      : null;

    const promptTween = promptRef.current
      ? gsap.fromTo(promptRef.current, { autoAlpha: 0 }, { autoAlpha: 1, delay: 1, duration: 0.6 })
      : null;

    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      clearTimeout(skipTimer);
      pulseTween?.kill();
      promptTween?.kill();
    };
  }, [onComplete]);

  const complete = () => {
    localStorage.setItem('hasVisited', 'true');

    if (!rootRef.current) {
      setVisible(false);
      onComplete();
      return;
    }

    gsap.to(rootRef.current, {
      autoAlpha: 0,
      duration: 0.4,
      onComplete: () => {
        setVisible(false);
        onComplete();
      }
    });
  };

  const openBox = () => {
    if (animating || !lidRef.current || !shoeRef.current || !flashRef.current || !boxRef.current || !rootRef.current) {
      return;
    }

    setAnimating(true);

    const timeline = gsap.timeline({ onComplete: complete });

    timeline
      .to(lidRef.current, {
        rotateX: -115,
        transformOrigin: 'top center',
        duration: 0.9,
        ease: 'power2.out'
      })
      .to(
        shoeRef.current,
        {
          y: -80,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'elastic.out(1,0.6)'
        },
        0.4
      )
      .to(
        '[data-particle="true"]',
        {
          x: (_, target: HTMLElement) => Number(target.dataset.x ?? 0),
          y: (_, target: HTMLElement) => Number(target.dataset.y ?? 0),
          autoAlpha: 0,
          duration: 1.2,
          ease: 'power2.out',
          stagger: {
            from: 'center',
            amount: 0.25
          }
        },
        0.35
      )
      .to(
        boxRef.current,
        {
          autoAlpha: 0,
          scale: 1.1,
          duration: 0.6
        },
        0.8
      )
      .fromTo(
        flashRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 0.8, duration: 0.2, yoyo: true, repeat: 1 },
        1.1
      );
  };

  if (!visible) {
    return null;
  }

  return (
    <div ref={rootRef} className="fixed inset-0 z-[60] flex items-center justify-center bg-void">
      <div ref={flashRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" />
      <div className="relative flex flex-col items-center gap-5">
        {showSkip ? (
          <button
            type="button"
            onClick={complete}
            className="absolute -top-28 right-0 rounded border border-[rgba(232,234,240,0.2)] px-3 py-1 text-[12px] text-pearl transition-colors hover:border-ember"
          >
            {skip}
          </button>
        ) : null}

        <button
          ref={boxRef}
          type="button"
          onClick={openBox}
          className="entry-box relative h-[180px] w-[280px] rounded-md border border-mauve/60 bg-crimson/80"
          aria-label="Open luxury shoe box"
        >
          <div
            ref={lidRef}
            className="absolute left-0 top-0 h-[60px] w-full rounded-t-md border-b border-ember/30 bg-gradient-to-b from-[#a12d43] to-crimson"
          />

          <div
            ref={shoeRef}
            className="absolute left-1/2 top-[68%] h-[56px] w-[150px] -translate-x-1/2 translate-y-[60px] rounded-[60%_30%_50%_30%] border border-blush/30 bg-gradient-to-r from-blush/20 to-pearl/20 opacity-0"
          />

          <div className="pointer-events-none absolute inset-0">
            {particles.map((particle) => (
              <span
                key={particle.id}
                data-particle="true"
                data-x={particle.x}
                data-y={particle.y}
                className="absolute left-1/2 top-1/2 rounded-full bg-ember/80 opacity-100"
                style={{
                  width: particle.size,
                  height: particle.size,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        </button>

        <p ref={promptRef} className="font-headline text-[18px] italic tracking-[0.02em] text-blush opacity-0">
          {prompt}
        </p>
      </div>
    </div>
  );
}
