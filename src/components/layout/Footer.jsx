// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
      <div className="container mx-auto px-4">
        <p>Car Service Tracker © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;