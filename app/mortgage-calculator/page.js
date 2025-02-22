import React from 'react';
import MortgageCalculatorComponent from './MortgageCalculatorComponent';

export default function MortgageCalculator() {
  return (
    <div className="min-h-screen bg-white text-blue-500 p-8">
      <h1 className="text-3xl font-bold mb-6"></h1>
      <p className="text-lg mb-4"></p>
      <MortgageCalculatorComponent />
    </div>
  );
}