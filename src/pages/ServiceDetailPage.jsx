// src/pages/ServiceDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import ServiceDetailView from '../components/services/ServiceDetailView';
import BackButton from '../components/layout/BackButton';
import { useCars } from '../hooks/useCars';
import { getServiceEntryById, deleteServiceEntry, deleteServiceEntryImage } from '../firebase/serviceEntryService';

const ServiceDetailPage = () => {
  const { carId, serviceId } = useParams();
  const navigate = useNavigate();
  const { fetchCarById } = useCars();
  
  const [car, setCar] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Fetch car and service details
  useEffect(() => {
    const loadData = async () => {
      console.log('Loading service details for car ID:', carId, 'service ID:', serviceId);
      try {
        setLoading(true);
        
        // Load car details
        console.log('Fetching car data...');
        const carData = await fetchCarById(carId);
        console.log('Car data returned:', carData);
        
        if (!carData) {
          console.error('Car not found for ID:', carId);
          throw new Error('Car not found');
        }
        setCar(carData);
        
        // Load service entry details - using direct import instead of hook
        console.log('Fetching service entry data...');
        try {
          const serviceData = await getServiceEntryById(serviceId);
          console.log('Service data returned:', serviceData);
          
          if (!serviceData) {
            console.error('Service entry not found for ID:', serviceId);
            throw new Error('Service entry not found');
          }
          setService(serviceData);
        } catch (serviceError) {
          console.error('Error fetching service:', serviceError);
          throw serviceError;
        }
      } catch (err) {
        console.error('Error loading data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [carId, serviceId, fetchCarById]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service entry? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      console.log('Deleting service entry:', serviceId);
      await deleteServiceEntry(serviceId);
      console.log('Service entry deleted successfully');
      navigate(`/car/${carId}/service/history`);
    } catch (err) {
      console.error('Error deleting service entry:', err.message);
      setError(err.message);
      setDeleteLoading(false);
    }
  };
  
  const handleDeleteImage = async (imageUrl) => {
    try {
      console.log('Deleting image:', imageUrl, 'from service:', serviceId);
      const result = await deleteServiceEntryImage(serviceId, imageUrl);
      console.log('Image delete result:', result);
      
      // Update the local state to reflect the deleted image
      setService(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter(url => url !== imageUrl)
      }));
    } catch (err) {
      console.error('Error deleting image:', err.message);
      setError(err.message);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-2"></div>
        <p className="text-gray-600">Loading service details...</p>
        <p className="text-sm text-gray-500">Car ID: {carId}, Service ID: {serviceId}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <BackButton to={`/car/${carId}/service/history`} label="Back to Service History" />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex flex-col">
            <span className="text-red-700 font-medium">Error loading service details</span>
            <span className="text-red-500">{error}</span>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 btn btn-outline text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!car || !service) {
    return (
      <div>
        <BackButton to={`/car/${carId}/service/history`} label="Back to Service History" />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex flex-col">
            <span className="text-red-700 font-medium">
              {!car ? 'Car not found' : 'Service entry not found'}
            </span>
            <span className="text-red-500">
              The requested {!car ? 'car' : 'service entry'} could not be found in the database.
            </span>
            <div className="mt-2">
              <button 
                onClick={() => navigate(`/car/${carId}/service/history`)}
                className="btn btn-primary text-sm"
              >
                Go to Service History
              </button>
            </div>
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