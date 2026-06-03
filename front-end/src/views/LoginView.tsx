'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Mail, Lock, LogIn, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginView() {
  const { lang, login } = useStore();
  const tr = t(lang);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md glass p-8 rounded-3xl animate-slide-up">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm text-[var(--color-subtext-0)] hover:text-[var(--color-text)] mb-6 transition-colors">
          <ArrowLeft size={16} /> {tr.common.back}
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold gradient-text mb-2">{tr.auth.login}</h2>
          <p className="text-[var(--color-subtext-0)] text-sm">{tr.appName} - {tr.tagline}</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-red)] bg-[var(--color-red)]/10 border border-[var(--color-red)]/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--color-subtext-0)] ml-1">{tr.auth.email}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-overlay-0)]">
                <Mail size={18} />
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input-field pl-10" placeholder="zaki@example.com" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-[var(--color-subtext-0)]">{tr.auth.password}</label>
              <button type="button" onClick={() => router.push('/forgot-password')} className="text-xs text-[var(--color-lavender)] hover:underline">
                {tr.auth.forgotPassword}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-overlay-0)]">
                <Lock size={18} />
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex justify-center items-center gap-2 mt-6 py-3 text-base disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? 'Connexion...' : tr.auth.login}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-subtext-0)]">
          {tr.auth.noAccount}{' '}
          <button onClick={() => router.push('/signup')} className="text-[var(--color-lavender)] font-medium hover:underline">
            {tr.auth.signup}
          </button>
        </div>
      </div>
    </div>
  );
}
