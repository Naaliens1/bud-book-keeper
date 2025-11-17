import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';

export const Themes = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('dark');

  const themes = [
    {
      id: 'dark',
      name: 'Tema Oscuro',
      description: 'Tema por defecto con tonos oscuros',
      colors: {
        primary: 'hsl(142, 76%, 36%)',
        background: 'hsl(240, 10%, 3.9%)',
        card: 'hsl(240, 10%, 8%)',
      },
    },
    {
      id: 'light',
      name: 'Tema Claro',
      description: 'Diseño limpio con tonos claros',
      colors: {
        primary: 'hsl(142, 76%, 36%)',
        background: 'hsl(0, 0%, 100%)',
        card: 'hsl(0, 0%, 96%)',
      },
    },
    {
      id: 'high-contrast',
      name: 'Alto Contraste',
      description: 'Máxima legibilidad y contraste',
      colors: {
        primary: 'hsl(142, 100%, 45%)',
        background: 'hsl(0, 0%, 0%)',
        card: 'hsl(0, 0%, 10%)',
      },
    },
    {
      id: 'custom',
      name: 'Personalizado',
      description: 'Crea tu propia combinación de colores',
      colors: {
        primary: 'hsl(280, 76%, 56%)',
        background: 'hsl(240, 10%, 3.9%)',
        card: 'hsl(240, 10%, 8%)',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Apariencia</h1>
            <p className="text-sm text-muted-foreground">Personaliza tu tema</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Temas Predefinidos
          </h2>

          <div className="grid gap-3">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedTheme === theme.id
                    ? 'border-primary shadow-md'
                    : 'border-transparent hover:border-border'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: theme.colors.background }}
                    />
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: theme.colors.card }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                  {selectedTheme === theme.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {selectedTheme === 'custom' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Personalizar Colores
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Color Primario</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                    defaultValue="#22c55e"
                  />
                  <Button variant="outline" className="flex-1">
                    Seleccionar Color
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color de Fondo</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                    defaultValue="#0a0a0a"
                  />
                  <Button variant="outline" className="flex-1">
                    Seleccionar Color
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color de Acento</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-10 w-20 rounded border border-border cursor-pointer"
                    defaultValue="#8b5cf6"
                  />
                  <Button variant="outline" className="flex-1">
                    Seleccionar Color
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Button className="w-full" size="lg">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};