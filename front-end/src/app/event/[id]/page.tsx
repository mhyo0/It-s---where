'use client';
import EventDetailsView from '@/views/EventDetailsView';
import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation';

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;

  return (
    <div className="min-h-screen pb-16 md:pb-0 pt-14 md:pt-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
        <EventDetailsView eventId={eventId} />
      </main>
    </div>
  );
}
