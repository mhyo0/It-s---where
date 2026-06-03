import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { WILAYAS } from '@/lib/data';
import EventCard from '@/components/EventCard';
import { Search, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { EventCategory } from '@/types';
import { useRouter } from 'next/navigation';

export default function HomeView() {
  const { lang, user, events } = useStore();
  const tr = t(lang);
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedWilaya, setSelectedWilaya] = useState(user?.wilaya || 'all');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Default sorting prioritizes user's city, then wilaya
  const locationSortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aCityMatch = a.city === user?.city ? 1 : 0;
      const bCityMatch = b.city === user?.city ? 1 : 0;
      if (aCityMatch !== bCityMatch) return bCityMatch - aCityMatch;
      
      const aWilayaMatch = a.wilaya === user?.wilaya ? 1 : 0;
      const bWilayaMatch = b.wilaya === user?.wilaya ? 1 : 0;
      return bWilayaMatch - aWilayaMatch;
    });
  }, [user, events]);

  // Smart Discovery logic: Strictly matching user interests AND location
  const recommendedEvents = useMemo(() => {
    if (!user) return [];
    return locationSortedEvents.filter(event => {
      const interests = user.interests || [];
      const matchesInterest = interests.includes(event.category) || event.tags?.some(tag => interests.includes(tag));
      const matchesLocation = event.wilaya === user.wilaya || event.city === user.city;
      return matchesInterest && matchesLocation;
    }).slice(0, 4);
  }, [user, locationSortedEvents]);

  // Filter logic
  const filteredEvents = useMemo(() => {
    return locationSortedEvents.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.titleAr.includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesWilaya = selectedWilaya === 'all' || event.wilaya === selectedWilaya;
      const matchesCity = selectedCity === '' || event.city.toLowerCase().includes(selectedCity.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesWilaya && matchesCity;
    });
  }, [searchQuery, selectedCategory, selectedWilaya, selectedCity, locationSortedEvents]);

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="mb-8 animate-slide-down">
        <h1 className="text-3xl font-display font-bold">Bienvenue, <span className="gradient-text">{user?.name}</span> 👋</h1>
        <p className="text-[var(--color-subtext-0)] mt-1">Voici les meilleures opportunités près de chez vous.</p>
      </div>

      {/* Compact Search and Filters */}
      <div className="glass p-3 rounded-2xl animate-slide-down sticky top-20 z-30 shadow-lg flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-overlay-0)]" size={18} />
          <input 
            type="text" 
            placeholder={tr.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 pl-10 h-10 text-sm"
          />
        </div>
        
        <div className="flex gap-2 border-t md:border-t-0 md:border-l border-[var(--color-surface-1)] pt-2 md:pt-0 md:pl-2">
          <select 
            value={selectedWilaya}
            onChange={(e) => setSelectedWilaya(e.target.value)}
            className="input-field py-2 text-sm bg-[var(--color-surface-0)] border-none w-32"
          >
            <option value="all">Toutes Wilayas</option>
            {WILAYAS.map(w => (
              <option key={w.code} value={w.name}>{w.name}</option>
            ))}
          </select>

          <input 
            type="text"
            placeholder="Ville..."
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="input-field py-2 text-sm bg-[var(--color-surface-0)] border-none w-28 placeholder-[var(--color-overlay-0)]"
          />
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="input-field py-2 text-sm bg-[var(--color-surface-0)] border-none w-32 capitalize"
          >
            <option value="all">Tous Intérêts</option>
            {(user?.interests || []).map((c: string) => (
              <option key={c} value={c}>{tr.categories[c as keyof typeof tr.categories] || c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommended Section (Only if empty search/filters) */}
      {!searchQuery && selectedCity === '' && selectedCategory === 'all' && selectedWilaya === (user?.wilaya || 'all') && recommendedEvents.length > 0 && (
        <section className="animate-slide-up stagger-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-[var(--color-yellow)]" size={20} />
            <h2 className="text-xl font-display font-bold gradient-text-warm">{tr.feed.recommended}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {recommendedEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => router.push(`/event/${event.id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* Main Feed */}
<section className="animate-slide-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <CalendarIcon size={20} className="text-[var(--color-lavender)]" />
            {searchQuery || selectedCategory !== 'all' || selectedWilaya !== (user?.wilaya || 'all') || selectedCity !== ''
              ? 'Résultats de recherche' 
              : tr.feed.upcoming}
          </h2>
          <span className="text-sm font-medium text-[var(--color-subtext-0)] px-2 py-1 bg-[var(--color-surface-0)] rounded-lg">
            {filteredEvents.length} événements
          </span>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => router.push(`/event/${event.id}`)} />
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-0)] flex items-center justify-center mb-4">
              <Search className="text-[var(--color-overlay-0)]" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
            <p className="text-[var(--color-subtext-0)] max-w-sm mb-6">Modifiez vos filtres ou effectuez une nouvelle recherche pour trouver des événements.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedWilaya('all'); setSelectedCity(''); }} className="btn-secondary">
              {tr.search.reset}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
