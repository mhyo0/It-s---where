import { YouthCenter } from '@/types';
import { t } from '@/lib/translations';
import { useStore } from '@/lib/store';
import { MapPin, Star, Users, Phone } from 'lucide-react';

interface CenterCardProps {
  center: YouthCenter;
  onClick: () => void;
}

export default function CenterCard({ center, onClick }: CenterCardProps) {
  const { lang } = useStore();
  const tr = t(lang);
  
  const name = lang === 'ar' ? center.nameAr : lang === 'fr' ? center.nameFr : center.name;

  return (
    <div onClick={onClick} className="glass card-hover rounded-2xl overflow-hidden cursor-pointer p-5 flex flex-col gap-3 group">
      <div className="flex justify-between items-start">
        <h3 className="font-display font-semibold text-lg text-[var(--color-lavender)] group-hover:text-[var(--color-mauve)] transition-colors">{name}</h3>
        <div className="flex items-center gap-1 bg-[var(--color-surface-0)] px-2 py-1 rounded-lg text-xs font-medium">
          <Star size={12} className="text-[var(--color-yellow)] fill-[var(--color-yellow)]" />
          <span>{center.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="flex items-start gap-2 text-sm text-[var(--color-subtext-0)]">
        <MapPin size={16} className="text-[var(--color-blue)] shrink-0 mt-0.5" />
        <span className="line-clamp-2">{center.address}, {center.city}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {center.facilities.slice(0, 3).map((facility, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-md bg-[var(--color-surface-0)] text-[var(--color-subtext-1)] border border-[var(--color-surface-1)]">
            {facility}
          </span>
        ))}
        {center.facilities.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-md bg-[var(--color-surface-0)] text-[var(--color-subtext-1)]">
            +{center.facilities.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-surface-0)]">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-subtext-0)]">
          <Users size={14} className="text-[var(--color-green)]" />
          <span>Capacité: <strong className="text-[var(--color-text)]">{center.capacity}</strong></span>
        </div>
        {center.phone && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-subtext-0)]">
            <Phone size={14} className="text-[var(--color-sapphire)]" />
            <span>{center.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
