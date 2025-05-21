// src/hooks/useCars.js
import { useState, useEffect } from 'react';
import { getCars, getCarById, addCar, updateCar, deleteCar } from '../firebase/carService';

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const carsData = await getCars();
      setCars(carsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCarById = async (carId) => {
    try {
      setLoading(true);
      const car = await getCarById(carId);
      setError(null);
      return car;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCar = async (carData, imageFile) => {
    try {
      setLoading(true);
      const newCar = await addCar(carData, imageFile);
      setCars(prevCars => [...prevCars, newCar]);
      setError(null);
      return newCar;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editCar = async (carId, carData, imageFile) => {
    try {
      setLoading(true);
      const updatedCar = await updateCar(carId, carData, imageFile);
      setCars(prevCars => 
        prevCars.map(car => car.id === carId ? updatedCar : car)
      );
      setError(null);
      return updatedCar;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCar = async (carId) => {
    try {
      setLoading(true);
      await deleteCar(carId);
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      setError(null);
      return { success: true };
    } catch (err) {
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