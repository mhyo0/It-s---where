'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { mockUser, WILAYAS, INTEREST_ICONS } from '@/lib/data';
import { Lock, LayoutDashboard, Users, MapPin, Calendar, Edit3, Plus, Search, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const { addEvent, events } = useStore();
  const [localEvents, setLocalEvents] = useState(events);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', capacity: 100, date: '', centerName: '', wilaya: '', category: '', description: '', image: '', contact: '' });
  const [filterWilaya, setFilterWilaya] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password as requested for the unique admin/ministry login
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-base)] flex items-center justify-center p-4">
        <div className="glass p-8 rounded-3xl max-w-md w-full animate-slide-up text-center border border-[var(--color-surface-1)] relative">
          
          {/* Back button */}
          <Link href="/" className="absolute top-6 left-6 text-[var(--color-subtext-0)] hover:text-[var(--color-text)] transition-colors flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Retour
          </Link>

          <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-0)] flex items-center justify-center mx-auto mb-6 mt-4 text-[var(--color-lavender)]">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Accès Administrateur</h1>
          <p className="text-sm text-[var(--color-subtext-0)] mb-8">Espace réservé au Ministère de la Jeunesse et ODEJ</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe administrateur"
              className={`input-field text-center ${error ? 'border-[var(--color-red)]' : ''}`}
              required
            />
            {error && <p className="text-xs text-[var(--color-red)]">Mot de passe incorrect</p>}
            <button type="submit" className="btn-primary w-full py-3">Connexion</button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[var(--color-base)] pb-20">
      {/* Simple Header for Admin */}
      <header className="glass sticky top-0 z-50 px-6 py-4 border-b border-[var(--color-surface-1)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-mauve)] to-[var(--color-lavender)] flex items-center justify-center text-[var(--color-crust)]">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Tableau de Bord ODEJ</h1>
            <p className="text-xs text-[var(--color-subtext-0)]">Gestion des événements et participants</p>
          </div>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="btn-ghost text-sm">Déconnexion</button>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-6">
        
        {showAddForm ? (
          <div className="glass p-6 rounded-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ajouter un événement</h2>
              <button onClick={() => setShowAddForm(false)} className="text-[var(--color-subtext-0)] hover:text-[var(--color-text)]">Fermer</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const eventId = 'e-' + Date.now();
              const newEv = {
                id: eventId,
                title: newEvent.title,
                titleAr: newEvent.title,
                titleFr: newEvent.title,
                description: newEvent.description, descriptionAr: newEvent.description, descriptionFr: newEvent.description,
                category: (newEvent.category || 'technology') as any, tags: [newEvent.category || 'technology'] as any, status: 'upcoming' as any,
                startDate: newEvent.date || new Date().toISOString(), endDate: newEvent.date || new Date().toISOString(),
                location: newEvent.centerName, wilaya: newEvent.wilaya || 'Alger', city: newEvent.wilaya || 'Alger', lat: 0, lng: 0,
                centerId: 'c1', centerName: newEvent.centerName,
                organizerName: 'ODEJ', image: newEvent.image, capacity: newEvent.capacity, registered: 0,
                isFree: true, ageRange: { min: 12, max: 35 }, contactEmail: newEvent.contact
              };
              addEvent(newEv);
              setLocalEvents(prev => [newEv, ...prev]);
              setShowAddForm(false);
              setNewEvent({ title: '', capacity: 100, date: '', centerName: '', wilaya: '', category: '', description: '', image: '', contact: '' });
            }} className="space-y-4">
              <div>
                <label className="text-sm text-[var(--color-subtext-0)]">Titre de l'événement</label>
                <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required className="input-field w-full mt-1" />
              </div>
              <div>
                <label className="text-sm text-[var(--color-subtext-0)]">Description</label>
                <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required rows={3} className="input-field w-full mt-1 resize-none" placeholder="Décrivez l'événement..." />
              </div>
              <div>
                <label className="text-sm text-[var(--color-subtext-0)]">Catégorie</label>
                <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} required className="input-field w-full mt-1">
                  <option value="" disabled>Choisir une catégorie...</option>
                  {Object.entries(INTEREST_ICONS).map(([key, icon]) => (
                    <option key={key} value={key}>{icon} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[var(--color-subtext-0)]">Image locale (Optionnel)</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewEvent({...newEvent, image: URL.createObjectURL(file)});
                    }
                  }} className="input-field w-full mt-1 pt-2" />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-subtext-0)]">Contact (Email ou Tél)</label>
                  <input type="text" value={newEvent.contact} onChange={e => setNewEvent({...newEvent, contact: e.target.value})} className="input-field w-full mt-1" placeholder="contact@exemple.com" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--color-subtext-0)]">Wilaya</label>
                <select value={newEvent.wilaya} onChange={e => setNewEvent({...newEvent, wilaya: e.target.value})} required className="input-field w-full mt-1">
                  <option value="">Sélectionner une wilaya...</option>
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[var(--color-subtext-0)]">Capacité</label>
                  <input type="number" value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})} required className="input-field w-full mt-1" />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-subtext-0)]">Date</label>
                  <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required className="input-field w-full mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[var(--color-subtext-0)]">Lieu (Centre)</label>
                <input type="text" value={newEvent.centerName} onChange={e => setNewEvent({...newEvent, centerName: e.target.value})} required className="input-field w-full mt-1" />
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">Enregistrer l'événement</button>
            </form>
          </div>
        ) : selectedEventId ? (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => setSelectedEventId(null)} className="flex items-center gap-2 text-sm text-[var(--color-subtext-0)] hover:text-[var(--color-text)] transition-colors">
              <ArrowLeft size={16} /> Retour aux événements
            </button>
            
            {(() => {
              const event = localEvents.find(e => e.id === selectedEventId);
              if (!event) return null;
              return (
                <div className="glass p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                  <div className="flex gap-4 text-sm text-[var(--color-subtext-0)] mb-6">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(event.startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {event.centerName}</span>
                    <span className="flex items-center gap-1"><Users size={14}/> {event.registered} inscrits</span>
                  </div>
                  
                  <div className="border-t border-[var(--color-surface-1)] pt-6">
                    <h3 className="text-lg font-semibold mb-4">Participants Inscrits</h3>
                    <div className="space-y-3">
                      {event.registered === 0 ? (
                        <p className="text-[var(--color-subtext-0)]">Aucun participant pour le moment.</p>
                      ) : (
                        Array.from({ length: Math.min(event.registered, 5) }).map((_, i) => (
                          <div key={i} className="bg-[var(--color-surface-0)] p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-1)] flex items-center justify-center font-bold text-[var(--color-lavender)]">
                                {i === 0 ? mockUser.name.charAt(0) : 'P'}
                              </div>
                              <div>
                                <p className="font-medium">{i === 0 ? mockUser.name : `Participant ${i+1}`}</p>
                                <p className="text-xs text-[var(--color-subtext-0)]">{i === 0 ? mockUser.email : `participant${i+1}@example.dz`} • {i === 0 ? mockUser.city : 'Alger'}</p>
                              </div>
                            </div>
                            <span className="text-xs text-[var(--color-green)] font-medium bg-[var(--color-green)]/10 px-2 py-1 rounded">Confirmé</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-bold">Vos Événements Actifs</h2>
              <div className="flex items-center gap-2">
                <select 
                  value={filterWilaya}
                  onChange={(e) => setFilterWilaya(e.target.value)}
                  className="input-field py-2 text-sm bg-[var(--color-surface-0)] border-none"
                >
                  <option value="" disabled>Choisir une wilaya...</option>
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                  ))}
                </select>
                <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Ajouter un événement</button>
              </div>
            </div>

            {!filterWilaya ? (
              <div className="text-center py-16 text-[var(--color-subtext-0)]">
                <MapPin size={40} className="mx-auto mb-4 text-[var(--color-surface-2)]" />
                <p className="text-lg font-medium">Sélectionnez une wilaya</p>
                <p className="text-sm mt-1">Choisissez une wilaya pour afficher ses événements.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localEvents.filter(e => e.wilaya === filterWilaya).map(event => (
                <div 
                  key={event.id} 
                  onClick={() => setSelectedEventId(event.id)}
                  className="glass p-5 rounded-2xl cursor-pointer transition-all hover:border-[var(--color-surface-2)] hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold line-clamp-1">{event.title}</h3>
                    <span className="text-xs px-2 py-1 bg-[var(--color-surface-0)] rounded-md whitespace-nowrap">{event.registered} / {event.capacity} inscrits</span>
                  </div>
                  <div className="space-y-2 text-sm text-[var(--color-subtext-0)]">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-[var(--color-mauve)]"/> {new Date(event.startDate).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-[var(--color-blue)]"/> {event.centerName}</div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
