"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { FaCalendarAlt, FaClock, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

export default function EventsFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Get current filter values
  const currentDateFilter = searchParams.get('date') || 'upcoming';
  
  const handleDateFilterChange = (value: string) => {
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    
    if (value.trim() === '') {
      params.delete('search');
    } else {
      params.set('search', value.trim());
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    handleSearchChange('');
  };

  const filterOptions = [
    { value: 'upcoming', label: 'All Upcoming', icon: FaClock },
    { value: 'today', label: 'Today', icon: FaCalendarAlt },
    { value: 'tomorrow', label: 'Tomorrow', icon: FaCalendarAlt },
    { value: 'weekend', label: 'This Weekend', icon: FaCalendarAlt },
    { value: 'week', label: 'This Week', icon: FaCalendarAlt },
  ];
  
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-6 rounded-xl animate-fade-in-up">
      {/* Search Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaSearch className="text-green-600" />
          <h3 className="font-semibold text-gray-800">Search Events</h3>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, location, or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            disabled={isPending}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isPending}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Date Filters Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filter by Date</h3>
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