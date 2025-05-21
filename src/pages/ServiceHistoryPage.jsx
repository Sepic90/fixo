// src/pages/ServiceHistoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import ServiceHistoryList from '../components/services/ServiceHistoryList';
import BackButton from '../components/layout/BackButton';
import { useCars } from '../hooks/useCars';
import { useServiceEntries } from '../hooks/useServiceEntries';

const ServiceHistoryPage = () => {
  const { carId } = useParams();
  const { fetchCarById } = useCars();
  const { serviceEntries, loading: entriesLoading, error: entriesError } = useServiceEntries(carId);
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch car details
  useEffect(() => {
    const loadCar = async () => {
      console.log('Loading car with ID:', carId);
      try {
        setLoading(true);
        const carData = await fetchCarById(carId);
        console.log('Car data returned:', carData);
        
        if (!carData) {
          console.error('Car not found for ID:', carId);
          throw new Error('Car not found');
        }
        
        setCar(carData);
      } catch (err) {
        console.error('Error loading car:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadCar();
  }, [carId, fetchCarById]);
  
  if (loading || entriesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p className="ml-2 text-gray-600">
          {loading ? 'Loading car information...' : 'Loading service entries...'}
        </p>
      </div>
    );
  }
  
  if (error || entriesError) {
    return (
      <div>
        <BackButton to={`/`} label="Back to Cars" />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">Error: {error || entriesError}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!car) {
    return (
      <div>
        <BackButton to={`/`} label="Back to Cars" />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">Car not found</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <BackButton />
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="relative">
          {car.imageUrl && (
            <div className="h-48 overflow-hidden">
              <img 
                src={car.imageUrl} 
                alt={car.name} 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-600/50 to-secondary-600/70"></div>
            </div>
          )}
          
          <div className={`px-4 py-5 sm:px-6 ${car.imageUrl ? 'absolute inset-x-0 bottom-0 text-white' : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'}`}>
            <h2 className="text-xl font-medium">Service History</h2>
            <p className="mt-1 text-sm opacity-90">
              {car.name} - {car.description}
            </p>
          </div>
        </div>
        
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Total Service Entries: <span className="font-bold">{serviceEntries ? serviceEntries.length : 0}</span>
            </p>
            <Link
              to={`/car/${carId}/service/new`}
              className="btn btn-primary flex items-center space-x-1 text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Service Entry</span>
            </Link>
          </div>
        </div>
        
        <div>
          <ServiceHistoryList 
            serviceEntries={serviceEntries || []} 
            carId={carId} 
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceHistoryPage;