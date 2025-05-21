// src/hooks/useServiceEntries.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getServiceEntriesForCar, 
  getServiceEntryById, 
  addServiceEntry, 
  updateServiceEntry, 
  deleteServiceEntry,
  deleteServiceEntryImage
} from '../firebase/serviceEntryService';

export const useServiceEntries = (carId = null) => {
  const [serviceEntries, setServiceEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceEntries = useCallback(async () => {
    if (!carId) return;
    
    try {
      setLoading(true);
      console.log('Fetching service entries for car:', carId);
      const entriesData = await getServiceEntriesForCar(carId);
      console.log('Fetched service entries:', entriesData);
      setServiceEntries(entriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching service entries:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    if (carId) {
      fetchServiceEntries();
    } else {
      setLoading(false);
    }
  }, [carId, fetchServiceEntries]);

  const fetchServiceEntryById = async (serviceId) => {
    try {
      setLoading(true);
      console.log('Fetching service entry by ID:', serviceId);
      const entry = await getServiceEntryById(serviceId);
      console.log('Fetched service entry:', entry);
      setError(null);
      return entry;
    } catch (err) {
      console.error('Error fetching service entry:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createServiceEntry = async (serviceData, imageFiles) => {
    try {
      setLoading(true);
      console.log('Creating service entry with data:', serviceData);
      const newEntry = await addServiceEntry(serviceData, imageFiles);
      console.log('New service entry created:', newEntry);
      setServiceEntries(prevEntries => [newEntry, ...prevEntries]);
      setError(null);
      return newEntry;
    } catch (err) {
      console.error('Error creating service entry:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editServiceEntry = async (serviceId, serviceData, imageFiles) => {
    try {
      setLoading(true);
      console.log('Updating service entry with ID:', serviceId, 'Data:', serviceData);
      const updatedEntry = await updateServiceEntry(serviceId, serviceData, imageFiles);
      console.log('Service entry updated:', updatedEntry);
      setServiceEntries(prevEntries => 
        prevEntries.map(entry => entry.id === serviceId ? updatedEntry : entry)
      );
      setError(null);
      return updatedEntry;
    } catch (err) {
      console.error('Error updating service entry:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeServiceEntry = async (serviceId) => {
    try {
      setLoading(true);
      console.log('Removing service entry with ID:', serviceId);
      await deleteServiceEntry(serviceId);
      setServiceEntries(prevEntries => 
        prevEntries.filter(entry => entry.id !== serviceId)
      );
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error removing service entry:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeServiceEntryImage = async (serviceId, imageUrl) => {
    try {
      setLoading(true);
      console.log('Removing image from service entry:', serviceId, 'Image URL:', imageUrl);
      const result = await deleteServiceEntryImage(serviceId, imageUrl);
      console.log('Image removal result:', result);
      
      // Update the service entry in the local state
      setServiceEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === serviceId 
            ? { ...entry, imageUrls: result.imageUrls }
            : entry
        )
      );
      
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error removing service entry image:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    serviceEntries,
    loading,
    error,
    fetchServiceEntries,
    fetchServiceEntryById,
    createServiceEntry,
    editServiceEntry,
    removeServiceEntry,
    removeServiceEntryImage
  };
};