import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { ArrowRight, Leaf, Zap, Shield, Globe, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import EventCard from '@/components/EventCard';

export default function LandingView() {
  const { lang, user, events } = useStore();
  const tr = t(lang);
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // If user is somehow here while logged in, redirect to home
  useEffect(() => {
    if (user) router.push('/home');
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto py-12 relative">
      {/* Mouse Follow Glow */}
      <div
          className="pointer-events-none fixed inset-0 z-0 transition-all duration-75 ease-linear"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(180,190,254,0.12), transparent 80%)`,
            willChange: 'background-position, background',
          }}
        />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight animate-slide-up stagger-2 flex flex-col items-center">
          <div className="text-[var(--color-text)] mb-4 flex justify-center w-full">
            <Logo className="w-64 h-auto md:w-80" />
          </div>
          <span className="text-3xl md:text-5xl mt-2 block text-[var(--color-text)]">
            {tr.landing.hero}
          </span>
        </h1>
      
      <p className="text-lg md:text-xl text-[var(--color-subtext-0)] mb-10 max-w-2xl animate-slide-up stagger-3">
        {tr.landing.heroSub}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-4 mb-20">
        <button onClick={() => router.push('/signup')} className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
          {tr.landing.cta} <ArrowRight size={20} />
        </button>
        <button onClick={() => router.push('/login')} className="btn-secondary text-lg px-8 py-4">
          {tr.auth.login}
        </button>
      </div>

      {/* Events Showcase Section */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-20 animate-slide-up stagger-5">
        <div className="flex items-center justify-center gap-3 mb-8">
          <CalendarIcon className="text-[var(--color-lavender)]" size={28} />
          <h2 className="text-3xl md:text-4xl font-display font-bold">Événements à venir</h2>
        </div>
        
        <div className="animated-border-cadre p-[2px] shadow-2xl">
          <div className="animated-border-inner p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => router.push(`/login`)} // Visitors must login to view details
                />
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--color-surface-1)] text-center">
              <p className="text-[var(--color-subtext-0)] mb-4">Connectez-vous pour voir tous les événements et participer !</p>
              <button onClick={() => router.push('/signup')} className="text-[var(--color-lavender)] font-medium hover:underline">
                Rejoindre la plateforme →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback & Footer Section */}
      <div className="w-full bg-[var(--color-mantle)] mt-auto pt-16 pb-8 border border-[var(--color-surface-0)] rounded-3xl mb-8 shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass p-8 rounded-3xl mb-12 text-center">
            <h3 className="text-xl font-bold mb-4">Laissez vos commentaires</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-2 text-[var(--color-yellow)]">
                {[1,2,3,4,5].map(star => <span key={star} className="cursor-pointer text-2xl hover:scale-110 transition-transform">★</span>)}
              </div>
              <textarea 
                className="input-field bg-[var(--color-base)] min-h-[100px] resize-none text-center placeholder:text-center" 
                placeholder="Partagez votre expérience avec It's where..."
              />
              <button className="btn-primary self-center px-10">Envoyer</button>
            </div>
            {/* Display pinned feedback here (mocked) */}
            <div className="mt-8 pt-8 border-t border-[var(--color-surface-0)]">
              <h4 className="text-sm font-semibold text-[var(--color-subtext-0)] mb-4">Avis de nos utilisateurs</h4>
              <div className="glass-light p-4 rounded-xl flex flex-col items-center">
                <div className="flex flex-col items-center justify-center gap-1 mb-2">
                  <span className="font-medium text-sm">Amine K.</span>
                  <span className="text-[var(--color-yellow)] text-xs">★★★★★</span>
                </div>
                <p className="text-sm text-[var(--color-subtext-0)] text-center max-w-lg">Super plateforme! J'ai trouvé plein d'opportunités de bénévolat près de chez moi.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-[var(--color-subtext-0)] flex flex-col items-center justify-center gap-2">
            <p>© {new Date().getFullYear()} It's where. {tr.footer.rights}.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
