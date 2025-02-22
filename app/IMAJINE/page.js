// app/IMAJINE/page.js
'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ImaginePage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [price, setPrice] = useState(400000);
  const [season, setSeason] = useState('summer');

  const cities = ['Waterloo', 'Kitchener', 'Cambridge', 'Guelph'];
  const seasons = ['Summer', 'Fall', 'Winter', 'Spring'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <div className="p-6">
        <Link 
          href="/"
          className="text-white flex items-center gap-2 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Imagine Your Future Home</h1>
        
        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* City Selector */}
            <div className="relative">
              <label className="block text-white mb-2">Select City</label>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div>
              <label className="block text-white mb-2">Price Range</label>
              <input 
                type="range"
                min="0"
                max="400000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-white mt-1">${price.toLocaleString()}</div>
            </div>

            {/* Season Selector */}
            <div>
              <label className="block text-white mb-2">View in Season</label>
              <div className="flex gap-2">
                {seasons.map(s => (
                  <button
                    key={s}
                    onClick={() => setSeason(s.toLowerCase())}
                    className={`px-4 py-2 rounded ${
                      season === s.toLowerCase() 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="bg-white/5 rounded-xl overflow-hidden" style={{ height: '600px' }}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <House season={season} />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

// House Component
function House({ season }) {
  const seasonColors = {
    summer: {
      grass: '#4CAF50',
      trees: '#2E7D32',
    },
    winter: {
      grass: '#FAFAFA',
      trees: '#546E7A',
    },
    fall: {
      grass: '#827717',
      trees: '#D84315',
    },
    spring: {
      grass: '#7CB342',
      trees: '#81C784',
    }
  };

  const colors = seasonColors[season];

  return (
    <group>
      {/* House base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[1.5, 0.8, 4]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={colors.grass} />
      </mesh>
    </group>
  );
}