import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Activity, 
  ArrowRight, 
  Cpu, 
  Globe,
  ChevronRight,
  Terminal,
  BarChart3,
  Lock,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { marketService } from '../services/marketService';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

// --- Components ---

const Navbar = ({ onLoginClick, onRegisterClick, isAuthenticated }) => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-cyan-500/20 border border-cyan-500/30 rounded-xl">
          <Activity className="w-6 h-6 text-cyan-400" />
        </div>
        <span className="text-xl font-bold tracking-tighter text-white">AlphaSharp</span>
      </div>

      <div className="hidden gap-8 md:flex">
        {['Features', 'Market', 'Technology', 'Pricing'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-400 transition-colors hover:text-cyan-400">
            {item}
          </a>
        ))}
      </div>

      {!isAuthenticated ? (
        <div className="flex gap-3">
          <button 
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-medium text-white transition-colors hover:text-cyan-400"
          >
            Login
          </button>
          <button 
            onClick={onRegisterClick}
            className="px-6 py-2 text-sm font-bold text-black transition-transform transform bg-white rounded-full hover:scale-105 hover:bg-cyan-50"
          >
            Get Started
          </button>
        </div>
      ) : (
        <Link
          to="/dashboard"
          className="px-6 py-2 text-sm font-bold text-black transition-transform transform bg-white rounded-full hover:scale-105 hover:bg-cyan-50"
        >
          Dashboard
        </Link>
      )}
    </motion.nav>
  );
};

const Hero = ({ onGetStartedClick }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden pt-28">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 transform -translate-x-1/2 left-1/2 w-[1000px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 border rounded-full border-cyan-500/30 bg-cyan-500/10"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-cyan-400"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-500"></span>
          </span>
          <span className="text-xs font-medium tracking-wide text-cyan-400 uppercase">v2.0 Beta is Live</span>
        </motion.div>

        <motion.h1 
          className="text-6xl font-bold tracking-tight text-white md:text-8xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          AlphaSharp <br />
          
        </motion.h1>

        <motion.p 
          className="max-w-2xl mx-auto mt-6 text-lg text-gray-400 md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          AlphaSharp leverages quantum-ready algorithms and HSMM models to analyze market sentiment and 
        </motion.p>

        <motion.div 
          className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button 
            onClick={onGetStartedClick}
            className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]"
          >
            <div className="flex items-center gap-2">
              Start Trading Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
          <Link
            to="/market"
            className="px-8 py-4 font-bold text-white transition-colors border border-white/10 rounded-xl bg-white/5 hover:bg-white/10"
          >
            View Live Demo
          </Link>
        </motion.div>
      </div>

      {/* Hero Visual: Floating Glass Cards */}
      <motion.div style={{ y: y1 }} className="absolute hidden lg:block left-10 top-1/3 opacity-40">
        <GlassCard icon={<Activity />} label="AAPL" value="+2.4%" color="text-green-400" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute hidden lg:block right-10 top-1/4 opacity-40">
        <GlassCard icon={<Zap />} label="BTC" value="+12.8%" color="text-cyan-400" />
      </motion.div>

      {/* Dashboard Preview mockup */}
      <motion.div 
        className="relative w-full max-w-6xl mt-20 perspective-1000"
        initial={{ opacity: 0, rotateX: 20, scale: 0.9 }}
        animate={{ opacity: 1, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
      >
        <div className="relative p-2 overflow-hidden border bg-gray-900/50 rounded-2xl border-white/10 backdrop-blur-sm shadow-2xl shadow-cyan-900/20 group">
            {/* The "Screen" */}
            <div className="relative w-full h-[400px] md:h-[600px] bg-black rounded-xl overflow-hidden flex">
                <div className="w-16 h-full border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400"><Terminal size={16} /></div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500"><BarChart3 size={16} /></div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500"><Globe size={16} /></div>
                </div>
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-white text-xl font-bold">Market Overview</h3>
                            <p className="text-gray-500 text-sm">Real-time global indices</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-mono border border-green-500/20">SYSTEM OPTIMAL</span>
                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-mono border border-cyan-500/20">AI ACTIVE</span>
                        </div>
                    </div>
                    {/* Fake Chart */}
                    <div className="w-full h-64 relative flex items-end gap-2 px-4 border-b border-l border-white/10">
                        {[40, 60, 45, 70, 55, 80, 65, 90, 75, 100, 85, 95].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-cyan-500/10 to-cyan-500 rounded-t-sm relative group hover:from-cyan-400/20 hover:to-cyan-400 transition-all"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs px-2 py-1 rounded font-bold">
                                    {(h * 124.5).toFixed(0)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />
        </div>
      </motion.div>
    </section>
  );
};

const GlassCard = ({ icon, label, value, color }) => (
  <div className="p-4 border backdrop-blur-md bg-black/40 border-white/10 rounded-2xl w-44">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-white/5 rounded-lg text-white">{icon}</div>
      <span className="text-sm font-medium text-gray-400">{label}</span>
    </div>
    <div className={cn("text-2xl font-bold tracking-tight", color)}>{value}</div>
  </div>
);

const Features = () => {
  const features = [
    {
      title: "Market Overview",
      description: "View all market regimes and forecast ",
      icon: <Cpu className="w-6 h-6 text-gray-400" />,
      colSpan: "md:col-span-2",
      bg: "bg-gray-900/30"
    },
    {
      title: "Portfolio Tracker",
      description: "Track your investments and portfolio performance in real-time.",
      icon: <Shield className="w-6 h-6 text-gray-400" />,
      colSpan: "md:col-span-1",
      bg: "bg-gray-900/30"
    },
    {
      title: "AI Agent",
      description: "Ask questions about stock and markets",
      icon: <Globe className="w-6 h-6 text-gray-400" />,
      colSpan: "md:col-span-1",
      bg: "bg-gray-900/30"
    },
    {
      title: "Global Connectivity",
      description: "Direct access to various stock excahanges and insights",
      icon: <TrendingUp className="w-6 h-6 text-gray-400" />,
      colSpan: "md:col-span-2",
      bg: "bg-gray-900/30"
    }
  ];

  return (
    <section id="features" className="py-24 bg-black relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for the <br /><span className="text-gray-500">Exceptional Trader</span></h2>
          <div className="h-1 w-20 bg-cyan-500 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={cn("relative p-8 rounded-3xl border border-white/10 overflow-hidden group hover:border-cyan-500/50 transition-colors", f.colSpan, f.bg)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="p-3 bg-white/10 w-fit rounded-xl mb-4 text-white group-hover:text-cyan-400 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Ticker = () => {
    const stocks = [
        { sym: "AAPL", price: "182.45", change: "+1.2%" },
        { sym: "TSLA", price: "240.10", change: "+3.4%" },
        { sym: "NVDA", price: "460.15", change: "+5.1%" },
        { sym: "BTC", price: "45,230", change: "-0.4%" },
        { sym: "ETH", price: "3,200", change: "+1.1%" },
        { sym: "GOOGL", price: "135.20", change: "+0.8%" },
        { sym: "AMZN", price: "145.30", change: "+2.0%" }
    ];

    return (
        <div id="market" className="w-full bg-cyan-950/30 border-y border-white/5 py-3 overflow-hidden flex">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...stocks, ...stocks, ...stocks].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 mx-6">
                        <span className="font-bold text-white text-sm">{s.sym}</span>
                        <span className="text-gray-400 text-sm">${s.price}</span>
                        <span className={cn("text-xs font-mono", s.change.startsWith('+') ? "text-green-400" : "text-red-400")}>
                            {s.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CTA = ({ onGetStartedClick }) => {
    return (
        <section className="py-32 bg-black flex items-center justify-center relative overflow-hidden">
             {/* Abstract Mesh Gradient */}
             <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-[100px]" />
             </div>

            <div className="relative z-10 text-center px-4 max-w-3xl">
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8">
                    Ready to outperform?
                </h2>
                
                
                <button 
                  onClick={onGetStartedClick}
                  className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-cyan-50 transition-colors"
                >
                  Get Started Free
                </button>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2"><Lock size={14} /> 256-bit Secure</span>
                    <span>•</span>
                    <span>No credit card required</span>
                </div>
            </div>
        </section>
    );
};

const AuthModal = ({ mode, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const response = await authService.login(email, password);
        onSuccess(response.data.token, response.data.user);
        toast.success('Login successful!');
      } else {
        const response = await authService.register(email, password, name);
        onSuccess(response.data.token, response.data.user);
        toast.success('Registration successful!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md p-8 border bg-gray-900 rounded-2xl border-white/10"
        >
          <button
            onClick={onClose}
            className="absolute p-2 text-gray-400 transition-colors top-4 right-4 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="mb-6 text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 text-white transition-all bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-white transition-all bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === 'register' ? 6 : undefined}
              className="w-full px-4 py-3 text-white transition-all bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 font-bold text-black transition-colors bg-cyan-500 rounded-xl hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function HomePage() {
  const { isAuthenticated, handleAuthSuccess } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => {
    const warmUpApi = async () => {
      try {
        await marketService.getApiStatus();
        console.log('✅ API warming ping sent');
      } catch (error) {
        console.log('API warming ping failed (expected on cold start)');
      }
    };
    
    warmUpApi();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-cyan-500/30">
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 30s linear infinite;
        }
      `}</style>
      
      <Navbar 
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setAuthMode('login')}
        onRegisterClick={() => setAuthMode('register')}
      />
      <Hero onGetStartedClick={() => setAuthMode('register')} />
      <Ticker />
      <Features />
      <CTA onGetStartedClick={() => setAuthMode('register')} />
      
      <footer className="py-12 border-t border-white/10 bg-black text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Activity className="w-5 h-5" />
            <span className="font-bold">AlphaSharp</span>
        </div>
        <p className="text-gray-600 text-sm">© 2026 AlphaSharp Technologies Inc. All rights reserved.</p>
      </footer>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={(token, user) => {
            handleAuthSuccess(token, user);
            setAuthMode(null);
            window.location.href = '/dashboard';
          }}
        />
      )}
    </div>
  );
}
