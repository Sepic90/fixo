// src/components/cars/CarForm.jsx
import { useState, useEffect } from 'react';
import { format, parseISO, differenceInYears } from 'date-fns';

const CarForm = ({ onSubmit, initialData = null, isLoading }) => {
  const [car, setCar] = useState({
    name: '',
    description: '',
    registrationDate: format(new Date(), 'yyyy-MM'),
    registrationNumber: '',
    engineCode: '',
    horsePower: '',
    fuelConsumption: '',
    colorName: '',
    colorCode: '',
    nextInspectionDate: format(new Date(), 'yyyy-MM-dd'),
    vinNumber: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      // Format the dates for the form inputs
      const formattedData = {
        ...initialData,
        registrationDate: initialData.registrationDate ? format(new Date(initialData.registrationDate), 'yyyy-MM') : '',
        nextInspectionDate: initialData.nextInspectionDate ? format(new Date(initialData.nextInspectionDate), 'yyyy-MM-dd') : ''
      };
      
      setCar(formattedData);
      setImagePreview(initialData.imageUrl);
    }
  }, [initialData]);
  
  // Calculate car's age based on registration date
  const calculateAge = () => {
    if (!car.registrationDate) return '';
    
    try {
      const regDate = new Date(car.registrationDate);
      return differenceInYears(new Date(), regDate);
    } catch (error) {
      return '';
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCar(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImageFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert form dates to Date objects
    const formattedData = {
      ...car,
      registrationDate: car.registrationDate ? new Date(car.registrationDate + '-01') : null, // Add day for proper date
      nextInspectionDate: car.nextInspectionDate ? new Date(car.nextInspectionDate) : null,
      age: calculateAge(),
    };
    
    onSubmit(formattedData, imageFile);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="image" className="form-label">Car Image</label>
        <div className="mt-1 flex items-center space-x-4">
          {imagePreview && (
            <div className="w-32 h-32 relative rounded overflow-hidden">
              <img src={imagePreview} alt="Car preview" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Car Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={car.name}
            onChange={handleInputChange}
            placeholder="e.g. Civic EK4"
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Full Model Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={car.description}
            onChange={handleInputChange}
            placeholder="e.g. Honda Civic EK4 1.6 VTi"
            className="form-input"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="registrationDate" className="form-label">First Registration (Month/Year)</label>
          <input
            type="month"
            id="registrationDate"
            name="registrationDate"
            value={car.registrationDate}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="age" className="form-label">Car's Age</label>
          <input
            type="text"
            id="age"
            value={calculateAge() ? `${calculateAge()} years` : 'N/A'}
            className="form-input"
            disabled
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="registrationNumber" className="form-label">Registration (License Plate)</label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={car.registrationNumber}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="engineCode" className="form-label">Engine Code</label>
          <input
            type="text"
            id="engineCode"
            name="engineCode"
            value={car.engineCode}
            onChange={handleInputChange}
            placeholder="e.g. B16A2"
            className="form-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="horsePower" className="form-label">Horsepower (HP)</label>
          <input
            type="number"
            id="horsePower"
            name="horsePower"
            value={car.horsePower}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fuelConsumption" className="form-label">Fuel Consumption (km/l)</label>
          <input
            type="number"
            id="fuelConsumption"
            name="fuelConsumption"
            value={car.fuelConsumption}
            onChange={handleInputChange}
            step="0.1"
            className="form-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="colorName" className="form-label">Color Name</label>
          <input
            type="text"
            id="colorName"
            name="colorName"
            value={car.colorName}
            onChange={handleInputChange}
            placeholder="e.g. Aqua Mint Opal"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="colorCode" className="form-label">Color Code</label>
          <input
            type="text"
            id="colorCode"
            name="colorCode"
            value={car.colorCode}
            onChange={handleInputChange}
            placeholder="e.g. BG-45M"
            className="form-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="nextInspectionDate" className="form-label">Next Inspection Due</label>
          <input
            type="date"
            id="nextInspectionDate"
            name="nextInspectionDate"
            value={car.nextInspectionDate}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="vinNumber" className="form-label">VIN Number</label>
          <input
            type="text"
            id="vinNumber"
            name="vinNumber"
            value={car.vinNumber}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Car' : 'Add Car')}
        </button>
      </div>
    </form>
  );
};

export default CarForm;