'use client';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Home, Search, Map, Users, User, LayoutDashboard, Bell, Globe, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { lang, setLang, user, isAuthenticated, logout, notifications } = useStore();
  const tr = t(lang);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: {id: string, label: string, icon: any}[] = [
    { id: 'home', label: tr.nav.home, icon: Home },
    { id: 'profile', label: tr.nav.profile, icon: User },
  ];

  if (user?.role === 'odej_admin' || user?.role === 'center_manager') {
    navItems.push({ id: 'admin', label: tr.nav.admin, icon: LayoutDashboard });
  }

  const handleNav = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => handleNav('/')} className="flex items-center gap-2 group">
            <Logo className="h-10 w-auto transition-transform group-hover:scale-105" />
          </button>

          <div className="flex items-center gap-1">
            {isAuthenticated && navItems.map(item => {
              const itemPath = item.id === 'home' ? '/home' : `/${item.id}`;
              const isActive = pathname === itemPath || (item.id === 'home' && pathname === '/');
              return (
              <button key={item.id} onClick={() => handleNav(itemPath)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--color-surface-0)] text-[var(--color-lavender)]' 
                    : 'text-[var(--color-subtext-0)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-0)]/50'
                }`}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            )})}
          </div>

          <div className="flex items-center gap-3">


            {/* Language Switcher */}
            <div className="relative">
              <button onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); }}
                className="p-2 rounded-xl text-[var(--color-subtext-0)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-0)] transition-all">
                <Globe size={18} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 glass rounded-xl p-2 min-w-[140px] animate-slide-down">
                  {(['fr', 'ar', 'tz'] as const).map(l => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        lang === l ? 'bg-[var(--color-surface-0)] text-[var(--color-lavender)]' : 'text-[var(--color-subtext-0)] hover:bg-[var(--color-surface-0)]/50'
                      }`}>
                      {l === 'fr' ? '🇫🇷 Français' : l === 'ar' ? '🇩🇿 العربية' : 'ⵣ Tamazight'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button onClick={() => { setNotifOpen(!notifOpen); setLangOpen(false); }}
                  className="p-2 rounded-xl text-[var(--color-subtext-0)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-0)] transition-all relative">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--color-red)] text-[var(--color-crust)] text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 glass rounded-xl p-3 w-80 max-h-96 overflow-y-auto animate-slide-down">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-sm">{tr.notifications.title}</span>
                      <button onClick={() => useStore.getState().markAllNotificationsRead()} className="text-xs text-[var(--color-lavender)] hover:underline">{tr.notifications.markAllRead}</button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-[var(--color-overlay-0)] py-4 text-center">{tr.notifications.noNotifications}</p>
                    ) : (
                      notifications.map(n => (
                        <button key={n.id} onClick={() => { useStore.getState().markNotificationRead(n.id); if (n.eventId) { handleNav('/event/' + n.eventId); } setNotifOpen(false); }}
                          className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${!n.read ? 'bg-[var(--color-surface-0)]' : 'hover:bg-[var(--color-surface-0)]/50'}`}>
                          <div className="flex items-start gap-2">
                            {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--color-lavender)] mt-1.5 shrink-0" />}
                            <div>
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-[var(--color-subtext-0)] mt-0.5">{n.message}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Auth buttons */}
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <button onClick={() => handleNav('/login')} className="btn-ghost text-sm">{tr.auth.login}</button>
                <button onClick={() => handleNav('/signup')} className="btn-primary text-sm">{tr.auth.signup}</button>
              </div>
            ) : (
              <button onClick={logout} className="p-2 rounded-xl text-[var(--color-subtext-0)] hover:text-[var(--color-red)] hover:bg-[var(--color-surface-0)] transition-all" title={tr.auth.logout}>
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass md:hidden">
        <div className="px-4 h-14 flex items-center justify-between">
          <button onClick={() => handleNav(isAuthenticated ? '/home' : '/')} className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </button>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button onClick={() => { setNotifOpen(!notifOpen); }}
                className="p-2 rounded-xl text-[var(--color-subtext-0)] relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--color-red)] text-[var(--color-crust)] text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl text-[var(--color-subtext-0)]">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile notifications dropdown */}
        {notifOpen && (
          <div className="absolute right-4 top-14 glass rounded-xl p-3 w-[calc(100%-2rem)] max-h-80 overflow-y-auto animate-slide-down z-50">
            {notifications.map(n => (
              <button key={n.id} onClick={() => { useStore.getState().markNotificationRead(n.id); if (n.eventId) handleNav('/event/' + n.eventId); setNotifOpen(false); }}
                className={`w-full text-left p-3 rounded-lg mb-1 ${!n.read ? 'bg-[var(--color-surface-0)]' : ''}`}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-[var(--color-subtext-0)]">{n.message}</p>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-14 bottom-0 w-72 bg-[var(--color-mantle)] p-4 animate-slide-in-right">
            <div className="flex flex-col gap-1">
              {isAuthenticated ? navItems.map(item => {
                const itemPath = item.id === 'home' ? '/home' : `/${item.id}`;
                const isActive = pathname === itemPath || (item.id === 'home' && pathname === '/');
                return (
                <button key={item.id} onClick={() => handleNav(itemPath)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-[var(--color-surface-0)] text-[var(--color-lavender)]' : 'text-[var(--color-subtext-0)]'
                  }`}>
                  <item.icon size={18} />
                  {item.label}
                </button>
              )}) : (
                <>
                  <button onClick={() => handleNav('/login')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-subtext-0)]">
                    <User size={18} />{tr.auth.login}
                  </button>
                  <button onClick={() => handleNav('/signup')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-lavender)]">
                    <User size={18} />{tr.auth.signup}
                  </button>
                </>
              )}
            </div>
            <div className="mt-6 border-t border-[var(--color-surface-0)] pt-4">
              <p className="text-xs text-[var(--color-overlay-0)] mb-2 px-4">{tr.profile.language}</p>
              {(['fr', 'ar', 'tz'] as const).map(l => (
                <button key={l} onClick={() => { setLang(l); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm ${lang === l ? 'text-[var(--color-lavender)]' : 'text-[var(--color-subtext-0)]'}`}>
                  {l === 'fr' ? '🇫🇷 Français' : l === 'ar' ? '🇩🇿 العربية' : 'ⵣ Tamazight'}
                </button>
              ))}
            </div>
            {isAuthenticated && (
              <button onClick={() => { logout(); setMobileOpen(false); }}
                className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-red)]">
                <LogOut size={18} />{tr.auth.logout}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.slice(0, 5).map(item => {
              const itemPath = item.id === 'home' ? '/home' : `/${item.id}`;
              const isActive = pathname === itemPath || (item.id === 'home' && pathname === '/');
              return (
              <button key={item.id} onClick={() => handleNav(itemPath)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-[var(--color-lavender)]' : 'text-[var(--color-overlay-0)]'
                }`}>
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )})}
          </div>
        </div>
      )}
    </>
  );
}
