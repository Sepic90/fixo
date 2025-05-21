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
import { db } from './config';
import { uploadImage } from '../services/cloudinaryService';

const SERVICES_COLLECTION = 'serviceEntries';

// Get all service entries for a car
export const getServiceEntriesForCar = async (carId) => {
  try {
    console.log(`Getting service entries for car ID: ${carId}`);
    const servicesQuery = query(
      collection(db, SERVICES_COLLECTION),
      where('carId', '==', carId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(servicesQuery);
    console.log(`Found ${snapshot.docs.length} service entries`);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // Make sure date is properly converted
      const dateValue = data.date ? 
        (typeof data.date.toDate === 'function' ? data.date.toDate() : new Date(data.date)) : 
        new Date();
      
      return {
        id: doc.id,
        ...data,
        date: dateValue
      };
    });
  } catch (error) {
    console.error('Error getting service entries:', error);
    throw error;
  }
};

// Get a service entry by ID
export const getServiceEntryById = async (serviceId) => {
  try {
    console.log(`Getting service entry with ID: ${serviceId}`);
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      console.error(`Service entry with ID ${serviceId} not found`);
      throw new Error('Service entry not found');
    }
    
    const data = serviceDoc.data();
    console.log('Raw service data:', data);
    
    // Handle date conversion more robustly
    let dateValue = new Date();
    if (data.date) {
      try {
        dateValue = typeof data.date.toDate === 'function' ? 
          data.date.toDate() : 
          new Date(data.date);
      } catch (dateError) {
        console.error('Error converting date:', dateError);
      }
    }
    
    const result = {
      id: serviceDoc.id,
      ...data,
      date: dateValue
    };
    
    console.log('Processed service data:', result);
    return result;
  } catch (error) {
    console.error('Error getting service entry:', error);
    throw error;
  }
};

// Add a new service entry
export const addServiceEntry = async (serviceData, imageFiles = []) => {
  try {
    console.log('Adding new service entry:', serviceData);
    // Upload images to Cloudinary if provided
    const imageUrls = [];
    
    if (imageFiles && imageFiles.length > 0) {
      console.log(`Uploading ${imageFiles.length} images`);
      for (const imageFile of imageFiles) {
        const imageUrl = await uploadImage(imageFile, `services/${serviceData.carId}`);
        console.log('Image uploaded:', imageUrl);
        imageUrls.push(imageUrl);
      }
    }
    
    // Add the service entry document
    const dataToSave = {
      ...serviceData,
      imageUrls,
      createdAt: new Date()
    };
    
    console.log('Data to save:', dataToSave);
    const docRef = await addDoc(collection(db, SERVICES_COLLECTION), dataToSave);
    console.log('Service entry added with ID:', docRef.id);
    
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
    console.log(`Updating service entry with ID: ${serviceId}`);
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      console.error(`Service entry with ID ${serviceId} not found for update`);
      throw new Error('Service entry not found');
    }
    
    const currentData = serviceDoc.data();
    const imageUrls = [...(currentData.imageUrls || [])];
    
    // Upload new images to Cloudinary if provided
    if (imageFiles && imageFiles.length > 0) {
      console.log(`Uploading ${imageFiles.length} new images`);
      for (const imageFile of imageFiles) {
        const imageUrl = await uploadImage(imageFile, `services/${serviceData.carId}`);
        console.log('New image uploaded:', imageUrl);
        imageUrls.push(imageUrl);
      }
    }
    
    // Update the service entry document
    const updatedData = {
      ...serviceData,
      imageUrls,
      updatedAt: new Date()
    };
    
    console.log('Updated data to save:', updatedData);
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
    console.log(`Deleting service entry with ID: ${serviceId}`);
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      console.error(`Service entry with ID ${serviceId} not found for deletion`);
      throw new Error('Service entry not found');
    }
    
    await deleteDoc(serviceRef);
    console.log(`Service entry ${serviceId} deleted successfully`);
    return { id: serviceId };
  } catch (error) {
    console.error('Error deleting service entry:', error);
    throw error;
  }
};

// Remove a specific image from a service entry
export const deleteServiceEntryImage = async (serviceId, imageUrl) => {
  try {
    console.log(`Removing image from service entry ${serviceId}:`, imageUrl);
    const serviceRef = doc(db, SERVICES_COLLECTION, serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      console.error(`Service entry with ID ${serviceId} not found for image deletion`);
      throw new Error('Service entry not found');
    }
    
    const serviceData = serviceDoc.data();
    
    // Check if the image exists in the service entry
    if (!serviceData.imageUrls || !serviceData.imageUrls.includes(imageUrl)) {
      console.error('Image not found in service entry');
      throw new Error('Image not found in service entry');
    }
    
    // Update the service entry document to remove the image URL
    const updatedImageUrls = serviceData.imageUrls.filter(url => url !== imageUrl);
    
    await updateDoc(serviceRef, {
      imageUrls: updatedImageUrls,
      updatedAt: new Date()
    });
    
    console.log(`Image removed successfully, remaining images: ${updatedImageUrls.length}`);
    return {
      id: serviceId,
      imageUrls: updatedImageUrls
    };
  } catch (error) {
    console.error('Error deleting service entry image:', error);
    throw error;
  }
};