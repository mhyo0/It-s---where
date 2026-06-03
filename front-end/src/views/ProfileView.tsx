import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { mockEvents } from '@/lib/data';
import EventCard from '@/components/EventCard';
import { User, Settings, MapPin, Tag, Award, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileView() {
  const { user, lang, savedEvents, joinedEvents } = useStore();
  const tr = t(lang);
  const router = useRouter();

  if (!user) return null;

  const mySavedEvents = mockEvents.filter(e => savedEvents.includes(e.id));
  const myJoinedEvents = mockEvents.filter(e => joinedEvents.includes(e.id));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[var(--color-mauve)]/20 to-[var(--color-blue)]/20" />

        <div className="relative z-10 w-24 h-24 rounded-2xl bg-[var(--color-surface-1)] flex items-center justify-center text-4xl font-display font-bold text-[var(--color-text)] border-4 border-[var(--color-base)] shadow-xl">
          {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
        </div>

        <div className="relative z-10 flex-grow text-center md:text-left pt-2 md:pt-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{user.name}</h1>
          <p className="text-[var(--color-subtext-0)] mb-4">{user.email}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--color-surface-0)] text-sm">
              <MapPin size={14} className="text-[var(--color-blue)]" />
              <span>{user.city ? `${user.city}, ` : ''}{user.wilaya || 'Localisation non spécifiée'}</span>
            </div>
            {user.age && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--color-surface-0)] text-sm">
                <User size={14} className="text-[var(--color-teal)]" />
                <span>{user.age} ans</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--color-surface-0)] text-sm">
              <Award size={14} className="text-[var(--color-yellow)]" />
              <span className="capitalize">Jeune citoyen</span>
            </div>
          </div>
        </div>

        <button className="relative z-10 btn-secondary flex items-center gap-2">
          <Edit3 size={16} /> <span className="hidden sm:inline">{tr.profile.editProfile}</span>
        </button>
      </div>

      {/* Interests */}
      <div className="glass p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Tag size={18} className="text-[var(--color-lavender)]" /> {tr.profile.interests}</h2>
          <button onClick={() => router.push('/interests')} className="text-sm text-[var(--color-lavender)] hover:underline">Modifier</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(user?.interests || []).map(interest => (
            <span key={interest} className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-0)] border border-[var(--color-surface-1)] text-sm capitalize">
              {tr.categories[interest as keyof typeof tr.categories] || interest}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs / Content */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-display font-bold mb-4 gradient-text inline-block">{tr.profile.joinedEvents} ({myJoinedEvents.length})</h2>
          {myJoinedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myJoinedEvents.map(event => (
                <EventCard key={event.id} event={event} onClick={() => router.push(`/event/${event.id}`)} />
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl text-center text-[var(--color-subtext-0)]">
              Vous n'avez rejoint aucun événement.
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-[var(--color-surface-0)]">
          <h2 className="text-xl font-display font-bold mb-4">{tr.profile.savedEvents} ({mySavedEvents.length})</h2>
          {mySavedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySavedEvents.map(event => (
                <EventCard key={event.id} event={event} onClick={() => router.push(`/event/${event.id}`)} />
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl text-center text-[var(--color-subtext-0)]">
              Aucun événement sauvegardé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
