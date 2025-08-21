"use client";

import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

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
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [searchParams]);
  
  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl text-gray-500">No events found</h3>
        <p className="mt-4">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}