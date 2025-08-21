import { Suspense } from 'react';
import EventList from '@/components/EventList';
import EventsFilter from '@/components/EventsFilter';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">Vancouver Free Events</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Discover free events happening around Vancouver
      </p>
      
      <Suspense fallback={<div className="bg-gray-50 p-4 rounded-lg mb-6">Loading filters...</div>}>
        <EventsFilter />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <EventList />
      </Suspense>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Data scraped weekly from various Vancouver event sources.</p>
        <p className="mt-2">© {new Date().getFullYear()} Vancouver Free Events Tracker</p>
      </footer>
    </main>
  );
}