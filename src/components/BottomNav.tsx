import { Home, Plus, Download, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
  activeTab: 'home' | 'add' | 'export';
  onTabChange: (tab: 'home' | 'add' | 'export') => void;
  onExport?: () => void;
}

export const BottomNav = ({ activeTab, onTabChange, onExport }: BottomNavProps) => {
  const { signOut } = useAuth();

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-glow z-20">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="lg"
          className={`flex flex-col items-center gap-1 h-full flex-1 rounded-none transition-all ${
            activeTab === 'home' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onTabChange('home')}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Inicio</span>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className={`flex flex-col items-center gap-1 h-full flex-1 rounded-none transition-all ${
            activeTab === 'export' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => {
            onTabChange('export');
            handleExport();
          }}
        >
          <Download className="w-6 h-6" />
          <span className="text-xs">Exportar</span>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-1 h-full flex-1 rounded-none text-muted-foreground hover:text-destructive transition-all"
          onClick={signOut}
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs">Salir</span>
        </Button>
      </div>
    </div>
  );
};
