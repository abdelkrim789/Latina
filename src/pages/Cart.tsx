import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import MagneticButton from '../components/MagneticButton';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem('latina_cart') || '[]');
      setItems(stored);
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(listRef.current?.querySelectorAll('.cart-item') ?? [],
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }
      );
      gsap.fromTo(summaryRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    });
    return () => ctx.revert();
  }, [items.length]);

  const save = (updated: CartItem[]) => {
    setItems(updated);
    localStorage.setItem('latina_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const remove = (id: string) => {
    save(items.filter(i => i.productId !== id));
    toast.info('Item removed from bag.');
  };

  const updateQty = (id: string, delta: number) => {
    save(items.map(i =>
      i.productId === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Pure frontend — simulate order placed
    toast.success('Order placed successfully!', {
      description: 'You will receive a confirmation shortly.',
    });
    save([]);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-20">
      <div className="px-8 md:px-16 lg:px-24 py-16">

        {/* Header */}
        <div className="mb-16">
          <span className="block text-[#C9A96E] text-[10px] uppercase tracking-[0.6em] mb-4">Your Selection</span>
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-serif italic tracking-tight leading-[0.9]">
            The Bag
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-32 text-center border border-[#F5F0E8]/5">
            <p className="text-[#F5F0E8]/25 font-serif italic text-2xl mb-10">Your bag is empty.</p>
            <MagneticButton
              onClick={() => navigate('/catalog')}
              className="group relative px-12 py-5 bg-[#C9A96E] text-[#0A0A0A] text-[11px] uppercase tracking-[0.4em] font-bold overflow-hidden"
            >
              <span className="relative z-10">Discover the Archive</span>
              <span className="absolute inset-0 bg-[#F5F0E8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            </MagneticButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">

            {/* Items */}
            <div ref={listRef} className="lg:col-span-2 space-y-0 divide-y divide-[#F5F0E8]/5">
              {items.map(item => (
                <div key={item.productId} className="cart-item flex gap-8 py-10 group">
                  {/* Image */}
                  <div
                    className="w-24 md:w-32 aspect-[3/4] overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/25 mb-2">{item.category}</p>
                      <h3
                        className="font-serif italic text-xl mb-1 cursor-pointer hover:text-[#C9A96E] transition-colors"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#F5F0E8]/40 font-light">
                        ${item.price.toLocaleString()} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Qty */}
                      <div className="flex items-center border border-[#F5F0E8]/10">
                        <button
                          onClick={() => updateQty(item.productId, -1)}
                          className="w-9 h-9 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5 transition-all text-sm"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5 transition-all text-sm"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="font-serif italic text-lg">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => remove(item.productId)}
                          className="text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/20 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div ref={summaryRef} className="lg:col-span-1">
              <div className="border border-[#F5F0E8]/8 p-8 sticky top-28">
                <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#F5F0E8]/30 mb-8 pb-6 border-b border-[#F5F0E8]/5">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F0E8]/50">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F0E8]/50">Shipping</span>
                    <span>{shipping === 0 ? 'Complimentary' : `$${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[9px] text-[#F5F0E8]/25 uppercase tracking-widest">
                      Free shipping on orders over $500
                    </p>
                  )}
                  <div className="h-px bg-[#F5F0E8]/5" />
                  <div className="flex justify-between">
                    <span className="font-serif italic text-lg">Total</span>
                    <span className="font-serif italic text-lg">${total.toLocaleString()}</span>
                  </div>
                </div>

                <MagneticButton
                  onClick={handleCheckout}
                  className="w-full group relative py-5 bg-[#C9A96E] text-[#0A0A0A] text-[11px] uppercase tracking-[0.4em] font-bold overflow-hidden mb-4"
                >
                  <span className="relative z-10">Complete Acquisition</span>
                  <span className="absolute inset-0 bg-[#F5F0E8] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                </MagneticButton>

                <button
                  onClick={() => navigate('/catalog')}
                  className="w-full py-4 text-[10px] uppercase tracking-[0.4em] text-[#F5F0E8]/30 hover:text-[#F5F0E8] transition-colors border border-[#F5F0E8]/8 hover:border-[#F5F0E8]/20"
                >
                  Continue Shopping
                </button>

                {/* Trust */}
                <div className="mt-8 pt-6 border-t border-[#F5F0E8]/5 space-y-3">
                  {['Secure checkout', 'Free returns within 30 days', 'Authenticity guaranteed'].map(t => (
                    <div key={t} className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#F5F0E8]/20">
                      <span className="text-[#C9A96E]">✓</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
