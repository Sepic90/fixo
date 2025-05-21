// src/components/technical/TechnicalDataView.jsx
import { formatDate, formatHorsepower, formatFuelConsumption } from '../../utils/formatters';

const TechnicalDataView = ({ car }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Technical Data
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview of technical specifications for your car.
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Car's Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.name || 'Not specified'}</dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Full Model Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.description || 'Not specified'}</dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">First Registration (Month/Year)</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {car.registrationDate ? formatDate(car.registrationDate, 'MMMM yyyy') : 'Not specified'}
            </dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Car's Age</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {car.age ? `${car.age} years` : 'Not specified'}
            </dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Registration (License Plate)</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.registrationNumber || 'Not specified'}</dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Engine Code</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.engineCode || 'Not specified'}</dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Horsepower (HP)</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {car.horsePower ? formatHorsepower(car.horsePower) : 'Not specified'}
            </dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Fuel Consumption (km/l)</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {car.fuelConsumption ? formatFuelConsumption(car.fuelConsumption) : 'Not specified'}
            </dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Color Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.colorName || 'Not specified'}</dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Color Code</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.colorCode || 'Not specified'}</dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Next Inspection Due</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {car.nextInspectionDate ? formatDate(car.nextInspectionDate) : 'Not specified'}
            </dd>
          </div>
          
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">VIN Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{car.vinNumber || 'Not specified'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TechnicalDataView;