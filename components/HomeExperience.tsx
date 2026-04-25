'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { FixedScene } from '@/components/FixedScene';

gsap.registerPlugin(ScrollTrigger);

type HomeExperienceProps = {
  locale: string;
  hidden: boolean;
};

export function HomeExperience({ locale, hidden }: HomeExperienceProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const t = useTranslations('home');

  useEffect(() => {
    if (hidden) {
      return;
    }

    let splitInstance: { chars?: Element[]; revert?: () => void } | null = null;

    const setup = async () => {
      if (!titleRef.current) {
        return;
      }

      try {
        const mod = await import('gsap/SplitText');
        const SplitText = mod.SplitText || mod.default;
        gsap.registerPlugin(SplitText);
        splitInstance = new SplitText(titleRef.current, { type: 'chars,words' });

        if (splitInstance?.chars) {
          gsap.from(splitInstance.chars, {
            y: 46,
            autoAlpha: 0,
            stagger: 0.03,
            duration: 1,
            ease: 'power4.out'
          });
        }
      } catch {
        gsap.from(titleRef.current, { y: 46, autoAlpha: 0, duration: 1, ease: 'power4.out' });
      }

      gsap.fromTo(
        '.reveal-block',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.reveal-block',
            start: 'top 85%'
          }
        }
      );
    };

    setup();

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      splitInstance?.revert?.();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [hidden]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative min-h-screen overflow-x-hidden bg-void"
      aria-hidden={hidden}
    >
      <FixedScene />

      <main className="relative z-10 px-6 pb-20 pt-8 text-pearl md:px-12">
        <header className="reveal-block flex items-center justify-between border-b border-mauve/60 pb-5">
          <div className="font-headline text-3xl italic tracking-[0.05em]">LATINA</div>
          <div className="flex gap-2 text-xs text-pearl/75">
            <span className={locale === 'fr' ? 'text-ember' : ''}>FR</span>
            <span>/</span>
            <span className={locale === 'en' ? 'text-ember' : ''}>EN</span>
            <span>/</span>
            <span className={`${locale === 'ar' ? 'text-ember font-arabic' : ''}`}>AR</span>
          </div>
        </header>

        <section className="flex min-h-[75vh] items-center py-16">
          <div className="max-w-5xl space-y-7">
            <p className="reveal-block font-body text-sm tracking-[0.2em] text-copper">{t('trustTagline')}</p>
            <h1 ref={titleRef} className="font-headline text-5xl italic leading-[0.95] text-pearl md:text-8xl">
              {t('headline')}
            </h1>
            <p className="reveal-block max-w-2xl font-body text-base font-light leading-relaxed text-blush/90">
              {t('subheadline')}
            </p>
            <div className="reveal-block inline-flex items-center rounded-full border border-ember/60 px-5 py-2 font-accent text-lg text-blush shadow-[0_0_30px_var(--color-glow)]">
              {t('startingFrom')}
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {['01', '02', '03'].map((index) => (
            <article
              key={index}
              className="reveal-block rounded-xl border border-mauve/60 bg-layer/70 p-6 backdrop-blur-sm"
            >
              <p className="font-accent text-copper">{index}</p>
              <h2 className="mt-2 font-headline text-3xl text-pearl">{t(`cards.${index}.title`)}</h2>
              <p className="mt-3 font-body text-sm text-blush/90">{t(`cards.${index}.text`)}</p>
            </article>
          ))}
        </section>
      </main>
    </motion.div>
  );
}
