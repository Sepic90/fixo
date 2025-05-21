// src/components/services/ServiceHistoryList.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRightIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const ServiceHistoryList = ({ serviceEntries, carId }) => {
  if (serviceEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <WrenchScrewdriverIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No service history</h3>
        <p className="mt-1 text-sm text-gray-500">
          No service entries have been added yet.
        </p>
        <div className="mt-6">
          <Link 
            to={`/car/${carId}/service/new`}
            className="btn btn-primary inline-flex items-center"
          >
            Add New Service Entry
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <ul className="divide-y divide-gray-200">
        {serviceEntries.map((entry) => (
          <li key={entry.id}>
            <Link 
              to={`/car/${carId}/service/${entry.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-medium text-primary-600 truncate">
                      {entry.description}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      {entry.oilChanged && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                          Oil Changed
                        </span>
                      )}
                      <span>Odometer: {entry.odometer} km</span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                    <p>
                      {format(new Date(entry.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceHistoryList;