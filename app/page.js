'use client'
import React, { useState } from 'react';

import Link from 'next/link';
import { 
  Home, Search, TrendingUp, Map, Calculator, Building, 
  AlertCircle, Settings, Eye, Loader
} from 'lucide-react';

export default function RealEstatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/properties?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.Results) {
        setProperties(data.Results);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Keeping your existing sidebar */}
      <div className="w-64 bg-slate-800 text-white">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <span className="text-xl font-bold text-white">HomeAI Canada</span>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavItem icon={<Home className="h-5 w-5" />} label="Dashboard" active />
          <NavItem icon={<Search className="h-5 w-5" />} label="Property Search" />
          <NavItem icon={<TrendingUp className="h-5 w-5" />} label="Market Trends" />
          <NavItem icon={<Map className="h-5 w-5" />} label="Neighborhood Analysis" />
          <NavItem icon={<Calculator className="h-5 w-5" />} label="Mortgage Calculator" />
          <NavItem icon={<AlertCircle className="h-5 w-5" />} label="Market Alerts" />
          <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">Canadian Housing Market Intelligence</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/IMAJINE"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg 
                        hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 
                        transform hover:scale-105 font-bold flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              IMAGINE
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Market Report
            </button>
          </div>
        </header>

        <main className="p-8">
          {/* AI Search Section - Modified to work with realtor.ca */}
          <section className="mb-12 bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your Perfect Home</h2>
            <div className="flex gap-4 mb-6">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask our AI: e.g., 'Show me 3-bedroom houses in Toronto under $800,000'"
                className="flex-1 p-4 border rounded-lg text-gray-800 placeholder-gray-400"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
              >
                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Search'}
              </button>
            </div>

            {/* Property Results */}
            {properties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {properties.map((property) => (
                  <div key={property.Id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <img
                      src={property.Photo[0]?.HighResPath || '/api/placeholder/400/300'}
                      alt={property.Address}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{property.Address}</h3>
                      <p className="text-lg font-bold text-blue-600">${property.Price?.toLocaleString()}</p>
                      <p className="text-gray-600">
                        {property.Building?.Bedrooms} beds • {property.Building?.BathroomTotal} baths • {property.Building?.SizeInterior} sqft
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Market Insights - Keeping your existing market insights section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Market Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MarketCard 
                title="Toronto Market"
                trend="up"
                change="+2.5%"
                description="Average home prices up in Greater Toronto Area"
              />
              <MarketCard 
                title="Vancouver Market"
                trend="stable"
                change="0.8%"
                description="Market stabilizing with moderate growth"
              />
              <MarketCard 
                title="Montreal Market"
                trend="up"
                change="+1.7%"
                description="Steady increase in property values"
              />
            </div>
          </section>

          {/* AI Features Section - Keeping your existing features section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">AI-Powered Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Building className="h-6 w-6" />}
                title="Property Valuation"
                description="Get instant AI-powered property valuations based on market data"
              />
              <FeatureCard 
                icon={<TrendingUp className="h-6 w-6" />}
                title="Price Predictions"
                description="See future property value predictions for any neighborhood"
              />
              <FeatureCard 
                icon={<Map className="h-6 w-6" />}
                title="Area Analysis"
                description="Detailed neighborhood insights and investment potential"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Your existing component definitions
const NavItem = ({ icon, label, active = false }) => {
  return (
    <div className={`
      flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer
      ${active ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}
      transition-colors
    `}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
};

const MarketCard = ({ title, trend, change, description }) => {
  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
      <span className={`text-lg font-bold ${getTrendColor(trend)}`}>
        {change}
      </span>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};