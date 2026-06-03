import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Language, EventCategory, Notification, Event } from '@/types';
import { authAPI, usersAPI, eventsAPI } from '@/lib/api';
import { mockEvents, mockNotifications } from '@/lib/data';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, age?: number) => Promise<void>;
  logout: () => void;
  // Language
  lang: Language;
  setLang: (lang: Language) => void;
  // Interests
  setInterests: (interests: EventCategory[]) => void;
  // Events
  events: Event[];
  addEvent: (event: Event) => void;
  savedEvents: string[];
  joinedEvents: string[];
  toggleSaveEvent: (eventId: string) => void;
  toggleJoinEvent: (eventId: string) => void;
  // Hover state for Picko
  hoveredEventId: string | null;
  setHoveredEventId: (id: string | null) => void;
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  // Onboarding
  completeOnboarding: () => void;
  // Profile
  updateProfile: (updates: Partial<User>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      lang: 'fr',
      events: mockEvents,
      savedEvents: [],
      joinedEvents: [],
      hoveredEventId: null,
      notifications: mockNotifications,
      currentPage: 'landing',

      login: async (email: string, password: string) => {
        try {
          const tokenRes = await authAPI.login({ email, password });
          const token = tokenRes.access_token;
          if (typeof window !== 'undefined') localStorage.setItem('access_token', token);

          // Fetch user profile, favourites, and registered events in parallel
          const [backendUser, favourites, registeredEvents] = await Promise.all([
            usersAPI.getMe(),
            usersAPI.getFavourites().catch(() => []),
            usersAPI.getMyEvents().catch(() => []),
          ]);

          // Map backend fields to frontend User shape
          const user: User = {
            id: String(backendUser.id),
            name: backendUser.username,
            email: backendUser.email,
            role: 'youth',
            wilaya: backendUser.postal_code || '',
            city: '',
            interests: favourites.map((c: any) => c.name?.toLowerCase() || ''),
            savedEvents: [],
            joinedEvents: registeredEvents.map((e: any) => String(e.id)),
            createdAt: backendUser.created_at,
            lang: (backendUser.preferred_language || 'fr') as Language,
          };

          const onboarded = user.interests.length > 0 && user.wilaya !== '';
          set({
            user,
            isAuthenticated: true,
            isOnboarded: onboarded,
            savedEvents: user.savedEvents,
            joinedEvents: user.joinedEvents,
          });

          get().setCurrentPage(onboarded ? 'home' : 'interests');
        } catch (e: any) {
          console.warn('Login failed', e);
          throw new Error(e.message || 'Login failed');
        }
      },

      signup: async (name: string, email: string, password: string, age?: number) => {
        try {
          await authAPI.register({ email, username: name, password, preferred_language: get().lang, postal_code: '' });
          // Auto-login after registration
          await get().login(email, password);
        } catch (e: any) {
          console.warn('Signup failed', e);
          throw new Error(e.message || 'Signup failed');
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false, isOnboarded: false, savedEvents: [], joinedEvents: [], currentPage: 'landing' });
      },

      setLang: (lang: Language) => {
        set({ lang });
        if (get().user) set({ user: { ...get().user!, lang } });
      },

      setInterests: (interests: EventCategory[]) => {
        if (get().user) {
          set({ user: { ...get().user!, interests } });
        }
      },

      toggleSaveEvent: (eventId: string) => {
        const saved = get().savedEvents;
        const newSaved = saved.includes(eventId) ? saved.filter(id => id !== eventId) : [...saved, eventId];
        set({ savedEvents: newSaved });
        if (get().user) set({ user: { ...get().user!, savedEvents: newSaved } });
      },

      addEvent: (event: Event) => {
        set({ events: [event, ...get().events] });
      },

      setHoveredEventId: (id: string | null) => {
        set({ hoveredEventId: id });
      },

      toggleJoinEvent: (eventId: string) => {
        const joined = get().joinedEvents;
        const newJoined = joined.includes(eventId) ? joined.filter(id => id !== eventId) : [...joined, eventId];
        set({ joinedEvents: newJoined });
        if (get().user) set({ user: { ...get().user!, joinedEvents: newJoined } });
      },

      markNotificationRead: (id: string) => {
        set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) });
      },

      markAllNotificationsRead: () => {
        set({ notifications: get().notifications.map(n => ({ ...n, read: true })) });
      },

      setCurrentPage: (page: string) => set({ currentPage: page }),

      completeOnboarding: () => set({ isOnboarded: true, currentPage: 'home' }),

      updateProfile: (updates: Partial<User>) => {
        if (get().user) {
          set({ user: { ...get().user!, ...updates } });
        }
      },
    }),
    {
      name: 'talentdz-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        lang: state.lang,
        savedEvents: state.savedEvents,
        joinedEvents: state.joinedEvents,
      }),
    }
  )
);
