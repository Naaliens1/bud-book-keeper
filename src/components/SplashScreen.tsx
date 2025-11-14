import { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-primary transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={logo}
        alt="Mi Cultivo Logo"
        className="w-32 h-32 mb-8 animate-pulse drop-shadow-glow"
      />
      <h1 className="text-4xl font-bold text-foreground mb-2">Mi Cultivo</h1>
      <p className="text-lg text-foreground/80">Galería y Bitácora de Genéticas</p>
    </div>
  );
};
