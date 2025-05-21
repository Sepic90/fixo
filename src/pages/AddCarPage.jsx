// src/pages/AddCarPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarForm from '../components/cars/CarForm';
import BackButton from '../components/layout/BackButton';
import { useCars } from '../hooks/useCars';

const AddCarPage = () => {
  const navigate = useNavigate();
  const { createCar } = useCars();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (carData, imageFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCar = await createCar(carData, imageFile);
      
      if (newCar) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <BackButton />
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-primary-500">
          <h2 className="text-xl font-medium text-white">Add New Car</h2>
          <p className="mt-1 text-sm text-white opacity-90">
            Enter your car's details to add it to your garage.
          </p>
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
          <CarForm 
            onSubmit={handleSubmit} 
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;