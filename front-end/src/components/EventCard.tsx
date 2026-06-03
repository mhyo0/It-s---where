import { Event } from '@/types';
import { t } from '@/lib/translations';
import { useStore } from '@/lib/store';
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck, Share2, Tag } from 'lucide-react';
import { INTEREST_ICONS } from '@/lib/data';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}
const CATEGORY_IMAGES: Record<string, string> = {
  technology: '1518770660439-4636190af475',
  programming: '1498050108023-c5249f4df085',
  entrepreneurship: '1556761175-5973dc0f32e7',
  sports: '1461896836934-ffe607ba8211',
  football: '1579952320564-44b4cb3b99ea',
  art: '1460661419201-64c9676c52ce',
  music: '1511671782779-c97d3d27a1d4',
  photography: '1516035069371-29a1b244cc32',
  environment: '1466611653911-95081537e5b7',
  volunteering: '1593113565687-ee2c2e646279',
  languages: '1456513080510-7bf3a84b82f8',
  ai: '1620712943543-bcc4688e7485',
  robotics: '1485827404703-89b55fcc595e',
  gaming: '1542751371-adc38448a05e',
  culture: '1513364776144-6096710bf8e3',
  science: '1532094349884-543bc11b234d',
  education: '1503676260728-1c00da094a0b',
  health: '1505751172876-fa143ce4af8f',
  workshop: '1588196749561-c14a1db304c1',
  competition: '1563505396683-1dd773957ce6',
  training: '1524178232363-1e420a71963b',
};

export default function EventCard({ event, onClick }: EventCardProps) {
  const { lang, savedEvents, toggleSaveEvent, setHoveredEventId } = useStore();
  const tr = t(lang);
  const isSaved = savedEvents.includes(event.id);
  
  const title = lang === 'ar' ? event.titleAr : lang === 'fr' ? event.titleFr : event.title;
  
  const startDate = new Date(event.startDate);
  const dateStr = startDate.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });
  
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveEvent(event.id);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this event on It's where: ${title}`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const isFull = (event.registered || 0) >= (event.capacity || 0);
  const spotsLeft = (event.capacity || 0) - (event.registered || 0);
  const imageId = CATEGORY_IMAGES[event.category] || '1518770660439-4636190af475';
  const unsplashUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=400&q=50`;
  const imageUrl = event.image && event.image.trim() !== '' && !event.image.startsWith('/images/')
    ? event.image 
    : unsplashUrl;

  return (
    <div 
      onClick={onClick} 
      onMouseEnter={() => setHoveredEventId(event.id)}
      onMouseLeave={() => setHoveredEventId(null)}
      className="glass card-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full group relative"
    >
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10 glass-light px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-lg backdrop-blur-md border border-[var(--color-surface-1)]">
        <span>{INTEREST_ICONS[event.category]}</span>
        <span className="capitalize">{tr.categories[event.category as keyof typeof tr.categories] || event.category}</span>
      </div>
      
      {/* Save Button */}
      <button onClick={handleSave} className="absolute top-3 right-3 z-10 glass-light p-2 rounded-lg text-xs hover:bg-[var(--color-surface-0)] transition-colors shadow-lg backdrop-blur-md border border-[var(--color-surface-1)]">
        {isSaved ? <BookmarkCheck size={16} className="text-[var(--color-lavender)]" /> : <Bookmark size={16} className="text-[var(--color-text)]" />}
      </button>

      {/* Event Image */}
      <div className="h-44 bg-[var(--color-surface-0)] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-mantle)] via-transparent to-transparent opacity-80 z-10" />
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-display font-semibold text-lg line-clamp-2 mb-2 group-hover:text-[var(--color-lavender)] transition-colors">{title}</h3>
        
        <div className="flex flex-col gap-2 mt-auto text-sm text-[var(--color-subtext-0)]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[var(--color-mauve)] shrink-0" />
            <span className="truncate">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[var(--color-blue)] shrink-0" />
            <span className="truncate">{event.city}, {event.wilaya}</span>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-surface-0)]">
            <div className="flex items-center gap-1.5 text-xs">
              <Users size={14} className="text-[var(--color-green)]" />
              {isFull ? (
                <span className="text-[var(--color-red)] font-medium">{tr.event.full}</span>
              ) : (
                <span><strong className="text-[var(--color-text)]">{spotsLeft}</strong> {tr.event.spotsLeft}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
