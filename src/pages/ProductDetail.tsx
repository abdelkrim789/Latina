import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronLeft, Send, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getProductAdvice } from '../services/aiService';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const ProductDetail = () => {
    const { id } = useParams();
    const { user, signInWithGoogle } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    
    // AI Concierge State
    const [userQuery, setUserQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'concierge', content: string}[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images?.[0]
        };
        
        const existingCart = JSON.parse(localStorage.getItem('velure_cart') || '[]');
        const existingItemIdx = existingCart.findIndex((item: any) => item.productId === product.id);
        
        if (existingItemIdx > -1) {
            existingCart[existingItemIdx].quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }
        
        localStorage.setItem('velure_cart', JSON.stringify(existingCart));
        toast.success("Archival Acquisition", {
            description: `${product.name} added to your selection.`
        });
    };

    const handleAiQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userQuery.trim() || isAiLoading) return;

        const query = userQuery;
        setUserQuery('');
        setChatHistory(prev => [...prev, { role: 'user', content: query }]);
        setIsAiLoading(true);

        const response = await getProductAdvice(product.name, product.description, query);
        
        setChatHistory(prev => [...prev, { role: 'concierge', content: response }]);
        setIsAiLoading(false);
    };

    if (loading) return <div className="h-screen bg-luxury-deep flex items-center justify-center font-serif italic text-white/20 text-3xl tracking-widest animate-pulse">Consulting Archives...</div>;
    if (!product) return <div className="h-screen bg-luxury-deep flex items-center justify-center font-serif text-white/40">Archive Not Found.</div>;

    return (
        <div className="bg-luxury-deep min-h-screen text-luxury-ivory font-sans">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                <Link to="/catalog" className="flex items-center text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white mb-12 transition-colors group">
                    <ChevronLeft className="mr-2 w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Archive Collections
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Left: Cinematic Gallery */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="aspect-[3/4] bg-luxury-obsidian border border-white/5 relative overflow-hidden"
                        >
                            <img 
                                src={product.images?.[currentImage] || 'https://picsum.photos/seed/lux/1200/1600'} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-1000"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-8 right-8 text-[9px] tracking-[0.5em] opacity-30 font-mono text-white">0{currentImage + 1} // 0{product.images?.length || 1}</div>
                            {product.totalStock <= 5 && (
                                <div className="absolute top-8 left-8">
                                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1 text-[8px] uppercase tracking-[0.4em] font-bold">Rare Acquisition</div>
                                </div>
                            )}
                        </motion.div>
                        
                        {product.images?.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img: string, idx: number) => (
                                    <div 
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`aspect-square bg-luxury-obsidian border cursor-pointer transition-all ${currentImage === idx ? 'border-luxury-gold' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Narrative & Purchase */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.7em] font-semibold mb-6 block">VELURE_ATELIER_04 // {product.category.toUpperCase()}</span>
                            <h1 className="text-6xl md:text-7xl font-serif italic tracking-tight mb-4 leading-tight">{product.name}</h1>
                            <div className="text-2xl font-light tracking-[0.3em] mb-12 text-white/80 italic">${product.price.toLocaleString()}</div>
                            
                            <div className="h-[1px] w-full bg-white/10 mb-12" />

                            <p className="text-white/50 text-base leading-relaxed font-light tracking-wide mb-12 max-w-xl">
                                {product.description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 mb-16">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={addToCart}
                                    className="flex-1 py-6 bg-white text-black text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gold hover:text-white transition-all duration-500 shadow-2xl"
                                >
                                    Acquire Piece
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-10 py-6 border border-white/20 text-white text-[10px] uppercase tracking-[0.5em] font-bold hover:border-white transition-all duration-500"
                                >
                                    Inquire
                                </motion.button>
                            </div>

                            {/* Digital Concierge Tabs */}
                            <Tabs defaultValue="concierge" className="w-full">
                                <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none p-0 h-auto gap-12">
                                    <TabsTrigger value="concierge" className="bg-transparent text-white/40 border-b-2 border-transparent data-[state=active]:border-luxury-gold data-[state=active]:text-white rounded-none px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center">
                                        <Sparkles className="w-3 h-3 mr-2" />
                                        Digital Concierge
                                    </TabsTrigger>
                                    <TabsTrigger value="atelier" className="bg-transparent text-white/40 border-b-2 border-transparent data-[state=active]:border-luxury-gold data-[state=active]:text-white rounded-none px-0 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all">
                                        Atelier Registry
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="concierge" className="pt-8">
                                    <div className="bg-white/5 border border-white/5 p-8 flex flex-col h-[400px]">
                                        <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4 custom-scrollbar">
                                            {chatHistory.length === 0 ? (
                                                <div className="text-sm text-white/30 font-light italic text-center py-20 tracking-wider">Consult our intelligence on tailoring, composition, or legacy sourcing.</div>
                                            ) : (
                                                chatHistory.map((msg, i) => (
                                                    <div key={i} className={cn(
                                                        "p-4 text-xs font-light leading-relaxed",
                                                        msg.role === 'user' ? "bg-white/10 border-l border-white/20 ml-12" : "border-l border-luxury-gold bg-luxury-gold/5 mr-12 italic"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                ))
                                            )}
                                            {isAiLoading && <div className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold animate-pulse text-center">Consulting Master Artisan...</div>}
                                        </div>
                                        <form onSubmit={handleAiQuery} className="flex gap-4">
                                            <input 
                                                type="text" 
                                                value={userQuery}
                                                onChange={(e) => setUserQuery(e.target.value)}
                                                placeholder="INQUIRE..."
                                                className="flex-1 bg-black/40 border border-white/10 px-6 py-4 text-[10px] uppercase tracking-[0.3em] font-medium focus:outline-none focus:border-luxury-gold transition-colors"
                                            />
                                            <button type="submit" className="p-4 bg-white/10 hover:bg-white/20 transition-all group">
                                                <Send size={16} className="text-luxury-gold group-hover:scale-110" />
                                            </button>
                                        </form>
                                    </div>
                                </TabsContent>
                                <TabsContent value="atelier" className="pt-8 text-sm text-white/40 font-light leading-relaxed tracking-widest">
                                    <div className="space-y-4">
                                        <p>ORIGIN: FLORENCE, ITALY</p>
                                        <p>COMPOSITION: 100% RESPONSIBLE NAPPA / CARBON ARCHITECTURE</p>
                                        <p>TRACEABILITY: BLOCKCHAIN VERIFIED ATELIER {product.id.substring(0, 4)}</p>
                                        <p>WARRANTY: LIFETIME ARCHIVAL PRESERVATION</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
