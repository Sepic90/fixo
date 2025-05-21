// src/components/layout/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary-500 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center">
        <Link to="/" className="inline-block">
          <img 
            src="/logo.png" 
            alt="Car Service Tracker" 
            className="h-12" // Adjust size as needed
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;