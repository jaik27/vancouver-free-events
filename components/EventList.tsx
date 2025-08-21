"use client";

import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { FaCalendarTimes, FaSearch, FaInfoCircle } from 'react-icons/fa';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  source_url: string;
  source_name: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      const queryString = searchParams.toString();
      try {
        const response = await fetch(`/api/events${queryString ? `?${queryString}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Unable to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [searchParams]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading amazing free events...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-8">
          <FaInfoCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
            <FaCalendarTimes className="text-blue-400 text-6xl mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No events found</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We couldn&apos;t find any free events matching your criteria. Try adjusting your filters or check back later for new events!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              <FaSearch />
              <span>Events are updated weekly from Vancouver&apos;s top sources</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section>
      {/* Events Count */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Found <span className="font-semibold text-blue-600">{events.length}</span> amazing free events for you!
        </p>
      </div>
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}