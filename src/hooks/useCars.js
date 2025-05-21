// src/hooks/useCars.js
import { useState, useEffect, useCallback } from 'react';
import { getCars, getCarById, addCar, updateCar, deleteCar } from '../firebase/carService';

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching all cars...');
      const carsData = await getCars();
      console.log('Fetched cars:', carsData);
      setCars(carsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const fetchCarById = useCallback(async (carId) => {
    console.log('Fetching car by ID:', carId);
    try {
      setLoading(true);
      const car = await getCarById(carId);
      console.log('Fetched car:', car);
      setError(null);
      return car;
    } catch (err) {
      console.error('Error fetching car by ID:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCar = async (carData, imageFile) => {
    try {
      setLoading(true);
      console.log('Creating new car with data:', carData);
      const newCar = await addCar(carData, imageFile);
      console.log('New car created:', newCar);
      setCars(prevCars => [...prevCars, newCar]);
      setError(null);
      return newCar;
    } catch (err) {
      console.error('Error creating car:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editCar = async (carId, carData, imageFile) => {
    try {
      setLoading(true);
      console.log('Updating car with ID:', carId, 'Data:', carData);
      const updatedCar = await updateCar(carId, carData, imageFile);
      console.log('Car updated:', updatedCar);
      setCars(prevCars => 
        prevCars.map(car => car.id === carId ? updatedCar : car)
      );
      setError(null);
      return updatedCar;
    } catch (err) {
      console.error('Error updating car:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCar = async (carId) => {
    try {
      setLoading(true);
      console.log('Removing car with ID:', carId);
      await deleteCar(carId);
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error removing car:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    cars,
    loading,
    error,
    fetchCars,
    fetchCarById,
    createCar,
    editCar,
    removeCar
  };
};