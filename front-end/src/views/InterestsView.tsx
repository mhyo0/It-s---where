import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { EventCategory } from '@/types';
import { INTEREST_ICONS, WILAYAS } from '@/lib/data';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InterestsView() {
  const { lang, completeOnboarding, setInterests, updateProfile } = useStore();
  const tr = t(lang);
  const router = useRouter();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInterest, setOtherInterest] = useState('');
  const [postcodesData, setPostcodesData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/algeria_postcodes.json')
      .then(res => res.json())
      .then(data => setPostcodesData(data))
      .catch(console.error);
  }, []);

  const wilayaCode = WILAYAS.find(w => w.name === selectedWilaya)?.code;
  const availableCommunes = wilayaCode 
    ? Array.from(new Map(postcodesData.filter(p => p.wilaya_code === wilayaCode).map(p => [p.post_code, p])).values())
    : [];
  
  const categories = Object.keys(tr.categories) as EventCategory[];

  const toggleInterest = (category: string) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter(c => c !== category));
    } else {
      setSelectedInterests([...selectedInterests, category]);
    }
  };

  const handleComplete = () => {
    if (selectedInterests.length >= 3 && selectedWilaya && selectedCity.trim() !== '') {
      setInterests(selectedInterests as EventCategory[]);
      updateProfile({ wilaya: selectedWilaya, city: selectedCity.trim() });
      completeOnboarding();
      router.push('/profile');
    }
  };

  const handleAddOther = () => {
    if (otherInterest.trim() && !selectedInterests.includes(otherInterest.trim())) {
      setSelectedInterests([...selectedInterests, otherInterest.trim()]);
      setOtherInterest('');
      setShowOtherInput(false);
    }
  };

  const isReady = selectedInterests.length >= 3 && selectedWilaya !== '' && selectedCity.trim() !== '';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10 animate-slide-down">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{tr.interests.title}</h1>
        <p className="text-[var(--color-subtext-0)] text-lg">{tr.interests.subtitle}</p>
      </div>

      <div className="glass p-6 md:p-8 rounded-3xl mb-8 animate-slide-up stagger-1">
        <div className="mb-6 flex items-center gap-2">
          <MapPin className="text-[var(--color-blue)]" />
          <h2 className="text-xl font-semibold">Où habitez-vous? / Where do you live?</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <select 
            value={selectedWilaya} 
            onChange={(e) => setSelectedWilaya(e.target.value)}
            className="input-field flex-1 bg-[var(--color-surface-1)] border-[var(--color-surface-2)]"
          >
            <option value="">Sélectionner une wilaya...</option>
            {WILAYAS.map(w => (
              <option key={w.code} value={w.name}>
                {w.code} - {lang === 'ar' ? w.nameAr : lang === 'fr' ? w.nameFr : w.name}
              </option>
            ))}
          </select>

          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedWilaya}
            className="input-field flex-1 bg-[var(--color-surface-1)] border-[var(--color-surface-2)] disabled:opacity-50"
          >
            <option value="">Sélectionner le code postal...</option>
            {availableCommunes.map((c: any) => (
              <option key={c.post_code} value={c.post_code}>
                {c.post_code} - {c.commune_name_ascii} ({c.post_name_ascii})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-24 animate-slide-up stagger-2">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-semibold">Vos centres d'intérêt</h2>
          <span className={`text-sm font-medium ${selectedInterests.length >= 3 ? 'text-[var(--color-green)]' : 'text-[var(--color-subtext-0)]'}`}>
            {selectedInterests.length} {tr.interests.selected}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isSelected = selectedInterests.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleInterest(category)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[var(--color-mauve)]/10 border-[var(--color-mauve)] text-[var(--color-mauve)] scale-105' 
                    : 'bg-[var(--color-surface-0)] border-[var(--color-surface-1)] text-[var(--color-text)] hover:bg-[var(--color-surface-1)] hover:border-[var(--color-surface-2)]'
                }`}
              >
                <span className="text-xl">{INTEREST_ICONS[category] || '📌'}</span>
                <span className="font-medium capitalize">{tr.categories[category as keyof typeof tr.categories] || category}</span>
                {isSelected && <Check size={16} className="ml-1" />}
              </button>
            );
          })}

          {/* Custom Interests added */}
          {selectedInterests.filter(i => !categories.includes(i as any)).map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-[var(--color-mauve)]/10 border-[var(--color-mauve)] text-[var(--color-mauve)] scale-105"
            >
              <span className="text-xl">✨</span>
              <span className="font-medium capitalize">{interest}</span>
              <Check size={16} className="ml-1" />
            </button>
          ))}

          {/* Other Button */}
          {!showOtherInput ? (
            <button
              onClick={() => setShowOtherInput(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 bg-[var(--color-surface-0)] border-[var(--color-surface-1)] text-[var(--color-text)] hover:bg-[var(--color-surface-1)] hover:border-[var(--color-surface-2)]"
            >
              <span className="text-xl">➕</span>
              <span className="font-medium">Autre (Other)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={otherInterest}
                onChange={(e) => setOtherInterest(e.target.value)}
                placeholder="Ajouter un intérêt..."
                className="input-field py-3 min-w-[200px]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddOther()}
                autoFocus
              />
              <button onClick={handleAddOther} className="btn-primary py-3">Ajouter</button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-[var(--color-surface-1)] z-40 animate-slide-up stagger-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-sm text-[var(--color-subtext-0)]">
            {selectedInterests.length < 3 ? `Sélectionnez encore ${3 - selectedInterests.length} intérêt(s)` : 
             !selectedWilaya ? "Veuillez sélectionner votre wilaya" : 
             !selectedCity.trim() ? "Veuillez entrer votre ville" : "Prêt à découvrir!"}
          </p>
          <button 
            onClick={handleComplete} 
            disabled={!isReady}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              isReady 
                ? 'bg-[var(--color-lavender)] text-[var(--color-crust)] hover:brightness-110 shadow-[0_0_15px_rgba(180,190,254,0.3)]' 
                : 'bg-[var(--color-surface-1)] text-[var(--color-overlay-0)] cursor-not-allowed'
            }`}
          >
            {tr.interests.continue} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
