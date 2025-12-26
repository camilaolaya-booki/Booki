
import React from 'react';
import { UserState, World } from '../types';
import { WORLD_NAMES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userState: UserState;
  activeWorld: World;
  onNavigate: (world: World) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userState, activeWorld, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 shadow-sm flex items-center justify-between border-b border-orange-100">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate('CAMINO_LECTOR')}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <span className="text-3xl">🦙</span>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
              📖
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-orange-600 tracking-tighter leading-none">Booki</h1>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Perú Lector</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {(['CAMINO_LECTOR', 'LEYENDOPOLIS', 'CUENTOPIA'] as World[]).map((world) => {
            const isUnlocked = userState.unlockedWorlds.includes(world);
            const isActive = activeWorld === world;
            
            return (
              <button
                key={world}
                disabled={!isUnlocked}
                onClick={() => onNavigate(world)}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : isUnlocked 
                      ? 'text-gray-600 hover:bg-orange-50' 
                      : 'text-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                {WORLD_NAMES[world]}
                {!isUnlocked && <span className="ml-2">🔒</span>}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 border-2 border-yellow-300 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <span className="text-xl">🪙</span>
            <span className="font-black text-yellow-700">{userState.coins}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-500 overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
            <img src="https://picsum.photos/seed/child/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-[#fdfaf5]">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {(['CAMINO_LECTOR', 'LEYENDOPOLIS', 'CUENTOPIA'] as World[]).map((world) => (
          <button
            key={world}
            disabled={!userState.unlockedWorlds.includes(world)}
            onClick={() => onNavigate(world)}
            className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
              activeWorld === world ? 'text-orange-500 bg-orange-50' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">
              {world === 'CAMINO_LECTOR' ? '🗺️' : world === 'LEYENDOPOLIS' ? '🏛️' : '📚'}
            </span>
            <span className="text-[10px] font-black">{WORLD_NAMES[world]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Layout;
