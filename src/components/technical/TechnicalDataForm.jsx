// src/components/technical/TechnicalDataForm.jsx
import { useState, useEffect } from 'react';
import { format, differenceInYears } from 'date-fns';

const TechnicalDataForm = ({ car, onSave, isLoading }) => {
  const [technicalData, setTechnicalData] = useState({
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
    vinNumber: '',
  });
  
  // Initialize form with car data
  useEffect(() => {
    if (car) {
      // Format the dates for the form inputs
      const formattedData = {
        ...car,
        registrationDate: car.registrationDate ? format(new Date(car.registrationDate), 'yyyy-MM') : '',
        nextInspectionDate: car.nextInspectionDate ? format(new Date(car.nextInspectionDate), 'yyyy-MM-dd') : ''
      };
      
      setTechnicalData(formattedData);
    }
  }, [car]);
  
  // Calculate car's age based on registration date
  const calculateAge = () => {
    if (!technicalData.registrationDate) return '';
    
    try {
      const regDate = new Date(technicalData.registrationDate);
      return differenceInYears(new Date(), regDate);
    } catch (error) {
      return '';
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTechnicalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert form dates to Date objects
    const formattedData = {
      ...technicalData,
      registrationDate: technicalData.registrationDate ? new Date(technicalData.registrationDate + '-01') : null,
      nextInspectionDate: technicalData.nextInspectionDate ? new Date(technicalData.nextInspectionDate) : null,
      age: calculateAge(),
    };
    
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