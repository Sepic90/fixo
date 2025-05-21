// src/components/technical/TechnicalDataForm.jsx
import { useState, useEffect } from 'react';
import { format, differenceInYears, isValid } from 'date-fns';

const TechnicalDataForm = ({ car, onSave, isLoading }) => {
  const [technicalData, setTechnicalData] = useState({
    name: '',
    description: '',
    registrationDate: '',
    registrationNumber: '',
    engineCode: '',
    horsePower: '',
    fuelConsumption: '',
    colorName: '',
    colorCode: '',
    nextInspectionDate: '',
    vinNumber: '',
  });
  
  console.log('TechnicalDataForm - car data:', car);
  
  // Helper function to safely format dates
  const safeFormatDate = (date, formatStr, defaultValue = '') => {
    console.log('Attempting to format date:', date, 'with format:', formatStr);
    
    if (!date) {
      console.log('Date is null/undefined, returning default value');
      return defaultValue;
    }
    
    // If it's a Firestore timestamp
    if (date && typeof date.toDate === 'function') {
      const jsDate = date.toDate();
      console.log('Converted Firestore timestamp to JS Date:', jsDate);
      
      if (isValid(jsDate)) {
        return format(jsDate, formatStr);
      } else {
        console.warn('Invalid date after timestamp conversion');
        return defaultValue;
      }
    }
    
    // If it's already a Date object
    if (date instanceof Date) {
      if (isValid(date)) {
        return format(date, formatStr);
      } else {
        console.warn('Invalid Date object');
        return defaultValue;
      }
    }
    
    // Try to create a valid date from the input
    try {
      const parsedDate = new Date(date);
      if (isValid(parsedDate)) {
        return format(parsedDate, formatStr);
      } else {
        console.warn('Invalid date after parsing');
        return defaultValue;
      }
    } catch (err) {
      console.error('Error formatting date:', err);
      return defaultValue;
    }
  };
  
  // Initialize form with car data
  useEffect(() => {
    if (car) {
      console.log('Initializing form with car data');
      
      // Format the dates for the form inputs, with fallbacks if dates are invalid
      const formattedData = {
        ...car,
        registrationDate: car.registrationDate ? safeFormatDate(car.registrationDate, 'yyyy-MM', '') : '',
        nextInspectionDate: car.nextInspectionDate ? safeFormatDate(car.nextInspectionDate, 'yyyy-MM-dd', '') : ''
      };
      
      console.log('Formatted car data for form:', formattedData);
      setTechnicalData(formattedData);
    }
  }, [car]);
  
  // Calculate car's age based on registration date
  const calculateAge = () => {
    if (!technicalData.registrationDate) return '';
    
    try {
      // Add a day to ensure it's a valid date (for month inputs, which don't include a day)
      const regDate = new Date(technicalData.registrationDate + '-01');
      if (!isValid(regDate)) {
        console.warn('Invalid registration date for age calculation:', technicalData.registrationDate);
        return '';
      }
      
      return differenceInYears(new Date(), regDate);
    } catch (error) {
      console.error('Error calculating age:', error);
      return '';
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTechnicalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare date fields for submission
    let registrationDate = null;
    if (technicalData.registrationDate) {
      try {
        // Add day component for proper date creation
        registrationDate = new Date(technicalData.registrationDate + '-01');
        if (!isValid(registrationDate)) {
          console.warn('Created invalid registration date:', registrationDate);
          registrationDate = null;
        }
      } catch (err) {
        console.error('Error creating registration date:', err);
      }
    }
    
    let nextInspectionDate = null;
    if (technicalData.nextInspectionDate) {
      try {
        nextInspectionDate = new Date(technicalData.nextInspectionDate);
        if (!isValid(nextInspectionDate)) {
          console.warn('Created invalid next inspection date:', nextInspectionDate);
          nextInspectionDate = null;
        }
      } catch (err) {
        console.error('Error creating next inspection date:', err);
      }
    }
    
    // Convert form dates to Date objects with validation
    const formattedData = {
      ...technicalData,
      registrationDate: registrationDate,
      nextInspectionDate: nextInspectionDate,
      age: calculateAge(),
      // Convert string number fields to actual numbers
      horsePower: technicalData.horsePower ? Number(technicalData.horsePower) : null,
      fuelConsumption: technicalData.fuelConsumption ? Number(technicalData.fuelConsumption) : null,
    };
    
    console.log('Submitting formatted data:', formattedData);
    onSave(formattedData);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Technical Data
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Edit the technical specifications of your car.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Car's Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                name="name"
                value={technicalData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Full Model Description
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="description"
                name="description"
                value={technicalData.description}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700">
              First Registration (Month/Year)
            </label>
            <div className="mt-1">
              <input
                type="month"
                id="registrationDate"
                name="registrationDate"
                value={technicalData.registrationDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Car's Age
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="age"
                value={calculateAge() ? `${calculateAge()} years` : 'N/A'}
                className="form-input"
                disabled
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
              Registration (License Plate)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={technicalData.registrationNumber}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="engineCode" className="block text-sm font-medium text-gray-700">
              Engine Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="engineCode"
                name="engineCode"
                value={technicalData.engineCode}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="horsePower" className="block text-sm font-medium text-gray-700">
              Horsepower (HP)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="horsePower"
                name="horsePower"
                value={technicalData.horsePower}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="fuelConsumption" className="block text-sm font-medium text-gray-700">
              Fuel Consumption (km/l)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="fuelConsumption"
                name="fuelConsumption"
                value={technicalData.fuelConsumption}
                onChange={handleInputChange}
                step="0.1"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="colorName" className="block text-sm font-medium text-gray-700">
              Color Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="colorName"
                name="colorName"
                value={technicalData.colorName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700">
              Color Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="colorCode"
                name="colorCode"
                value={technicalData.colorCode}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="nextInspectionDate" className="block text-sm font-medium text-gray-700">
              Next Inspection Due
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="nextInspectionDate"
                name="nextInspectionDate"
                value={technicalData.nextInspectionDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="vinNumber" className="block text-sm font-medium text-gray-700">
              VIN Number
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="vinNumber"
                name="vinNumber"
                value={technicalData.vinNumber}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TechnicalDataForm;