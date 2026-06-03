'use client';
import SignupView from '@/views/SignupView';
import Navbar from '@/components/Navbar';

export default function SignupPage() {
  return (
    <div className="min-h-screen pb-16 md:pb-0 pt-14 md:pt-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
        <SignupView />
      </main>
    </div>
  );
}
