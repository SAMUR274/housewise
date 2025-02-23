'use client';
import React, { useState } from 'react';

export default function MortgageCalculatorComponent() {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateMortgage = () => {
    const principalAmount = parseFloat(principal);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseInt(years) * 12;

    const monthlyPaymentAmount = 
      (principalAmount * monthlyInterestRate) / 
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    setMonthlyPayment(monthlyPaymentAmount.toFixed(2));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Mortgage Calculator</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Principal Amount ($)</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className="w-full p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Annual Interest Rate (%)</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="w-full p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Loan Term (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="w-full p-2 rounded"
        />
      </div>
      <button
        onClick={calculateMortgage}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Calculate
      </button>
      {monthlyPayment && (
        <div className="mt-4 text-white">
          <h3 className="text-xl font-bold">Monthly Payment: ${monthlyPayment}</h3>
        </div>
      )}
    </div>
  );
}