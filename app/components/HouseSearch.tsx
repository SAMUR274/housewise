'use client';
import { useState } from 'react';
import { HouseService } from '../api/services/houseService';

const houseService = new HouseService();

export default function HouseSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');

      // Process the query using JavaScript's built-in methods
      const processedQuery = query.split(/\s+/).join(' ');

      const searchResults = await houseService.searchProperties(processedQuery);
      setResults(searchResults);
    } catch (err) {
      setError('Sorry, there was an error processing your search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Find Your Perfect Home</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Try: Show me 3-bedroom houses in Toronto under $800,000"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {results.map((property) => (
          <div
            key={property.id}
            className="border rounded p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
            <p className="text-lg text-blue-600 mb-2">
              ${property.price.toLocaleString()}
            </p>
            <div className="flex gap-4 text-gray-600">
              <span>{property.bedrooms} beds</span>
              <span>{property.bathrooms} baths</span>
              <span>{property.location}</span>
            </div>
            {property.features.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Features: {property.features.join(', ')}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}