import { Search, ArrowRight, Clock, Users, Hotel, Plus, Mail, Globe, AtSign, User, Lock, LogOut, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as React from 'react';
import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { stories } from './data/stories';
import { tours } from './data/tours';
import { Tour } from './types';

// --- Auth Context ---
interface UserData {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    setUser(data.user);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// --- Components ---

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, role);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative neumorphic-card bg-surface w-full max-w-md p-10 rounded-lg"
          >
            <h3 className="text-3xl font-bold font-headline mb-8 text-center">
              {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="neumorphic-recessed px-6 py-4 rounded-full flex items-center">
                  <User className="text-primary mr-3 w-5 h-5" />
                  <input 
                    className="bg-transparent border-none focus:outline-none w-full font-body" 
                    placeholder="Họ và tên" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="neumorphic-recessed px-6 py-4 rounded-full flex items-center">
                <Mail className="text-primary mr-3 w-5 h-5" />
                <input 
                  className="bg-transparent border-none focus:outline-none w-full font-body" 
                  placeholder="Email" 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="neumorphic-recessed px-6 py-4 rounded-full flex items-center">
                <Lock className="text-primary mr-3 w-5 h-5" />
                <input 
                  className="bg-transparent border-none focus:outline-none w-full font-body" 
                  placeholder="Mật khẩu" 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="flex gap-4 justify-center">
                  <button 
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${role === 'customer' ? 'neumorphic-recessed text-primary' : 'neumorphic-card text-on-surface-variant'}`}
                  >
                    Khách hàng
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${role === 'admin' ? 'neumorphic-recessed text-primary' : 'neumorphic-card text-on-surface-variant'}`}
                  >
                    Admin
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center font-body">{error}</p>}

              <button className="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all">
                {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>

            <p className="mt-8 text-center text-on-surface-variant font-body">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      className="neumorphic-card group bg-surface rounded-lg overflow-hidden flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <img 
          alt={tour.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={tour.image}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 neumorphic-card bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full">
          <span className="text-xs font-bold text-secondary tracking-widest uppercase">{tour.tag}</span>
        </div>
      </div>
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-3xl font-bold font-headline leading-tight">{tour.title}</h4>
          <div className="text-right">
            <p className="text-sm text-on-surface-variant opacity-60">Từ</p>
            <p className="text-xl font-bold text-primary">{tour.price.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
        <p className="text-on-surface-variant font-body mb-8 line-clamp-2">{tour.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Clock className="text-secondary w-4 h-4" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              {tour.accommodation ? <Hotel className="text-secondary w-4 h-4" /> : <Users className="text-secondary w-4 h-4" />}
              <span>{tour.accommodation || tour.groupSize}</span>
            </div>
          </div>
          <button className="neumorphic-card w-12 h-12 rounded-full flex items-center justify-center text-primary active:shadow-recessed transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function StoriesPage() {
  return (
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-secondary font-bold tracking-[0.3em] mb-4 font-headline text-sm uppercase">NHẬT KÝ HÀNH TRÌNH</h2>
        <h1 className="text-5xl md:text-6xl font-black text-on-surface font-headline mb-6">NHỮNG CÂU CHUYỆN TRUYỀN CẢM HỨNG</h1>
        <p className="text-lg text-on-surface-variant font-body">Lắng nghe những trải nghiệm chân thực từ những người lữ hành trên khắp dải đất hình chữ S.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {stories.map((story) => (
          <motion.div 
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="neumorphic-card bg-surface rounded-lg overflow-hidden group"
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={story.image} 
                alt={story.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-primary tracking-widest uppercase px-3 py-1 neumorphic-recessed rounded-full">
                  {story.category}
                </span>
                <span className="text-xs text-on-surface-variant font-body">{story.date}</span>
              </div>
              <h3 className="text-3xl font-bold font-headline mb-4 group-hover:text-primary transition-colors">{story.title}</h3>
              <p className="text-on-surface-variant font-body mb-8 line-clamp-3">{story.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full neumorphic-card flex items-center justify-center bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-sm font-headline">{story.author}</span>
                </div>
                <button className="text-primary font-bold flex items-center gap-2 group/btn">
                  Đọc tiếp <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-24">
      <section className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-secondary font-bold tracking-[0.3em] mb-4 font-headline text-sm uppercase">VỀ CHÚNG TÔI</h2>
          <h1 className="text-5xl md:text-6xl font-black text-on-surface font-headline mb-8 leading-tight">
            KẾT NỐI BẠN VỚI <br/>TÂM HỒN VIỆT NAM
          </h1>
          <p className="text-xl text-on-surface-variant mb-8 leading-relaxed font-body">
            Vietnam Journals không chỉ là một đơn vị lữ hành, chúng tôi là những người kể chuyện, những người gìn giữ và lan tỏa vẻ đẹp văn hóa, con người Việt Nam đến với bạn bè quốc tế.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="neumorphic-recessed p-6 rounded-lg">
              <h4 className="text-3xl font-black text-primary font-headline mb-2">10+</h4>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Năm kinh nghiệm</p>
            </div>
            <div className="neumorphic-recessed p-6 rounded-lg">
              <h4 className="text-3xl font-black text-primary font-headline mb-2">500+</h4>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Hành trình đã đi</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neumorphic-card p-4 rounded-lg bg-surface rotate-3"
        >
          <img 
            src="https://picsum.photos/seed/about-vietnam/800/1000" 
            alt="About Vietnam" 
            className="rounded-lg w-full h-[600px] object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      <section className="neumorphic-recessed p-16 rounded-lg text-center max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold font-headline mb-8">Sứ mệnh của chúng tôi</h3>
        <p className="text-xl text-on-surface-variant font-body leading-relaxed italic">
          "Mang đến những hành trình du lịch bền vững, tôn trọng thiên nhiên và bản sắc văn hóa địa phương, đồng thời tạo ra những kỷ niệm vô giá cho mỗi lữ khách."
        </p>
      </section>

      <section className="space-y-12">
        <h3 className="text-3xl font-bold font-headline text-center">Giá trị cốt lõi</h3>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: "Chân thực", desc: "Trải nghiệm những giá trị thật, con người thật và văn hóa thật." },
            { title: "Bền vững", desc: "Cam kết bảo vệ môi trường và hỗ trợ cộng đồng địa phương." },
            { title: "Tận tâm", desc: "Chăm chút từng chi tiết nhỏ nhất trong mỗi hành trình của bạn." }
          ].map((val, i) => (
            <div key={i} className="neumorphic-card p-10 rounded-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-full neumorphic-recessed mx-auto flex items-center justify-center text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold font-headline">{val.title}</h4>
              <p className="text-on-surface-variant font-body">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <h3 className="text-3xl font-bold font-headline text-center">Đội ngũ của chúng tôi</h3>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { name: "Nguyễn Ngọc Diệp", role: "Founder & CEO", img: "https://picsum.photos/seed/team1/200/200" },
            { name: "Nguyễn Thuỳ Dương", role: "Tour Manager", img: "https://picsum.photos/seed/team2/200/200" },
            { name: "Tống Vân Anh", role: "Lead Guide", img: "https://picsum.photos/seed/team3/200/200" },
            { name: "Nguyễn Văn Hải", role: "Customer Support", img: "https://picsum.photos/seed/team4/200/200" }
          ].map((member, i) => (
            <div key={i} className="neumorphic-card p-6 rounded-lg text-center space-y-4">
              <div className="w-24 h-24 rounded-full neumorphic-recessed mx-auto overflow-hidden">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-bold font-headline">{member.name}</h4>
                <p className="text-xs text-secondary font-bold uppercase tracking-widest">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MainApp() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'stories' | 'about'>('home');
  const { user, logout, loading } = useAuth();

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesCategory = selectedCategory === 'Tất cả' || tour.category === selectedCategory;
      const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tour.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center font-headline text-2xl">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[inset_0_-1px_0_rgba(255,255,255,0.4)]">
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1920px] mx-auto">
          <div className="text-2xl font-black tracking-tighter text-on-surface uppercase font-headline">
            VIETNAM JOURNALS
          </div>
          <div className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`${currentPage === 'home' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface hover:text-primary transition-colors'} font-body`}
            >
              Destinations
            </button>
            <button 
              onClick={() => setCurrentPage('home')}
              className="text-on-surface hover:text-primary transition-colors font-body"
            >
              Tours
            </button>
            <button 
              onClick={() => setCurrentPage('stories')}
              className={`${currentPage === 'stories' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface hover:text-primary transition-colors'} font-body`}
            >
              Stories
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`${currentPage === 'about' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface hover:text-primary transition-colors'} font-body`}
            >
              About
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex neumorphic-recessed px-4 py-2 rounded-full items-center gap-2">
              <Search className="text-on-surface-variant w-4 h-4" />
              <input 
                className="bg-transparent border-none focus:outline-none text-sm font-body w-32 lg:w-48" 
                placeholder="Tìm kiếm hành trình..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="font-bold font-headline text-sm">{user.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{user.role}</span>
                </div>
                <button 
                  onClick={logout}
                  className="neumorphic-card w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-500 transition-all active:shadow-recessed"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-80 transition-all duration-300 active:scale-95 shadow-lg"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1920px] mx-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Hero Section */}
              <section className="mb-24 text-center md:text-left">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="order-2 md:order-1"
                  >
                    <h2 className="text-secondary font-bold tracking-[0.3em] mb-4 font-headline text-sm uppercase">HÀNH TRÌNH DI SẢN</h2>
                    <h1 className="text-6xl md:text-8xl font-black text-on-surface font-headline mb-8 leading-[0.9] drop-shadow-[4px_4px_0px_rgba(255,255,255,0.8)]">
                      KHÁM PHÁ <br/>VIỆT NAM
                    </h1>
                    <p className="text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed font-body">
                      Đắm mình trong vẻ đẹp vượt thời gian của những di sản thế giới, từ những vịnh biển huyền thoại đến những phố cổ trầm mặc.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                      <button className="neumorphic-card px-10 py-5 rounded-lg bg-surface text-primary font-bold hover:shadow-recessed transition-all duration-300 active:scale-95 font-headline">
                        Bắt đầu hành trình
                      </button>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 3 }}
                    transition={{ duration: 0.8 }}
                    className="order-1 md:order-2"
                  >
                    <div className="neumorphic-card p-4 rounded-lg bg-surface hover:rotate-0 transition-transform duration-500">
                      <img 
                        alt="Vietnam Landscape" 
                        className="rounded-lg w-full h-[500px] object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVCEpQdtFW5MQrJVpeHxynT7N5k9o77X2xP-e35Mva-xA7SzZ019z6yqwy8hgSjgc2eBROlmwfG9sbQPfqR0jYcjPycghrcQcn42Ql2XJSsBnGZAJUyksF2PzcqNNVg_AH76S1dyytMri8Su6MHqldRozbHbrZL8SEIgVEqjtX00OgVcXKRIFa6FrFq8zEfQ9TUyopVT9rpD2x9ZqLDGm9iup4RwoQW5ltGJqmrdHoWJ4okszI2TaocA-B0NUCAQ9F8dygEJzZm2Y"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Categories Bar */}
              <section className="mb-16">
                <div className="flex flex-wrap items-center justify-center gap-6 py-8 overflow-x-auto no-scrollbar">
                  {['Tất cả', 'Biển đảo', 'Văn hóa', 'Mạo hiểm', 'Nghỉ dưỡng'].map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`${selectedCategory === cat ? 'neumorphic-recessed text-primary' : 'neumorphic-card text-on-surface-variant hover:text-primary'} px-8 py-3 rounded-full font-bold font-body whitespace-nowrap transition-all active:shadow-recessed`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Featured Tour Grid */}
              <section className="mb-32">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h3 className="text-4xl font-extrabold font-headline mb-2">
                      {selectedCategory === 'Tất cả' ? 'Hành trình tiêu biểu' : `Hành trình ${selectedCategory}`}
                    </h3>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-on-surface-variant font-body">Tìm thấy {filteredTours.length} kết quả</span>
                    <button className="text-primary font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
                      Xem tất cả <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <AnimatePresence mode="popLayout">
                    {filteredTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </AnimatePresence>
                </div>

                {filteredTours.length === 0 && (
                  <div className="text-center py-20 neumorphic-card rounded-lg">
                    <Filter className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-20" />
                    <h4 className="text-2xl font-bold font-headline mb-2">Không tìm thấy hành trình nào</h4>
                    <p className="text-on-surface-variant font-body">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                    <button 
                      onClick={() => { setSelectedCategory('Tất cả'); setSearchQuery(''); }}
                      className="mt-6 text-primary font-bold hover:underline"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </section>

              {/* Bento Grid Section */}
              <section className="mb-32">
                <h3 className="text-3xl font-bold font-headline mb-12 text-center">Cảm hứng du hành</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-8 h-auto md:h-[800px]">
                  <div className="md:col-span-2 md:row-span-2 neumorphic-card rounded-lg overflow-hidden relative min-h-[400px]">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhBec9bJYPxarkSKjc4wC66U2-pjDgDMoK8dsz6Qj0ZGgIJnkbTahSqtNfIxSAwEa5_g4b0Sgzq-ffw1uAqTrRshp8Bcnx4rBnd1tIrgcxpWKyQkxcpYqAKVZrpYAZOeRtru7FvYMiXxjebk3TU5Ev07bsmS4xBXtBhP_5tAgAf0EJGPnFrTYM4DYlG1o-p2wSeGTVUH1xn-6_rKH4gUrqkdFSRd9HQ7XtG1jOaD4dwCEvbDQrMrqRon06qhtwfn3UvOJDJx-Kdew"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                      <div>
                        <span className="text-white/80 text-sm font-bold tracking-widest uppercase mb-2 block">Mùa vàng</span>
                        <h4 className="text-white text-4xl font-bold font-headline">Tây Bắc Đại Ngàn</h4>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 neumorphic-card rounded-lg overflow-hidden relative min-h-[200px]">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4wY6YA38KQvGiXqaeNxIRA-aPvc8BANy5BexzsetJi6sxY2rDNJBZIZlmjuW7wigd8sjsjSMP530AJsatSAm0WXleGMnZfJYSMoU3s_tcm1zHHhhVFhmNKVjInVagremd7Bl66EGy4zW_BaQjGnzm5xJLYIedA_6QwcYVPaNemVv8e2UOMTj0Si-jDTzQPKn6US0Sxn4vaX0tnAX77KgeQJSLVg3o4ct9nWISlAs6l98aU4yZkZF0MnyJ9Bxg2jPCoUiwjO9FGk8"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <h4 className="text-white text-2xl font-bold font-headline">Cố Đô Huế - Vẻ đẹp cung đình</h4>
                    </div>
                  </div>
                  <div className="neumorphic-card rounded-lg overflow-hidden relative min-h-[200px]">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsb2tGO9cAmqurtsDVj01-q_pJ6sJQN6KdD1XLjGDr0ZXi1uevy3kjl5VuIlP2BhVdsmIDjns2g0uyAQ_BfYVtwOsNytydQA6OehmLpDBBWLHb5i0qZPRhMoX0Rv5sO_DSMzqlTtofzwQN2BIOzKMwzg5awJA2dWITEwbNORGBkOa5s0PolIEDKCBRBe3dJHgUAQkF7xpYhjgavTPVSFcW7grctj4__1QXodngblImsLLv263-QXUhpyk4A9nWZnMNdAkhu9nLYfw"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <h4 className="text-white text-lg font-bold font-headline">Sài Gòn Đêm</h4>
                    </div>
                  </div>
                  <div className="neumorphic-card rounded-lg overflow-hidden relative min-h-[200px]">
                    <img 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa0EKSnrj4JnUsifiXBY9kNeFUnSgFIbnQKVh8WGglJDSuhsuhc_1XQ3bD4hfvyQQq6NJzIuehjrQk298Y1gOpeoOVPk4kEbFjng_fMdNGGOgk0XvODM4BOovbQESgD9Td_R0tM89LIFa-p5MvVzvynd5HCm-MFluRX7_keYT_3_yo6uLPJbozT5pl3vIQw-QDaugkb8RWQ2RNyxjN0fSTqK9c2kXDh3-OBNt5ZVLBG-LOkUN3Yzyqz4pod73iQ2wgqzxsknq48l4"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <h4 className="text-white text-lg font-bold font-headline">Đà Lạt Mộng Mơ</h4>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <StoriesPage />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AboutPage />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Newsletter Subscription */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="neumorphic-recessed p-10 md:p-16 rounded-lg text-center">
            <h3 className="text-3xl font-bold font-headline mb-4">Nhận bản tin du hành</h3>
            <p className="text-on-surface-variant font-body mb-8">Chúng tôi sẽ gửi những câu chuyện và ưu đãi tốt nhất trực tiếp đến hộp thư của bạn.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="neumorphic-card bg-surface rounded-full px-6 py-4 flex-grow max-w-md flex items-center">
                <Mail className="text-primary mr-3 w-5 h-5" />
                <input 
                  className="bg-transparent border-none focus:outline-none w-full font-body" 
                  placeholder="Email của bạn" 
                  type="email"
                />
              </div>
              <button className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all">
                Đăng ký
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface w-full border-t border-white/20 shadow-[inset_0_2px_4px_rgba(163,177,198,0.5)]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 w-full max-w-[1920px] mx-auto">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="font-headline font-bold text-on-surface text-xl">VIETNAM JOURNALS</h2>
            <p className="font-body text-xs tracking-widest uppercase text-on-surface opacity-60 mt-2">© 2024 THE TACTILE NOMAD. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Press Kit'].map(link => (
              <a key={link} className="font-body text-xs tracking-widest uppercase text-on-surface opacity-60 hover:text-primary transition-colors" href="#">{link}</a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 flex gap-6">
            <div className="neumorphic-card w-10 h-10 rounded-full flex items-center justify-center text-on-surface opacity-60 hover:text-primary cursor-pointer transition-all active:shadow-recessed">
              <Globe className="w-4 h-4" />
            </div>
            <div className="neumorphic-card w-10 h-10 rounded-full flex items-center justify-center text-on-surface opacity-60 hover:text-primary cursor-pointer transition-all active:shadow-recessed">
              <AtSign className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
