// src/components/cars/CarCard.jsx
import { Link } from 'react-router-dom';
import { WrenchIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const CarCard = ({ car }) => {
  return (
    <div className="card">
      <div className="relative h-48 overflow-hidden">
        {car.imageUrl ? (
          <img 
            src={car.imageUrl} 
            alt={car.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{car.name}</h2>
        <p className="text-gray-600 mb-4">{car.description}</p>
        
        <div className="grid grid-cols-3 gap-2">
          <Link 
            to={`/car/${car.id}/service/new`}
            className="btn btn-primary flex items-center justify-center"
          >
            <WrenchIcon className="h-5 w-5 mr-1" />
            <span>New Service</span>
          </Link>
          
          <Link 
            to={`/car/${car.id}/service/history`}
            className="btn btn-secondary flex items-center justify-center"
          >
            <ClockIcon className="h-5 w-5 mr-1" />
            <span>History</span>
          </Link>
          
          <Link 
            to={`/car/${car.id}/technical`}
            className="btn btn-outline flex items-center justify-center"
          >
            <InformationCircleIcon className="h-5 w-5 mr-1" />
            <span>Tech Data</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;