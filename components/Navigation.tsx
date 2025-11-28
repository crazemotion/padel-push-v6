
import React from 'react';
import { Home, UserCircle2, CalendarCheck } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe z-40 transition-all shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => onNavigate('feed')}
          className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
            currentView === 'feed' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className={`relative p-1 rounded-xl transition-all ${currentView === 'feed' ? 'bg-green-50' : 'bg-transparent'}`}>
            <Home className={`w-6 h-6 ${currentView === 'feed' ? 'fill-current' : 'stroke-[2px]'}`} />
          </div>
          <span className="text-[10px] font-bold">Explorar</span>
        </button>

        <button
          onClick={() => onNavigate('active')}
          className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
            currentView === 'active' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className={`relative p-1 rounded-xl transition-all ${currentView === 'active' ? 'bg-green-50' : 'bg-transparent'}`}>
            <CalendarCheck className={`w-6 h-6 ${currentView === 'active' ? 'fill-current' : 'stroke-[2px]'}`} />
          </div>
          <span className="text-[10px] font-bold">Mis Partidos</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
            currentView === 'profile' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className={`relative p-1 rounded-xl transition-all ${currentView === 'profile' ? 'bg-green-50' : 'bg-transparent'}`}>
            <UserCircle2 className={`w-6 h-6 ${currentView === 'profile' ? 'fill-current' : 'stroke-[2px]'}`} />
          </div>
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
