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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

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
    // Upload the image first if provided
    let imageUrl = null;
    
    if (imageFile) {
      const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
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
    
    // If a new image is provided, upload it and update the URL
    if (imageFile) {
      // Delete the old image if it exists
      if (currentData.imageUrl) {
        try {
          const oldImageRef = ref(storage, currentData.imageUrl);
          await deleteObject(oldImageRef);
        } catch (err) {
          console.warn('Could not delete old image:', err);
        }
      }
      
      // Upload the new image
      const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
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
    
    const carData = carDoc.data();
    
    // Delete the image if it exists
    if (carData.imageUrl) {
      try {
        const imageRef = ref(storage, carData.imageUrl);
        await deleteObject(imageRef);
      } catch (err) {
        console.warn('Could not delete image:', err);
      }
    }
    
    // Delete the car document
    await deleteDoc(carRef);
    
    return { id: carId };
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};