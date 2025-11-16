import { useState } from 'react';
import { GeneticsGallery } from '@/components/GeneticsGallery';
import { BottomNav } from '@/components/BottomNav';
import { GeneticsProvider } from '@/contexts/GeneticsContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'export'>('home');
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exportar bitácora",
      description: "Selecciona una genética y abre sus detalles para exportar su bitácora en PDF",
    });
  };

  return (
    <GeneticsProvider>
      <div className="min-h-screen bg-background">
        <GeneticsGallery />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onExport={handleExport} />
      </div>
    </GeneticsProvider>
  );
};

export default Index;
