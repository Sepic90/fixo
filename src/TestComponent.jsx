// src/TestComponent.jsx
import React from 'react';

const TestComponent = () => {
  return (
    <div className="p-4 m-4 bg-blue-100 rounded-lg">
      <h1 className="text-2xl font-bold text-blue-800">Tailwind Test</h1>
      <p className="mt-2 text-gray-700">If you can see this styled with blue background and proper spacing, Tailwind is working!</p>
      <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
        Test Button
      </button>
    </div>
  );
};

export default TestComponent;