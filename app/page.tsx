import { Suspense } from 'react';
import EventList from '@/components/EventList';
import EventsFilter from '@/components/EventsFilter';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Vancouver Free Events
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2 font-light">
            Discover amazing free events happening around Vancouver
          </p>
          <p className="text-blue-200 text-sm">
            🎉 Updated weekly with the latest events from across the city
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="mb-8">
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-6 rounded-xl mb-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="flex gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <EventsFilter />
          </Suspense>
        </div>
        
        {/* Events Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <EventList />
        </Suspense>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 mb-2">
            Data sourced from Vancouver&apos;s top event websites and updated weekly
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Vancouver Free Events Tracker • Made with ❤️ for Vancouverites
          </p>
        </div>
      </footer>
    </div>
  );
}