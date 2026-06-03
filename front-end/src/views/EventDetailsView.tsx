import { useState } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { mockEvents, mockComments, INTEREST_ICONS } from '@/lib/data';
import { ArrowLeft, Calendar, MapPin, Users, Mail, Phone, Bookmark, BookmarkCheck, Share2, MessageSquare, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventDetailsViewProps {
  eventId: string;
}

export default function EventDetailsView({ eventId }: EventDetailsViewProps) {
  const { user, lang, savedEvents, joinedEvents, toggleSaveEvent, toggleJoinEvent } = useStore();
  const tr = t(lang);
  const router = useRouter();
  
  const event = mockEvents.find(e => e.id === eventId);
  
  if (!event) return <div className="text-center py-20">Événement introuvable</div>;

  const isSaved = savedEvents.includes(event.id);
  const isJoined = joinedEvents.includes(event.id);
  const isFull = event.registered >= event.capacity;
  
  const title = lang === 'ar' ? event.titleAr : lang === 'fr' ? event.titleFr : event.title;
  const description = lang === 'ar' ? event.descriptionAr : lang === 'fr' ? event.descriptionFr : event.description;
  
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const dateStr = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  const timeStr = `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: description, url: window.location.href }).catch(console.error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <button onClick={() => router.push('/home')} className="flex items-center gap-2 text-sm text-[var(--color-subtext-0)] hover:text-[var(--color-text)] mb-6 transition-colors">
        <ArrowLeft size={16} /> {tr.common.back}
      </button>

      {/* Clean Header (Eco-friendly) */}
      <div className="w-full rounded-3xl mb-8 flex items-center justify-between">
        <div className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="text-xl">{INTEREST_ICONS[event.category]}</span>
          <span className="capitalize">{tr.categories[event.category as keyof typeof tr.categories] || event.category}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleShare} className="glass p-3 rounded-xl hover:bg-[var(--color-surface-0)] transition-colors">
            <Share2 size={18} />
          </button>
          <button onClick={() => toggleSaveEvent(event.id)} className="glass p-3 rounded-xl hover:bg-[var(--color-surface-0)] transition-colors">
            {isSaved ? <BookmarkCheck size={18} className="text-[var(--color-lavender)]" /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-subtext-0)]">
              <div className="flex items-center gap-2 bg-[var(--color-surface-0)] px-3 py-1.5 rounded-lg">
                <Calendar size={16} className="text-[var(--color-mauve)]" />
                <span>{dateStr} à {timeStr}</span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--color-surface-0)] px-3 py-1.5 rounded-lg">
                <MapPin size={16} className="text-[var(--color-blue)]" />
                <span>{event.centerName}, {event.wilaya}</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">À propos</h2>
            <p className="text-[var(--color-subtext-0)] leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-[var(--color-subtext-0)] mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[var(--color-surface-0)] border border-[var(--color-surface-1)] text-xs font-medium capitalize">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="pt-8 border-t border-[var(--color-surface-0)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Phone size={20} className="text-[var(--color-lavender)]"/> 
              Contact de l'organisateur
            </h2>
            <div className="glass p-6 rounded-2xl flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center border border-[var(--color-surface-1)]">
              <div className="space-y-1">
                <p className="font-medium text-[var(--color-text)]">{event.organizerName || 'ODEJ'}</p>
                <p className="text-sm text-[var(--color-subtext-0)] leading-relaxed">
                  Pour toute question ou information complémentaire, n'hésitez pas à contacter le responsable de cet événement.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                {event.contactEmail && (
                  <a 
                    href={event.contactEmail.includes('@') ? `mailto:${event.contactEmail}` : `tel:${event.contactEmail}`}
                    className="btn-secondary flex items-center justify-center gap-2 text-sm w-full py-2.5 px-4"
                  >
                    {event.contactEmail.includes('@') ? <Mail size={16} /> : <Phone size={16} />}
                    <span>{event.contactEmail}</span>
                  </a>
                )}
                {event.contactPhone && (
                  <a 
                    href={`tel:${event.contactPhone}`}
                    className="btn-secondary flex items-center justify-center gap-2 text-sm w-full py-2.5 px-4"
                  >
                    <Phone size={16} />
                    <span>{event.contactPhone}</span>
                  </a>
                )}
                {!event.contactEmail && !event.contactPhone && (
                  <span className="text-sm text-[var(--color-subtext-1)] italic">Aucun contact spécifié</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <div className="text-center mb-6 pb-6 border-b border-[var(--color-surface-1)]">
              <p className="text-sm text-[var(--color-subtext-0)]">
                {isFull ? <span className="text-[var(--color-red)] font-medium">{tr.event.full}</span> : `${event.capacity - event.registered} ${tr.event.spotsLeft}`}
              </p>
            </div>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-subtext-0)]">{tr.event.organizer}</span>
                <span className="font-medium">{event.organizerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-subtext-0)]">{tr.event.age}</span>
                <span className="font-medium">{event.ageRange.min} - {event.ageRange.max} ans</span>
              </div>
              {event.contactEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-subtext-0)]">Contact</span>
                  <a 
                    href={event.contactEmail.includes('@') ? `mailto:${event.contactEmail}` : `tel:${event.contactEmail}`} 
                    className="font-medium text-[var(--color-lavender)] hover:underline truncate max-w-[150px]"
                  >
                    {event.contactEmail}
                  </a>
                </div>
              )}
              {event.contactPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-subtext-0)]">Téléphone</span>
                  <a 
                    href={`tel:${event.contactPhone}`} 
                    className="font-medium text-[var(--color-lavender)] hover:underline"
                  >
                    {event.contactPhone}
                  </a>
                </div>
              )}
            </div>

            {event.requirements && event.requirements.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-subtext-0)] mb-2 uppercase tracking-wider">
                  <Info size={14} /> {tr.event.requirements}
                </div>
                <ul className="list-disc list-inside text-sm text-[var(--color-subtext-1)] space-y-1">
                  {event.requirements.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
              </div>
            )}

            <button 
              onClick={() => toggleJoinEvent(event.id)}
              disabled={isFull && !isJoined}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                isJoined 
                  ? 'bg-[var(--color-surface-0)] border border-[var(--color-surface-1)] text-[var(--color-text)]' 
                  : isFull 
                    ? 'bg-[var(--color-surface-0)] text-[var(--color-overlay-0)] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[var(--color-mauve)] to-[var(--color-lavender)] text-[var(--color-crust)] hover:brightness-110 shadow-lg shadow-[var(--color-mauve)]/20'
              }`}
            >
              {isJoined ? tr.event.registered : tr.event.register}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
