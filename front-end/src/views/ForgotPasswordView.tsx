'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { authAPI } from '@/lib/api';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Step = 'request' | 'verify' | 'reset' | 'done';

export default function ForgotPasswordView() {
  const { lang } = useStore();
  const tr = t(lang);
  const router = useRouter();

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, code, new_password: newPassword });
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md glass p-8 rounded-3xl animate-slide-up">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-sm text-[var(--color-subtext-0)] hover:text-[var(--color-text)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Retour à la connexion
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold gradient-text mb-2">
            {step === 'done' ? 'Mot de passe réinitialisé !' : 'Mot de passe oublié'}
          </h2>
          <p className="text-[var(--color-subtext-0)] text-sm">
            {step === 'request' && 'Entrez votre email pour recevoir un code de réinitialisation.'}
            {step === 'verify' && `Un code a été envoyé à ${email}. Entrez-le ci-dessous.`}
            {step === 'reset' && 'Choisissez votre nouveau mot de passe.'}
            {step === 'done' && 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-red)] bg-[var(--color-red)]/10 border border-[var(--color-red)]/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Step 1 — Enter email */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-subtext-0)] ml-1">
                {tr.auth.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-overlay-0)]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field pl-10"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2 mt-4 py-3 text-base disabled:opacity-60"
            >
              <Send size={18} />
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </button>
          </form>
        )}

        {/* Step 2 — Enter code */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-subtext-0)] ml-1">
                Code de vérification
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                maxLength={6}
                className="input-field tracking-[0.5rem] text-center text-xl font-bold"
                placeholder="123456"
              />
            </div>
            <button
              type="submit"
              disabled={code.length < 6}
              className="btn-primary w-full flex justify-center items-center gap-2 mt-4 py-3 text-base disabled:opacity-60"
            >
              Vérifier le code
            </button>
            <button
              type="button"
              onClick={() => { setStep('request'); setCode(''); }}
              className="w-full text-center text-sm text-[var(--color-subtext-0)] hover:text-[var(--color-text)] transition-colors"
            >
              Renvoyer un code
            </button>
          </form>
        )}

        {/* Step 3 — New password */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-subtext-0)] ml-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-subtext-0)] ml-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2 mt-4 py-3 text-base disabled:opacity-60"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}

        {/* Step 4 — Done */}
        {step === 'done' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle size={64} className="text-[var(--color-green)]" />
            </div>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary w-full py-3 text-base"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
