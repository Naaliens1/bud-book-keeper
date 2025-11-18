import { Home, BookOpen, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  activeTab: 'home' | 'add' | 'export';
  onTabChange: (tab: 'home' | 'add' | 'export') => void;
  onExport?: () => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center h-16 px-4">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Inicio</span>
        </button>

        <button
          onClick={() => navigate('/all-log-entries')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            isActive('/all-log-entries') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Bitácora</span>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            isActive('/settings') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};
