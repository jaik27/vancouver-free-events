import Image from 'next/image';
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

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
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={image_url || '/images/default-event.jpg'} 
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2" />
          <span>{format(eventDate, 'EEE, MMM d, yyyy • h:mm a')}</span>
        </div>
        
        {location && (
          <div className="flex items-center text-gray-600 mb-3">
            <FaMapMarkerAlt className="mr-2" />
            <span>{location}</span>
          </div>
        )}
        
        <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Source: {source_name}</span>
          <a 
            href={source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View Details <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
}