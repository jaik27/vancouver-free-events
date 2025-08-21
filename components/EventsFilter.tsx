"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function EventsFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Get current filter values
  const currentDateFilter = searchParams.get('date') || 'upcoming';
  
  const handleDateFilterChange = (value: string) => {
    // Fix: Convert ReadonlyURLSearchParams to string before creating new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'upcoming') {
      params.delete('date');
    } else {
      params.set('date', value);
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h2 className="font-semibold mb-3">Filter Events</h2>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleDateFilterChange('upcoming')}
          className={`px-3 py-1 rounded-full ${
            currentDateFilter === 'upcoming' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
          disabled={isPending}
        >
          Upcoming
        </button>
        <button
          onClick={() => handleDateFilterChange('today')}
          className={`px-3 py-1 rounded-full ${
            currentDateFilter === 'today' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
          disabled={isPending}
        >
          Today
        </button>
        <button
          onClick={() => handleDateFilterChange('tomorrow')}
          className={`px-3 py-1 rounded-full ${
            currentDateFilter === 'tomorrow' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
          disabled={isPending}
        >
          Tomorrow
        </button>
        <button
          onClick={() => handleDateFilterChange('weekend')}
          className={`px-3 py-1 rounded-full ${
            currentDateFilter === 'weekend' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
          disabled={isPending}
        >
          This Weekend
        </button>
        <button
          onClick={() => handleDateFilterChange('week')}
          className={`px-3 py-1 rounded-full ${
            currentDateFilter === 'week' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
          disabled={isPending}
        >
          This Week
        </button>
      </div>
      
      {isPending && <p className="text-sm text-gray-500 mt-2">Updating...</p>}
    </div>
  );
}