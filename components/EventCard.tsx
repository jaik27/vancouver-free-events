import Image from 'next/image';
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaCalendarAlt, FaExternalLinkAlt, FaTag } from 'react-icons/fa';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image_url: string;
    source_url: string;
    source_name: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const { title, description, date, location, image_url, source_url, source_name } = event;
  const eventDate = new Date(date);
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fade-in-up group">
      {/* Event Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
        <Image 
          src={image_url || '/images/default-event.jpg'} 
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-110"
        />
        {/* Free Event Badge */}
        <div className="absolute top-3 left-3 transform transition-transform duration-300 group-hover:scale-110">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-sm">
            <FaTag className="text-xs animate-pulse" />
            FREE
          </span>
        </div>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="p-6">
        {/* Event Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        
        {/* Date and Time */}
        <div className="flex items-center text-gray-600 mb-3 bg-blue-50 rounded-lg p-3 transition-colors duration-200 hover:bg-blue-100">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          <span className="font-medium">{format(eventDate, 'EEE, MMM d, yyyy • h:mm a')}</span>
        </div>
        
        {/* Location */}
        {location && (
          <div className="flex items-center text-gray-600 mb-4 transition-colors duration-200 hover:text-gray-800">
            <FaMapMarkerAlt className="mr-3 text-red-500 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">{description}</p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full transition-colors duration-200 hover:bg-gray-200">
              {source_name}
            </span>
          </div>
          <a 
            href={source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            View Details 
            <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
}