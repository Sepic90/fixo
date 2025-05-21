// src/hooks/useServiceEntries.js
import { useState, useEffect } from 'react';
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

  const fetchServiceEntries = async () => {
    if (!carId) return;
    
    try {
      setLoading(true);
      const entriesData = await getServiceEntriesForCar(carId);
      setServiceEntries(entriesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchServiceEntries();
    }
  }, [carId]);

  const fetchServiceEntryById = async (serviceId) => {
    try {
      setLoading(true);
      const entry = await getServiceEntryById(serviceId);
      setError(null);
      return entry;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createServiceEntry = async (serviceData, imageFiles) => {
    try {
      setLoading(true);
      const newEntry = await addServiceEntry(serviceData, imageFiles);
      setServiceEntries(prevEntries => [newEntry, ...prevEntries]);
      setError(null);
      return newEntry;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editServiceEntry = async (serviceId, serviceData, imageFiles) => {
    try {
      setLoading(true);
      const updatedEntry = await updateServiceEntry(serviceId, serviceData, imageFiles);
      setServiceEntries(prevEntries => 
        prevEntries.map(entry => entry.id === serviceId ? updatedEntry : entry)
      );
      setError(null);
      return updatedEntry;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeServiceEntry = async (serviceId) => {
    try {
      setLoading(true);
      await deleteServiceEntry(serviceId);
      setServiceEntries(prevEntries => 
        prevEntries.filter(entry => entry.id !== serviceId)
      );
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeServiceEntryImage = async (serviceId, imageUrl) => {
    try {
      setLoading(true);
      const result = await deleteServiceEntryImage(serviceId, imageUrl);
      
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