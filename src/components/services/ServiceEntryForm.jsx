// src/components/services/ServiceEntryForm.jsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ServiceEntryForm = ({ onSubmit, initialData = null, isLoading, carId }) => {
  const [serviceEntry, setServiceEntry] = useState({
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    odometer: '',
    task: '',
    parts: [{ manufacturer: '', partNumber: '' }],
    oilChanged: false,
  });
  
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      // Ensure parts array structure
      const parts = initialData.parts || [{ manufacturer: '', partNumber: '' }];
      
      // Format date for the form input
      const formattedData = {
        ...initialData,
        date: initialData.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        parts
      };
      
      setServiceEntry(formattedData);
      
      // Set existing images if available
      if (initialData.imageUrls && initialData.imageUrls.length > 0) {
        setImages(initialData.imageUrls.map(url => ({ url })));
      }
    }
  }, [initialData]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceEntry(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePartChange = (index, field, value) => {
    setServiceEntry(prev => {
      const updatedParts = [...prev.parts];
      updatedParts[index] = { 
        ...updatedParts[index], 
        [field]: value 
      };
      return { ...prev, parts: updatedParts };
    });
  };
  
  const addPartField = () => {
    setServiceEntry(prev => ({
      ...prev,
      parts: [...prev.parts, { manufacturer: '', partNumber: '' }]
    }));
  };
  
  const removePartField = (index) => {
    setServiceEntry(prev => {
      const updatedParts = [...prev.parts];
      updatedParts.splice(index, 1);
      return { ...prev, parts: updatedParts.length ? updatedParts : [{ manufacturer: '', partNumber: '' }] };
    });
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Store the file objects for upload
      setImageFiles(prev => [...prev, ...files]);
      
      // Create previews of the images
      const newImages = files.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
  };
  
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      
      // Release the URL object to prevent memory leaks
      if (newImages[index].file) {
        URL.revokeObjectURL(newImages[index].url);
        
        // Also remove from files array
        setImageFiles(prevFiles => prevFiles.filter(file => file !== newImages[index].file));
      }
      
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Remove empty part entries
    const filteredParts = serviceEntry.parts.filter(
      part => part.manufacturer.trim() !== '' || part.partNumber.trim() !== ''
    );
    
    // Prepare the data for submission
    const formattedData = {
      ...serviceEntry,
      carId, // Add the car ID
      parts: filteredParts.length > 0 ? filteredParts : [],
      date: new Date(serviceEntry.date),
      odometer: Number(serviceEntry.odometer)
    };
    
    // Get just the File objects for upload
    const filesToUpload = imageFiles;
    
    onSubmit(formattedData, filesToUpload);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={serviceEntry.description}
          onChange={handleInputChange}
          placeholder="Short description (e.g. Oil Change and Filter Replacement)"
          className="form-input"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={serviceEntry.date}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="odometer" className="form-label">Odometer Reading (km)</label>
          <input
            type="number"
            id="odometer"
            name="odometer"
            value={serviceEntry.odometer}
            onChange={handleInputChange}
            placeholder="Current mileage in kilometers"
            className="form-input"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="task" className="form-label">Task Description</label>
        <textarea
          id="task"
          name="task"
          value={serviceEntry.task}
          onChange={handleInputChange}
          rows="4"
          placeholder="Detailed description of the service work performed"
          className="form-input"
          required
        ></textarea>
      </div>
      
      <div className="form-group">
        <label className="form-label">Parts Used</label>
        
        {serviceEntry.parts.map((part, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={part.manufacturer}
              onChange={(e) => handlePartChange(index, 'manufacturer', e.target.value)}
              placeholder="Manufacturer"
              className="form-input flex-1"
            />
            
            <input
              type="text"
              value={part.partNumber}
              onChange={(e) => handlePartChange(index, 'partNumber', e.target.value)}
              placeholder="Part Number"
              className="form-input flex-1"
            />
            
            <button
              type="button"
              onClick={() => removePartField(index)}
              className="p-2 rounded-md text-red-600 hover:bg-red-100"
              aria-label="Remove part"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addPartField}
          className="btn btn-outline flex items-center space-x-1 mt-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Part</span>
        </button>
      </div>
      
      <div className="form-group">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="oilChanged"
            name="oilChanged"
            checked={serviceEntry.oilChanged}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="oilChanged" className="form-label m-0">
            Oil Changed
          </label>
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Photos</label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {images.map((image, index) => (
            <div key={index} className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={image.url}
                alt={`Service photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                aria-label="Remove image"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          <label className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <PlusIcon className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Note: Images will be uploaded to Firebase Storage.
        </p>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Service Entry' : 'Add Service Entry')}
        </button>
      </div>
    </form>
  );
};

export default ServiceEntryForm;