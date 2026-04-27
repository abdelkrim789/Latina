import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-luxury-deep text-luxury-ivory overflow-hidden">
            <main className="min-h-screen flex relative">
                {/* Side Rail Text */}
                <div className="hidden lg:flex w-24 border-r border-luxury-border items-center justify-center">
                    <div className="rotate-180 flex gap-12 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                        <span className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-medium whitespace-nowrap">Spring / Summer 2026</span>
                        <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-bold whitespace-nowrap">Limited Release</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col lg:flex-row">
                    {/* Left: Massive Typography and Story */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-luxury-gold text-xs uppercase tracking-[0.6em] font-semibold mb-8 block">Collection 04</span>
                            <h1 className="text-[12vw] lg:text-[110px] leading-[0.85] font-serif uppercase tracking-tight mb-12">
                                Velvet<br />
                                <span className="italic ml-8 lg:ml-20 text-luxury-gold">Obsidian</span>
                            </h1>
                            
                            <p className="max-w-md text-sm lg:text-base text-white/50 leading-relaxed font-light tracking-wide mb-12">
                                A precision-crafted fusion of Italian calfskin and carbon-fiber textiles. Redefining the modern silhouette for the 2026 urban landscape.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/catalog')}
                                    className="px-12 py-5 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gold hover:text-white transition-all duration-500 shadow-xl"
                                >
                                    Shop New Arrivals
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/catalog')}
                                    className="px-12 py-5 border border-white/20 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:border-white transition-all duration-500"
                                >
                                    View Lookbook
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Abstract Showcase */}
                    <div className="w-full lg:w-1/2 relative bg-luxury-obsidian min-h-[600px] border-l border-luxury-border flex items-center justify-center p-12 overflow-hidden">
                        {/* Background Geometric Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/10 rounded-full pointer-events-none"></div>
                        
                        {/* Featured Product Presentation */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.4 }}
                            className="relative w-full max-w-sm aspect-[3/4] bg-luxury-deep border border-white/10 p-10 flex flex-col justify-between shadow-2xl group cursor-pointer"
                        >
                            <div className="w-full h-2/3 bg-black flex items-center justify-center relative overflow-hidden">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="w-48 h-48 border-2 border-luxury-gold/20 rotate-45 flex items-center justify-center"
                                >
                                    <div className="w-36 h-36 border border-luxury-gold flex items-center justify-center font-serif text-luxury-gold opacity-60 text-xs italic">
                                        VÉRO
                                    </div>
                                </motion.div>
                                <div className="absolute top-4 right-4 text-[9px] tracking-[0.3em] opacity-30 font-mono">MODEL P4-26</div>
                            </div>

                            <div className="pt-8">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-serif italic tracking-wide">Crest-Line Tote</h3>
                                    <span className="text-lg font-light tracking-widest">$2,850</span>
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-6 italic">Matte Nappa / Silver Hardware</div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-black border border-white/20 ring-1 ring-white/10 ring-offset-2 ring-offset-luxury-deep"></div>
                                    <div className="w-6 h-6 rounded-full bg-luxury-gold border border-white/20"></div>
                                    <div className="w-6 h-6 rounded-full bg-[#4A4A4A] border border-white/20"></div>
                                </div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-luxury-gold opacity-30 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-luxury-gold opacity-30 pointer-events-none"></div>
                        </motion.div>

                        <div className="absolute bottom-12 right-12 flex items-center gap-6">
                            <div className="h-[1px] w-16 bg-white/10"></div>
                            <div className="text-[9px] uppercase tracking-[0.4em] font-medium opacity-40">Scroll Explore</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
