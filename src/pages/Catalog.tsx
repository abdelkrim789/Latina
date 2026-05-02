import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS, Product } from '../data/mockData';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'handbags', label: 'Handbags' },
  { value: 'accessories', label: 'Accessories' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category') || '';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo(gridRef.current?.querySelectorAll('.product-item') ?? [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, [activeCategory]);

  const filtered = PRODUCTS
    .filter(p => !activeCategory || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleCategory = (val: string) => {
    setActiveCategory(val);
    if (val) setSearchParams({ category: val });
    else setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-20">

      {/* Header */}
      <div ref={headerRef} className="px-8 md:px-16 lg:px-24 py-16 border-b border-[#F5F0E8]/5">
        <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-4">Archive</span>
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-serif italic tracking-tight leading-[0.9] mb-10">
          {activeCategory ? activeCategory : 'All Collections'}
        </h1>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`px-6 py-2 text-[10px] uppercase tracking-[0.4em] border transition-all duration-300 ${
                activeCategory === cat.value
                  ? 'bg-[#C9A96E] border-[#C9A96E] text-[#0A0A0A] font-bold'
                  : 'border-[#F5F0E8]/15 text-[#F5F0E8]/50 hover:border-[#F5F0E8]/40 hover:text-[#F5F0E8]'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Sort */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#F5F0E8]/30">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border border-[#F5F0E8]/15 text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest px-4 py-2 focus:outline-none focus:border-[#C9A96E] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-[#0A0A0A]">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[#F5F0E8]/25 text-[10px] uppercase tracking-[0.4em]">
          {filtered.length} pieces
        </p>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="px-8 md:px-16 lg:px-24 py-16">
        {filtered.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-[#F5F0E8]/30 font-serif italic text-2xl">No pieces found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                hovered={hoveredId === product.id}
                onHover={setHoveredId}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  hovered,
  onHover,
  onClick,
}: {
  product: Product;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  return (
    <div
      className="product-item group cursor-pointer"
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] mb-5">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-108"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        {/* Second image on hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-[#C9A96E] text-[#0A0A0A] text-[8px] uppercase tracking-[0.4em] px-3 py-1 font-bold">
              New
            </span>
          )}
          {product.stock <= 5 && (
            <span className="bg-[#F5F0E8]/10 backdrop-blur-sm text-[#F5F0E8] text-[8px] uppercase tracking-[0.4em] px-3 py-1 border border-[#F5F0E8]/20">
              Last {product.stock}
            </span>
          )}
        </div>

        {/* Quick view */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
          <div className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#F5F0E8]/10 py-3 text-center text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/80">
            View Piece
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/30 mb-2">{product.category}</p>
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif italic text-lg group-hover:text-[#C9A96E] transition-colors duration-300">
            {product.name}
          </h3>
          <span className="text-sm font-light tracking-widest text-[#F5F0E8]/70">
            ${product.price.toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-[#F5F0E8]/25 mt-1">{product.material}</p>
      </div>
    </div>
  );
}
