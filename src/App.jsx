// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddCarPage from './pages/AddCarPage';
import ServiceEntryPage from './pages/ServiceEntryPage';
import ServiceHistoryPage from './pages/ServiceHistoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import TechnicalDataPage from './pages/TechnicalDataPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-car" element={<AddCarPage />} />
            <Route path="/car/:carId/service/new" element={<ServiceEntryPage />} />
            <Route path="/car/:carId/service/history" element={<ServiceHistoryPage />} />
            <Route path="/car/:carId/service/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/car/:carId/technical" element={<TechnicalDataPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;