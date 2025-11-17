import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, User, Users, Palette, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      icon: User,
      title: 'Perfil',
      description: 'Gestiona tu información personal',
      path: '/settings/profile',
      color: 'text-primary',
    },
    {
      icon: Users,
      title: 'Amigos y Red',
      description: 'Conecta con otros cultivadores',
      path: '/settings/friends',
      color: 'text-cannabis-accent',
    },
    {
      icon: Palette,
      title: 'Apariencia',
      description: 'Personaliza colores y temas',
      path: '/settings/themes',
      color: 'text-cannabis-purple',
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      description: 'Configura tus alertas',
      path: '/settings/notifications',
      color: 'text-yellow-500',
    },
    {
      icon: Lock,
      title: 'Privacidad y Seguridad',
      description: 'Controla tu privacidad',
      path: '/settings/privacy',
      color: 'text-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Configuración</h1>
            <p className="text-sm text-muted-foreground">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.path}
              className="p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(section.path)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted/50 ${section.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};