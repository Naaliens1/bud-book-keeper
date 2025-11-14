import { Home, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BottomNavProps {
  activeTab: 'home' | 'add' | 'export';
  onTabChange: (tab: 'home' | 'add' | 'export') => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const handleExport = () => {
    toast.info('Función de exportación en desarrollo', {
      description: 'Próximamente podrás exportar tu bitácora como PDF o CSV'
    });
  };

  const handleAdd = () => {
    toast.info('Función para agregar genéticas en desarrollo', {
      description: 'Próximamente podrás agregar tus propias genéticas personalizadas'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-glow z-20">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="lg"
          className={`flex flex-col items-center gap-1 h-full flex-1 rounded-none ${
            activeTab === 'home' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
          }`}
          onClick={() => onTabChange('home')}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Inicio</span>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className={`flex flex-col items-center gap-1 h-full flex-1 rounded-none ${
            activeTab === 'add' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
          }`}
          onClick={() => {
            onTabChange('add');
            handleAdd();
          }}
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs">Agregar</span>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className={`flex flex-col items-center gap-1 h-full flex-1 rounded-none ${
            activeTab === 'export' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
          }`}
          onClick={() => {
            onTabChange('export');
            handleExport();
          }}
        >
          <Download className="w-6 h-6" />
          <span className="text-xs">Exportar</span>
        </Button>
      </div>
    </div>
  );
};
