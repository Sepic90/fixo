// src/components/layout/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold">
          Car Service Tracker
        </Link>
        <nav>
          <Link 
            to="/add-car" 
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add New Car
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;