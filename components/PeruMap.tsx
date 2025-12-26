
import React from 'react';
import { CITIES } from '../constants';
import { City } from '../types';

interface PeruMapProps {
  onCitySelect: (city: City) => void;
}

const PeruMap: React.FC<PeruMapProps> = ({ onCitySelect }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-[#fdf6e3]">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-white rounded-[3rem] shadow-2xl border-[12px] border-white overflow-hidden">
        
        {/* Parchment/Sand Background with subtle textures */}
        <div className="absolute inset-0 bg-[#f9f3e9]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8b4513 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute top-1/4 left-10 text-3xl opacity-10">🌊</div>
          <div className="absolute bottom-1/4 right-10 text-3xl opacity-10">🌊</div>
        </div>

        {/* Improved Accurate Silhouette SVG based on the original Peru Map */}
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <svg viewBox="0 0 400 550" className="w-full h-full drop-shadow-2xl overflow-visible">
            <g transform="translate(10, 10)">
              {/* Detailed Silhouette with multi-region coloring based on the original image */}
              {/* Costa (Yellowish tone) */}
              <path 
                d="M140,50 L120,70 L80,125 L50,175 L40,215 L20,260 L15,310 L25,365 L40,410 L70,455 L105,485 L135,510 L155,500 L120,440 L90,380 L65,300 L60,200 L110,120 Z" 
                className="fill-[#fff9c4] stroke-[#fbc02d] stroke-[1] opacity-60"
              />
              {/* Sierra (Orange tone) */}
              <path 
                d="M140,50 L170,10 L195,15 L220,30 L160,100 L175,200 L190,300 L240,400 L285,420 L245,475 L200,510 L170,530 L135,510 L155,500 L120,440 L90,380 L65,300 L60,200 L110,120 Z" 
                className="fill-[#ffe0b2] stroke-[#ef6c00] stroke-[1] opacity-60"
              />
              {/* Selva (Green tone - Loreto, Ucayali) */}
              <path 
                d="M195,15 L220,30 L250,55 L300,85 L335,115 L355,155 L345,210 L330,255 L335,310 L315,360 L285,420 L240,400 L190,300 L175,200 L160,100 L220,30 Z" 
                className="fill-[#c8e6c9] stroke-[#2e7d32] stroke-[1] opacity-60"
              />
              {/* Main Silhouette Outline */}
              <path 
                d="M170,10 L195,15 L220,30 L250,55 L300,85 L335,115 L355,155 L345,210 L330,255 L335,310 L315,360 L285,420 L245,475 L200,510 L170,530 L135,510 L105,485 L70,455 L40,410 L25,365 L15,310 L20,260 L40,215 L50,175 L80,125 L120,70 Z" 
                className="fill-none stroke-[#8b4513] stroke-[3]"
              />
              
              {/* Lake Titicaca */}
              <ellipse cx="300" cy="455" rx="12" ry="8" className="fill-blue-400 stroke-blue-700 opacity-60" />

              {/* Decorative Nature */}
              <text x="180" y="320" className="text-xl pointer-events-none opacity-20 select-none">🏔️</text>
              <text x="250" y="180" className="text-xl pointer-events-none opacity-20 select-none">🌳</text>
            </g>
          </svg>
        </div>

        {/* Compass Rose (N, S, E, O) */}
        <div className="absolute bottom-12 left-12 w-24 h-24">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-orange-200 rounded-full border-dashed opacity-40"></div>
            <div className="w-0.5 h-full bg-orange-300 opacity-40 absolute"></div>
            <div className="h-0.5 w-full bg-orange-300 opacity-40 absolute"></div>
            <span className="absolute -top-3 font-black text-orange-600 text-[10px]">N</span>
            <span className="absolute -bottom-3 font-black text-orange-600 text-[10px]">S</span>
            <span className="absolute -right-3 font-black text-orange-600 text-[10px]">E</span>
            <span className="absolute -left-3 font-black text-orange-600 text-[10px]">O</span>
            <div className="w-5 h-5 bg-orange-500 rounded-full shadow-md border-2 border-white flex items-center justify-center">
              <div className="w-1 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* City Markers - Using pins 📍 */}
        <div className="absolute inset-0 pointer-events-none">
          {CITIES.map((city) => (
            <div
              key={city.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${city.coordinates.x}%`, top: `${city.coordinates.y}%` }}
            >
              <button
                onClick={() => onCitySelect(city)}
                className="relative flex flex-col items-center"
              >
                <div className={`absolute -inset-1.5 rounded-full opacity-50 blur-sm animate-ping ${city.color}`}></div>
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white font-bold text-lg transform group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-300 z-10 ${city.color}`}>
                  📍
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  {city.name}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Decorative Sun at the top */}
        <div className="absolute top-10 right-10 pointer-events-none">
          <div className="relative animate-pulse">
            <span className="text-6xl drop-shadow-lg">☀️</span>
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full -z-10"></div>
          </div>
        </div>

        {/* Llama Mascot at the bottom */}
        <div className="absolute bottom-6 right-10 flex flex-col items-center animate-float pointer-events-none">
          <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-xl border-2 border-orange-100 mb-2 relative">
             <p className="text-[10px] font-black text-orange-600">¡Presiona un 📍!</p>
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-b-2 border-r-2 border-orange-100"></div>
          </div>
          <span className="text-8xl drop-shadow-2xl">🦙</span>
        </div>

        {/* World Title Label */}
        <div className="absolute top-8 left-8 z-20">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border-4 border-white shadow-2xl">
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter leading-none">Camino<br/><span className="text-orange-500">Lector</span></h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PeruMap;
