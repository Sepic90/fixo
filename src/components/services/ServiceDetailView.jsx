// src/components/services/ServiceDetailView.jsx
import { useState } from 'react';
import { format } from 'date-fns';
import { CheckIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ServiceDetailView = ({ service, onDeleteImage }) => {
  const [activeImage, setActiveImage] = useState(null);
  
  if (!service) return null;
  
  const closeModal = () => {
    setActiveImage(null);
  };
  
  const handleDeleteImage = (imageUrl) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      onDeleteImage(imageUrl);
      if (activeImage === imageUrl) {
        setActiveImage(null);
      }
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-primary-500">
        <h3 className="text-lg leading-6 font-medium text-white">
          {service.description}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-white opacity-90">
          {format(new Date(service.date), 'MMMM dd, yyyy')} • {service.odometer} km
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Task Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {service.task}
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Oil Changed</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {service.oilChanged ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckIcon className="mr-1 h-4 w-4" /> Yes
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <XMarkIcon className="mr-1 h-4 w-4" /> No
                </span>
              )}
            </dd>
          </div>
          
          {service.parts && service.parts.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Parts Used</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {service.parts.map((part, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {part.manufacturer}: {part.partNumber}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          
          {service.imageUrls && service.imageUrls.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 mb-2">Photos</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {service.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="h-24 w-full overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => setActiveImage(url)}
                      >
                        <img 
                          src={url} 
                          alt={`Service photo ${index + 1}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button 
                        onClick={() => handleDeleteImage(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </dd>
            </div>
          )}
        </dl>
      </div>
      
      {/* Image Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Image Viewer</h3>
              <div className="flex space-x-2">
                <a 
                  href={activeImage} 
                  download 
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Download image"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 text-gray-600" />
                </a>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Close"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img 
                src={activeImage} 
                alt="Service photo" 
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailView;