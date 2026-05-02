import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { PRODUCTS } from '../data/mockData';
import MagneticButton from '../components/MagneticButton';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(imageRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      ).fromTo(contentRef.current?.querySelectorAll('.reveal') ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
    });
    return () => ctx.revert();
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5F0E8]/30 font-serif italic text-2xl mb-8">Piece not found.</p>
          <button onClick={() => navigate('/catalog')} className="text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] hover:text-[#F5F0E8] transition-colors">
            ← Return to Archive
          </button>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      category: product.category,
    };
    const existing = JSON.parse(localStorage.getItem('latina_cart') || '[]');
    const idx = existing.findIndex((i: any) => i.productId === product.id);
    if (idx > -1) {
      existing[idx].quantity += quantity;
    } else {
      existing.push(cartItem);
    }
    localStorage.setItem('latina_cart', JSON.stringify(existing));
    window.dispatchEvent(new Event('storage'));
    setAddedToCart(true);
    toast.success(`${product.name} added to your bag.`);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  // Related products
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-20">

      {/* Breadcrumb */}
      <div className="px-8 md:px-16 lg:px-24 py-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#F5F0E8]/25">
        <button onClick={() => navigate('/')} className="hover:text-[#F5F0E8] transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/catalog')} className="hover:text-[#F5F0E8] transition-colors">Archive</button>
        <span>/</span>
        <span className="text-[#C9A96E]">{product.name}</span>
      </div>

      {/* Main layout */}
      <div className="px-8 md:px-16 lg:px-24 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

        {/* Left — Gallery */}
        <div ref={imageRef}>
          {/* Main image */}
          <div className="relative overflow-hidden aspect-[3/4] mb-4">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-700"
            />
            {product.isNew && (
              <div className="absolute top-6 left-6 bg-[#C9A96E] text-[#0A0A0A] text-[8px] uppercase tracking-[0.4em] px-3 py-1 font-bold">
                New Arrival
              </div>
            )}
            {/* Image counter */}
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-[#F5F0E8]/30">
              {String(currentImage + 1).padStart(2, '0')} / {String(product.images.length).padStart(2, '0')}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`aspect-square overflow-hidden border transition-all duration-300 ${
                    currentImage === i ? 'border-[#C9A96E]' : 'border-[#F5F0E8]/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Content */}
        <div ref={contentRef} className="flex flex-col justify-center lg:py-12">
          <span className="reveal block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-6">
            {product.category}
          </span>

          <h1
            ref={titleRef}
            className="reveal text-[clamp(2.5rem,5vw,4.5rem)] font-serif italic tracking-tight leading-[1.0] mb-4"
          >
            {product.name}
          </h1>

          <div className="reveal text-2xl font-light tracking-[0.3em] text-[#F5F0E8]/70 mb-10">
            ${product.price.toLocaleString()}
          </div>

          <div className="reveal h-px w-full bg-[#F5F0E8]/8 mb-10" />

          <p className="reveal text-[#F5F0E8]/50 text-base leading-relaxed font-light mb-10 max-w-md">
            {product.description}
          </p>

          {/* Details */}
          <div className="reveal grid grid-cols-2 gap-4 mb-10">
            <div className="border border-[#F5F0E8]/8 p-4">
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/25 mb-2">Material</p>
              <p className="text-sm text-[#F5F0E8]/70">{product.material}</p>
            </div>
            <div className="border border-[#F5F0E8]/8 p-4">
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/25 mb-2">Origin</p>
              <p className="text-sm text-[#F5F0E8]/70">{product.origin}</p>
            </div>
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && (
            <div className="reveal mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400/80">
                Only {product.stock} left
              </span>
            </div>
          )}

          {/* Quantity */}
          <div className="reveal flex items-center gap-6 mb-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#F5F0E8]/30">Qty</span>
            <div className="flex items-center border border-[#F5F0E8]/15">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5 transition-all"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="reveal flex flex-col sm:flex-row gap-4">
            <MagneticButton
              onClick={addToCart}
              className={`flex-1 group relative py-5 text-[11px] uppercase tracking-[0.4em] font-bold overflow-hidden transition-all duration-500 ${
                addedToCart
                  ? 'bg-[#C9A96E]/20 border border-[#C9A96E] text-[#C9A96E]'
                  : 'bg-[#C9A96E] text-[#0A0A0A]'
              }`}
            >
              <span className="relative z-10">
                {addedToCart ? '✓ Added to Bag' : 'Add to Bag'}
              </span>
              {!addedToCart && (
                <span className="absolute inset-0 bg-[#F5F0E8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
              )}
            </MagneticButton>

            <button className="px-8 py-5 border border-[#F5F0E8]/15 text-[11px] uppercase tracking-[0.4em] text-[#F5F0E8]/50 hover:border-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-all duration-300">
              Inquire
            </button>
          </div>

          {/* Trust signals */}
          <div className="reveal mt-10 pt-8 border-t border-[#F5F0E8]/5 grid grid-cols-3 gap-4">
            {[
              { label: 'Free Shipping', sub: 'On orders over $500' },
              { label: '30-Day Returns', sub: 'Complimentary' },
              { label: 'Authenticity', sub: 'Guaranteed' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#F5F0E8]/50 mb-1">{item.label}</p>
                <p className="text-[9px] text-[#F5F0E8]/25">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="px-8 md:px-16 lg:px-24 py-20 border-t border-[#F5F0E8]/5">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-3">You May Also Like</span>
              <h2 className="text-3xl font-serif italic">Complete the look.</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map(p => (
              <div
                key={p.id}
                className="group cursor-pointer"
                onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
              >
                <div className="relative overflow-hidden aspect-[3/4] mb-4">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                </div>
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/30 mb-1">{p.category}</p>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif italic group-hover:text-[#C9A96E] transition-colors">{p.name}</h3>
                  <span className="text-sm text-[#F5F0E8]/50">${p.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
