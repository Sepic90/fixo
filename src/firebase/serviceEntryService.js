// src/firebase/serviceEntryService.js
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

const SERVICES_COLLECTION = 'serviceEntries';

// Get all service entries for a car
export const getServiceEntriesForCar = async (carId) => {
  try {
    const servicesQuery = query(
      collection(db, SERVICES_COLLECTION),
      where('carId', '==', carId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(servicesQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate() // Convert Firestore timestamp to JS Date
    }));
  } catch (error) {
    console.error('Error getting service entries:', error);
    throw error;
  }
};

// Get a service entry by ID
export const getServiceEntryById = async (serviceId) => {
  try {
    const serviceDoc = await getDoc(doc(db, SERVICES_COLLECTION, serviceId));
    
    if (!serviceDoc.exists()) {
      throw new Error('Service entry not found');
    }
    
    const data = serviceDoc.data();
    
    return {
      id: serviceDoc.id,
      ...data,
      date: data.date.toDate() // Convert Firestore timestamp to JS Date
    };
  } catch (error) {
    console.error('Error getting service entry:', error);
    throw error;
  }
};

// Add a new service entry
export const addServiceEntry = async (serviceData, imageFiles = []) => {
  try {
    // Upload images if provided
    const imageUrls = [];
    
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const storageRef = ref(storage, `services/${serviceData.carId}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(imageUrl);
      }
    }
    
    // Add the service entry document
    const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
      ...serviceData,
      imageUrls,
      createdAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...serviceData,
      imageUrls,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error adding service entry:', error);
    throw error;
  }
};

// Update a service entry
export const updateServiceEntry = async (serviceId, serviceData, imageFiles = []) => {
  try {
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      throw new Error('Service entry not found');
    }
    
    const currentData = serviceDoc.data();
    const imageUrls = [...(currentData.imageUrls || [])];
    
    // Upload new images if provided
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const storageRef = ref(storage, `services/${serviceData.carId}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(imageUrl);
      }
    }
    
    // Update the service entry document
    const updatedData = {
      ...serviceData,
      imageUrls,
      updatedAt: new Date()
    };
    
    await updateDoc(serviceRef, updatedData);
    
    return {
      id: serviceId,
      ...updatedData
    };
  } catch (error) {
    console.error('Error updating service entry:', error);
    throw error;
  }
};

// Delete a service entry
export const deleteServiceEntry = async (serviceId) => {
  try {
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      throw new Error('Service entry not found');
    }
    
    const serviceData = serviceDoc.data();
    
    // Delete images if they exist
    if (serviceData.imageUrls && serviceData.imageUrls.length > 0) {
      for (const imageUrl of serviceData.imageUrls) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn('Could not delete image:', err);
        }
      }
    }
    
    // Delete the service entry document
    await deleteDoc(serviceRef);
    
    return { id: serviceId };
  } catch (error) {
    console.error('Error deleting service entry:', error);
    throw error;
  }
};

// Delete a specific image from a service entry
export const deleteServiceEntryImage = async (serviceId, imageUrl) => {
  try {
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      throw new Error('Service entry not found');
    }
    
    const serviceData = serviceDoc.data();
    
    // Check if the image exists in the service entry
    if (!serviceData.imageUrls || !serviceData.imageUrls.includes(imageUrl)) {
      throw new Error('Image not found in service entry');
    }
    
    // Delete the image from storage
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (err) {
      console.warn('Could not delete image from storage:', err);
    }
    
    // Update the service entry document to remove the image URL
    const updatedImageUrls = serviceData.imageUrls.filter(url => url !== imageUrl);
    
    await updateDoc(serviceRef, {
      imageUrls: updatedImageUrls,
      updatedAt: new Date()
    });
    
    return {
      id: serviceId,
      imageUrls: updatedImageUrls
    };
  } catch (error) {
    console.error('Error deleting service entry image:', error);
    throw error;
  }
};