'use client';
import Navbar from '@/components/Navbar';
import LandingView from '@/views/LandingView';

export default function RootPage() {
  return (
    <div className="relative min-h-screen pb-16 md:pb-0 pt-14 md:pt-16 overflow-hidden">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
        <LandingView />
      </main>
    </div>
  );
}
