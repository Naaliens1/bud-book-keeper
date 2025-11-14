import { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { GeneticsGallery } from '@/components/GeneticsGallery';
import { BottomNav } from '@/components/BottomNav';
import { GeneticsProvider } from '@/contexts/GeneticsContext';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'export'>('home');

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <GeneticsProvider>
      <div className="min-h-screen bg-background">
        <GeneticsGallery />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </GeneticsProvider>
  );
};

export default Index;
