import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from '../components/HeroScene';
import MagneticButton from '../components/MagneticButton';
import { FEATURED_PRODUCTS, CATEGORIES } from '../data/mockData';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();

  // Refs
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const collectionsRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const manifestoTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero entrance ──────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(heroLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power4.inOut' }
      )
      .fromTo(heroTitleRef.current?.querySelectorAll('.word') ?? [],
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out' },
        '-=0.6'
      )
      .fromTo(heroSubRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(heroCTARef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

      // ── Marquee infinite scroll ────────────────────────────
      if (marqueeRef.current) {
        const inner = marqueeRef.current.querySelector('.marquee-inner');
        gsap.to(inner, {
          xPercent: -50,
          duration: 18,
          ease: 'none',
          repeat: -1,
        });
      }

      // ── Story section — horizontal panels ─────────────────
      if (storyRef.current) {
        const panels = storyRef.current.querySelectorAll('.story-panel');
        panels.forEach((panel) => {
          gsap.fromTo(panel.querySelectorAll('.reveal-line'),
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 75%',
                toggleActions: 'play none none none',
              }
            }
          );
        });

        // Parallax images in story
        storyRef.current.querySelectorAll('.story-img').forEach((img) => {
          gsap.fromTo(img,
            { scale: 1.15 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              }
            }
          );
        });
      }

      // ── Collections — stagger reveal ──────────────────────
      if (collectionsRef.current) {
        gsap.fromTo(collectionsRef.current.querySelectorAll('.collection-card'),
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: collectionsRef.current,
              start: 'top 70%',
            }
          }
        );
      }

      // ── Featured products ──────────────────────────────────
      if (featuredRef.current) {
        gsap.fromTo(featuredRef.current.querySelectorAll('.product-card'),
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top 72%',
            }
          }
        );
      }

      // ── Manifesto — word-by-word reveal ───────────────────
      if (manifestoTextRef.current) {
        const words = manifestoTextRef.current.querySelectorAll('.manifesto-word');
        gsap.fromTo(words,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: 'top 60%',
              end: 'center 40%',
              scrub: 1,
            }
          }
        );
      }

    });

    return () => ctx.revert();
  }, []);

  const manifestoWords = "We don't make shoes. We make the moment you walk in.".split(' ');

  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        data-cursor="hero"
        className="relative h-screen flex items-center overflow-hidden"
      >
        {/* 3D Scene — right side */}
        <div className="absolute inset-0 lg:left-[45%]">
          <HeroScene />
        </div>

        {/* Gradient overlay left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-3xl">
          {/* Top label */}
          <div ref={heroLineRef} className="flex items-center gap-4 mb-10 origin-left">
            <div className="h-px w-12 bg-[#C9A96E]" />
            <span className="text-[#C9A96E] text-[10px] uppercase tracking-[0.5em] font-medium">
              Collection 2026
            </span>
          </div>

          {/* Main title */}
          <h1
            ref={heroTitleRef}
            className="text-[clamp(3.5rem,9vw,8rem)] font-serif leading-[0.88] tracking-tight mb-8 overflow-hidden"
          >
            {['Born', 'to be', 'Worn.'].map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <span className="word block">
                  {i === 1 ? (
                    <em className="not-italic text-[#C9A96E]">{word}</em>
                  ) : word}
                </span>
              </span>
            ))}
          </h1>

          <p ref={heroSubRef} className="text-[#F5F0E8]/50 text-base md:text-lg font-light leading-relaxed max-w-md mb-12 tracking-wide">
            Handcrafted in Florence. Worn by women who write their own story.
          </p>

          <div ref={heroCTARef} className="flex items-center gap-6">
            <MagneticButton
              onClick={() => navigate('/catalog')}
              className="group relative px-10 py-5 bg-[#C9A96E] text-[#0A0A0A] text-[11px] uppercase tracking-[0.4em] font-bold overflow-hidden"
            >
              <span className="relative z-10">Explore Collection</span>
              <span className="absolute inset-0 bg-[#F5F0E8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            </MagneticButton>

            <button
              onClick={() => navigate('/catalog')}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors duration-300 group"
            >
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-14" />
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
          <span className="text-[9px] uppercase tracking-[0.5em]">Scroll</span>
          <div className="w-px h-12 bg-[#F5F0E8] origin-top animate-[scaleY_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Corner index */}
        <div className="absolute top-8 right-8 text-[9px] uppercase tracking-[0.4em] opacity-20 font-mono">
          01 / LATINA
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div className="border-y border-[#F5F0E8]/10 py-5 overflow-hidden bg-[#0A0A0A]">
        <div ref={marqueeRef} className="overflow-hidden">
          <div className="marquee-inner flex whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
                {['Handcrafted', 'Florence', 'Since 2018', 'Latina', 'Women\'s Luxury', 'Made in Italy', 'Shoes', 'Handbags', 'Accessories', 'Latina'].map((text, j) => (
                  <span key={j} className="flex items-center">
                    <span className="text-[11px] uppercase tracking-[0.5em] text-[#F5F0E8]/40 px-8">{text}</span>
                    <span className="text-[#C9A96E] text-xs">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STORY ─────────────────────────────────────────────── */}
      <section ref={storyRef} className="py-32 md:py-48 px-8 md:px-16 lg:px-24">

        {/* Panel 1 — The Craft */}
        <div className="story-panel grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-40">
          <div className="overflow-hidden rounded-none relative aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2070&auto=format&fit=crop"
              alt="The Craft"
              className="story-img w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
          </div>
          <div>
            <span className="reveal-line block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-8">01 — The Craft</span>
            <h2 className="reveal-line text-[clamp(2.5rem,5vw,4.5rem)] font-serif leading-[1.05] tracking-tight mb-8">
              Every stitch<br />
              <em>tells a story.</em>
            </h2>
            <p className="reveal-line text-[#F5F0E8]/50 text-base leading-relaxed font-light max-w-md mb-10">
              Our artisans in Florence have been perfecting their craft for generations. Each pair of Latina shoes takes over 40 hours to complete — not because it has to, but because anything less would be a compromise.
            </p>
            <div className="reveal-line flex items-center gap-8">
              <div>
                <div className="text-3xl font-serif text-[#C9A96E]">40+</div>
                <div className="text-[10px] uppercase tracking-widest text-[#F5F0E8]/40 mt-1">Hours per pair</div>
              </div>
              <div className="w-px h-12 bg-[#F5F0E8]/10" />
              <div>
                <div className="text-3xl font-serif text-[#C9A96E]">3rd</div>
                <div className="text-[10px] uppercase tracking-widest text-[#F5F0E8]/40 mt-1">Generation artisans</div>
              </div>
              <div className="w-px h-12 bg-[#F5F0E8]/10" />
              <div>
                <div className="text-3xl font-serif text-[#C9A96E]">100%</div>
                <div className="text-[10px] uppercase tracking-widest text-[#F5F0E8]/40 mt-1">Italian leather</div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2 — The Material */}
        <div className="story-panel grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-40">
          <div className="order-2 lg:order-1">
            <span className="reveal-line block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-8">02 — The Material</span>
            <h2 className="reveal-line text-[clamp(2.5rem,5vw,4.5rem)] font-serif leading-[1.05] tracking-tight mb-8">
              Leather that<br />
              <em>breathes with you.</em>
            </h2>
            <p className="reveal-line text-[#F5F0E8]/50 text-base leading-relaxed font-light max-w-md mb-10">
              We source only the finest full-grain calfskin from tanneries that have been operating for over a century. The leather is selected by hand — only the top 5% makes it into a Latina piece.
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="reveal-line group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-[#F5F0E8] hover:text-[#C9A96E] transition-colors duration-300"
            >
              Discover Materials
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
            </button>
          </div>
          <div className="order-1 lg:order-2 overflow-hidden relative aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"
              alt="The Material"
              className="story-img w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Panel 3 — The Woman */}
        <div className="story-panel grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="overflow-hidden relative aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=2085&auto=format&fit=crop"
              alt="The Woman"
              className="story-img w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
          </div>
          <div>
            <span className="reveal-line block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-8">03 — The Woman</span>
            <h2 className="reveal-line text-[clamp(2.5rem,5vw,4.5rem)] font-serif leading-[1.05] tracking-tight mb-8">
              Designed for<br />
              <em>her world.</em>
            </h2>
            <p className="reveal-line text-[#F5F0E8]/50 text-base leading-relaxed font-light max-w-md mb-10">
              Latina is not about following trends. It's about the woman who sets them. Every silhouette is designed around her life — the boardroom, the dinner, the morning after.
            </p>
            <MagneticButton
              onClick={() => navigate('/catalog')}
              className="reveal-line group relative px-10 py-5 border border-[#F5F0E8]/20 text-[11px] uppercase tracking-[0.4em] font-medium overflow-hidden hover:border-[#C9A96E] transition-colors duration-500"
            >
              <span className="relative z-10">Shop the Collection</span>
              <span className="absolute inset-0 bg-[#C9A96E]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ───────────────────────────────────────── */}
      <section ref={collectionsRef} className="py-24 px-8 md:px-16 lg:px-24">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-4">Our World</span>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif leading-tight tracking-tight">
              Three universes,<br /><em>one vision.</em>
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors group"
          >
            View All
            <span className="h-px w-6 bg-current group-hover:w-12 transition-all duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className="collection-card group relative overflow-hidden cursor-pointer aspect-[3/4]"
              onClick={() => navigate(`/catalog?category=${cat.slug}`)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/20 to-transparent" />
              {/* Gold overlay on hover */}
              <div className="absolute inset-0 bg-[#C9A96E]/0 group-hover:bg-[#C9A96E]/10 transition-colors duration-700" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#C9A96E] mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                  {cat.count} pieces
                </span>
                <h3 className="text-3xl font-serif italic mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                  {cat.name}
                </h3>
                <p className="text-[#F5F0E8]/50 text-xs tracking-widest uppercase transition-all duration-500 group-hover:text-[#F5F0E8]/80">
                  {cat.description}
                </p>
                <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A96E]">Explore</span>
                  <span className="h-px w-8 bg-[#C9A96E]" />
                </div>
              </div>

              {/* Index number */}
              <div className="absolute top-6 right-6 text-[9px] font-mono text-[#F5F0E8]/20">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section ref={featuredRef} className="py-24 px-8 md:px-16 lg:px-24">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-4">Curated Selection</span>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif leading-tight tracking-tight">
              New arrivals.
            </h2>
          </div>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-12 gap-4">
          {FEATURED_PRODUCTS.slice(0, 4).map((product, i) => {
            // Layout: big, small, small, big
            const isLarge = i === 0 || i === 3;
            const colSpan = isLarge ? 'col-span-12 md:col-span-7' : 'col-span-12 md:col-span-5';
            const aspect = isLarge ? 'aspect-[4/3]' : 'aspect-[3/4]';

            return (
              <div
                key={product.id}
                className={`product-card ${colSpan} group cursor-pointer`}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className={`relative overflow-hidden ${aspect}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />

                  {product.isNew && (
                    <div className="absolute top-6 left-6 bg-[#C9A96E] text-[#0A0A0A] text-[8px] uppercase tracking-[0.4em] px-3 py-1 font-bold">
                      New
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5F0E8]/50 mb-2">{product.category}</p>
                        <h3 className="text-xl md:text-2xl font-serif italic">{product.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-light tracking-widest">${product.price.toLocaleString()}</p>
                        <p className="text-[9px] uppercase tracking-widest text-[#C9A96E] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View piece →
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <MagneticButton
            onClick={() => navigate('/catalog')}
            className="group relative px-16 py-5 border border-[#F5F0E8]/20 text-[11px] uppercase tracking-[0.4em] font-medium overflow-hidden hover:border-[#C9A96E] transition-colors duration-500"
          >
            <span className="relative z-10">View All Pieces</span>
            <span className="absolute inset-0 bg-[#C9A96E]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          </MagneticButton>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────── */}
      <section
        ref={manifestoRef}
        className="py-40 md:py-56 px-8 md:px-16 lg:px-24 bg-[#0D0B08] border-y border-[#F5F0E8]/5"
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-16">Our Belief</span>
          <h2
            ref={manifestoTextRef}
            className="text-[clamp(2.2rem,5.5vw,5rem)] font-serif leading-[1.15] tracking-tight"
          >
            {manifestoWords.map((word, i) => (
              <span key={i} className="manifesto-word inline-block mr-[0.25em]">
                {word}
              </span>
            ))}
          </h2>
          <div className="mt-20 flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-[#C9A96E]/40" />
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#F5F0E8]/30">Latina, Florence 2018</span>
            <div className="h-px w-16 bg-[#C9A96E]/40" />
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / FOOTER CTA ───────────────────────────── */}
      <section className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto text-center">
          <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-6">Stay Close</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif leading-tight tracking-tight mb-6">
            Be the first to know.
          </h2>
          <p className="text-[#F5F0E8]/40 text-sm leading-relaxed mb-12">
            New collections, private events, and stories from the atelier — delivered quietly to your inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-[#F5F0E8]/20 px-6 py-4 text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A96E] transition-colors duration-300"
            />
            <button
              type="submit"
              className="bg-[#C9A96E] text-[#0A0A0A] px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#F5F0E8] transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
