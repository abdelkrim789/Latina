import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('velure_cart') || '[]');
        setCartItems(items);
        setLoading(false);
    }, []);

    const removeFromCart = (id: string) => {
        const updated = cartItems.filter(item => item.productId !== id);
        setCartItems(updated);
        localStorage.setItem('velure_cart', JSON.stringify(updated));
        toast.info("Item removed", { description: "Selection updated successfully." });
    };

    const updateQuantity = (id: string, delta: number) => {
        const updated = cartItems.map(item => {
            if (item.productId === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCartItems(updated);
        localStorage.setItem('velure_cart', JSON.stringify(updated));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 50;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        if (!user) {
            toast.error("Authentication required", { description: "Please sign in to complete your purchase." });
            signInWithGoogle();
            return;
        }

        try {
            const orderData = {
                userId: user.uid,
                customerEmail: user.email,
                items: cartItems,
                totalAmount: total,
                status: 'pending',
                createdAt: new Date().toISOString(),
                shippingAddress: "User's default address" // In a real app, this would be a form
            };

            await addDoc(collection(db, 'orders'), orderData);
            
            localStorage.removeItem('velure_cart');
            setCartItems([]);
            toast.success("Order received", { 
                description: "Our artisans from the atelier will begin preparing your shipment immediately." 
            });
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error("Checkout Error:", error);
            toast.error("Checkout failed", { description: "An error occurred while processing your order." });
        }
    };

    if (loading) return <div className="h-[80vh] flex items-center justify-center font-serif italic text-zinc-400">Loading Selection...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[70vh]">
            <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight mb-16">Your Selection</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-serif italic text-xl mb-8">Your bag is empty.</p>
                    <Link to="/catalog">
                         <Button className="bg-zinc-900 text-white rounded-none px-12 py-6 uppercase tracking-widest text-[10px] font-bold">Discover Collections</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div 
                                    key={item.productId}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-8 group"
                                >
                                    <div className="w-24 md:w-32 aspect-[3/4] overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-widest mb-1">{item.name}</h3>
                                            <p className="text-xs text-zinc-400">Archive Unit • SKU-VLX-{item.productId.slice(-4)}</p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-12">
                                            <div className="flex items-center border border-zinc-200 bg-white">
                                                <button onClick={() => updateQuantity(item.productId, -1)} className="px-3 py-1 hover:bg-zinc-50 transition-colors">-</button>
                                                <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId, 1)} className="px-3 py-1 hover:bg-zinc-50 transition-colors">+</button>
                                            </div>
                                            <span className="text-sm font-serif italic text-zinc-900 w-24 text-right">${(item.price * item.quantity).toLocaleString()}</span>
                                            <button 
                                                onClick={() => removeFromCart(item.productId)}
                                                className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-50 p-10 border border-zinc-100">
                            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-8 pb-4 border-b border-zinc-200">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-zinc-600">Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-zinc-600">Complimentary Shipping</span>
                                    <span>{shipping === 0 ? "Included" : `$${shipping.toLocaleString()}`}</span>
                                </div>
                                <Separator className="bg-zinc-200" />
                                <div className="flex justify-between text-base font-serif italic">
                                    <span>Total</span>
                                    <span className="text-zinc-900 font-bold">${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button 
                                onClick={handleCheckout}
                                className="w-full bg-zinc-900 text-white rounded-none py-8 uppercase tracking-[0.2em] text-[10px] font-bold hover:shadow-xl transition-all"
                            >
                                Complete Acquisition
                                <ArrowRight className="ml-2 w-3 h-3" />
                            </Button>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center text-[10px] uppercase tracking-wider text-zinc-400">
                                    <ShieldCheck className="mr-2 w-3 h-3" />
                                    Secure architectural transaction
                                </div>
                                <div className="flex items-center text-[10px] uppercase tracking-wider text-zinc-400">
                                    <Truck className="mr-2 w-3 h-3" />
                                    Expedited worldwide delivery
                                </div>
                                <div className="flex items-center text-[10px] uppercase tracking-wider text-zinc-400">
                                    <RefreshCw className="mr-2 w-3 h-3" />
                                    Complimentary returns within 30 days
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
