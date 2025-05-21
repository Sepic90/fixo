// src/components/layout/BackButton.jsx
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

const BackButton = ({ to, label }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (to) {
      return;
    }
    navigate(-1);
  };
  
  return (
    <div className="flex space-x-2 mb-4">
      {to ? (
        <Link 
          to={to} 
          className="btn btn-outline flex items-center space-x-1 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>{label || 'Back'}</span>
        </Link>
      ) : (
        <button 
          onClick={handleBack} 
          className="btn btn-outline flex items-center space-x-1 text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>{label || 'Back'}</span>
        </button>
      )}
      
      <Link 
        to="/" 
        className="btn btn-outline flex items-center space-x-1 text-sm"
      >
        <HomeIcon className="h-4 w-4" />
        <span>Home</span>
      </Link>
    </div>
  );
};

export default BackButton;