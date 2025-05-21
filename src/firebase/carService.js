// src/firebase/carService.js
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';
import { uploadImage } from '../services/cloudinaryService';

const CARS_COLLECTION = 'cars';

// Get all cars
export const getCars = async () => {
  try {
    const carsQuery = query(collection(db, CARS_COLLECTION), orderBy('name'));
    const snapshot = await getDocs(carsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting cars:', error);
    throw error;
  }
};

// Get car by ID
export const getCarById = async (carId) => {
  try {
    const carDoc = await getDoc(doc(db, CARS_COLLECTION, carId));
    if (!carDoc.exists()) {
      throw new Error('Car not found');
    }
    return {
      id: carDoc.id,
      ...carDoc.data()
    };
  } catch (error) {
    console.error('Error getting car:', error);
    throw error;
  }
};

// Add a new car
export const addCar = async (carData, imageFile) => {
  try {
    // Upload the image to Cloudinary if provided
    let imageUrl = null;
    
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, 'cars');
    }
    
    // Add the car document with the image URL
    const docRef = await addDoc(collection(db, CARS_COLLECTION), {
      ...carData,
      imageUrl,
      createdAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...carData,
      imageUrl,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
};

// Update a car
export const updateCar = async (carId, carData, imageFile) => {
  try {
    const carRef = doc(db, CARS_COLLECTION, carId);
    const carDoc = await getDoc(carRef);
    
    if (!carDoc.exists()) {
      throw new Error('Car not found');
    }
    
    const currentData = carDoc.data();
    let imageUrl = currentData.imageUrl;
    
    // If a new image is provided, upload it to Cloudinary
    if (imageFile) {
      // We can't delete the old image with the free plan, but we can upload a new one
      imageUrl = await uploadImage(imageFile, 'cars');
    }
    
    // Update the car document
    const updatedData = {
      ...carData,
      imageUrl,
      updatedAt: new Date()
    };
    
    await updateDoc(carRef, updatedData);
    
    return {
      id: carId,
      ...updatedData
    };
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

// Delete a car
export const deleteCar = async (carId) => {
  try {
    const carRef = doc(db, CARS_COLLECTION, carId);
    const carDoc = await getDoc(carRef);
    
    if (!carDoc.exists()) {
      throw new Error('Car not found');
    }
    
    // Delete the car document
    await deleteDoc(carRef);
    
    return { id: carId };
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};