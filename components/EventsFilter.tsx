"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FaCalendarAlt, FaClock, FaFilter } from 'react-icons/fa';

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

  const filterOptions = [
    { value: 'upcoming', label: 'All Upcoming', icon: FaClock },
    { value: 'today', label: 'Today', icon: FaCalendarAlt },
    { value: 'tomorrow', label: 'Tomorrow', icon: FaCalendarAlt },
    { value: 'weekend', label: 'This Weekend', icon: FaCalendarAlt },
    { value: 'week', label: 'This Week', icon: FaCalendarAlt },
  ];
  
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-blue-600" />
        <h2 className="font-semibold text-gray-800">Filter Events</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {filterOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleDateFilterChange(value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentDateFilter === value 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
            disabled={isPending}
          >
            <Icon className="text-sm" />
            {label}
          </button>
        ))}
      </div>
      
      {isPending && (
        <div className="flex items-center gap-2 mt-4 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Updating events...
        </div>
      )}
    </div>
  );
}