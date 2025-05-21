// src/pages/ServiceEntryPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceEntryForm from '../components/services/ServiceEntryForm';
import BackButton from '../components/layout/BackButton';
import { useCars } from '../hooks/useCars';
import { useServiceEntries } from '../hooks/useServiceEntries';

const ServiceEntryPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { fetchCarById } = useCars();
  const { createServiceEntry } = useServiceEntries(carId);
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  
  // Fetch car details
  useEffect(() => {
    const loadCar = async () => {
      console.log('Loading car with ID:', carId);
      try {
        setCarLoading(true);
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
        setCarLoading(false);
      }
    };
    
    loadCar();
  }, [carId, fetchCarById]);
  
  const handleSubmit = async (serviceData, imageFiles) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Submitting service data:', serviceData);
      const newService = await createServiceEntry(serviceData, imageFiles);
      console.log('New service created:', newService);
      
      if (newService) {
        navigate(`/car/${carId}/service/history`);
      }
    } catch (err) {
      console.error('Error creating service entry:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (carLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p className="ml-2 text-gray-600">Loading car...</p>
      </div>
    );
  }
  
  if (error && !car) {
    return (
      <div>
        <BackButton to={`/`} label="Back to Cars" />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">Error: {error}</span>
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
      <BackButton to={`/car/${carId}/service/history`} label="Back to Service History" />
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative">
          {car.imageUrl && (
            <div className="h-48 overflow-hidden">
              <img 
                src={car.imageUrl} 
                alt={car.name} 
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-600/80 to-secondary-600/80"></div>
            </div>
          )}
          
          <div className={`px-4 py-5 sm:px-6 ${car.imageUrl ? 'absolute inset-x-0 bottom-0 text-white' : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'}`}>
            <h2 className="text-xl font-medium">New Service Entry</h2>
            <p className="mt-1 text-sm opacity-90">
              {car.name} - {car.description}
            </p>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="px-4 py-5 sm:p-6">
          <ServiceEntryForm 
            onSubmit={handleSubmit} 
            isLoading={loading}
            carId={carId}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceEntryPage;