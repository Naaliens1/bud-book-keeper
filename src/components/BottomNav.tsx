import { Home, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
  activeTab: 'home' | 'add' | 'export';
  onTabChange: (tab: 'home' | 'add' | 'export') => void;
  onExport?: () => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-glow z-20">
      <div className="flex items-center h-16 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
            activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Inicio</span>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Ajustes</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-medium">Salir</span>
        </button>
      </div>
    </div>
  );
};
