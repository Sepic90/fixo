// src/pages/TechnicalDataPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TechnicalDataForm from '../components/technical/TechnicalDataForm';
import BackButton from '../components/layout/BackButton';
import { useCars } from '../hooks/useCars';

const TechnicalDataPage = () => {
  const { carId } = useParams();
  const { fetchCarById, editCar } = useCars();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
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
  
  const handleSave = async (updatedData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log('Updating car with data:', updatedData);
      
      // Since we're only updating technical data, we don't need to handle image upload
      const result = await editCar(carId, updatedData);
      
      if (result) {
        console.log('Car updated successfully:', result);
        setCar(result);
        setSuccessMessage('Technical data saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating car:', err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p className="ml-2 text-gray-600">Loading car data...</p>
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
      <BackButton />
      
      <div className="mb-6 relative">
        {car.imageUrl && (
          <div className="h-48 rounded-t-lg overflow-hidden">
            <img 
              src={car.imageUrl} 
              alt={car.name} 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-600/50 to-secondary-600/70 rounded-t-lg"></div>
          </div>
        )}
        
        <div className={`px-4 py-5 sm:px-6 ${car.imageUrl ? 'absolute inset-x-0 bottom-0 text-white' : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-t-lg'}`}>
          <h2 className="text-xl font-medium">Technical Data</h2>
          <p className="mt-1 text-sm opacity-90">
            {car.name} - {car.description}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <TechnicalDataForm 
        car={car}
        onSave={handleSave}
        isLoading={saving}
      />
    </div>
  );
};

export default TechnicalDataPage;