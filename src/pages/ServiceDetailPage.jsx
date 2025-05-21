// src/pages/ServiceDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import ServiceDetailView from '../components/services/ServiceDetailView';
import BackButton from '../components/layout/BackButton';
import { useCars } from '../hooks/useCars';
import { useServiceEntries } from '../hooks/useServiceEntries';

const ServiceDetailPage = () => {
  const { carId, serviceId } = useParams();
  const navigate = useNavigate();
  const { fetchCarById } = useCars();
  const { 
    fetchServiceEntryById, 
    removeServiceEntry, 
    removeServiceEntryImage 
  } = useServiceEntries(carId);
  
  const [car, setCar] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Fetch car and service details
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load car details
        const carData = await fetchCarById(carId);
        if (!carData) {
          throw new Error('Car not found');
        }
        setCar(carData);
        
        // Load service entry details
        const serviceData = await fetchServiceEntryById(serviceId);
        if (!serviceData) {
          throw new Error('Service entry not found');
        }
        setService(serviceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [carId, serviceId, fetchCarById, fetchServiceEntryById]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service entry? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      const result = await removeServiceEntry(serviceId);
      
      if (result.success) {
        navigate(`/car/${carId}/service/history`);
      } else {
        throw new Error(result.error || 'Failed to delete service entry');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleDeleteImage = async (imageUrl) => {
    try {
      const result = await removeServiceEntryImage(serviceId, imageUrl);
      
      if (result.success) {
        // Update the local state to reflect the deleted image
        setService(prev => ({
          ...prev,
          imageUrls: prev.imageUrls.filter(url => url !== imageUrl)
        }));
      } else {
        throw new Error(result.error || 'Failed to delete image');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
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
            <span className="text-red-500">{error}</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!car || !service) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-red-500">Data not found</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <BackButton to={`/car/${carId}/service/history`} label="Back to Service History" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Service Details</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/car/${carId}/service/edit/${serviceId}`)}
            className="btn btn-outline flex items-center space-x-1"
            title="Edit Service Entry"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          
          <button 
            onClick={handleDelete}
            className="btn bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1"
            disabled={deleteLoading}
            title="Delete Service Entry"
          >
            <TrashIcon className="h-5 w-5" />
            <span className="hidden sm:inline">{deleteLoading ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
      
      <ServiceDetailView 
        service={service}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
};

export default ServiceDetailPage;