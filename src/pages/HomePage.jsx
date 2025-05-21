// src/pages/HomePage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import CarCard from '../components/cars/CarCard';
import { useCars } from '../hooks/useCars';

const HomePage = () => {
  const { cars, loading, error } = useCars();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-red-500">Error loading cars: {error}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
        <Link 
          to="/add-car" 
          className="btn btn-primary flex items-center space-x-1"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Car</span>
        </Link>
      </div>
      
      {cars.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Welcome to Car Service Tracker!</h2>
          <p className="text-gray-600 mb-4">
            You don't have any cars in your garage yet. Start by adding your first car.
          </p>
          <Link 
            to="/add-car" 
            className="btn btn-primary inline-flex items-center space-x-1"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Your First Car</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;