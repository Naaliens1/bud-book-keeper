import { useState } from 'react';
import { useGenetics } from '@/contexts/GeneticsContext';
import { GeneticCard } from './GeneticCard';
import { GeneticDetail } from './GeneticDetail';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const GeneticsGallery = () => {
  const { genetics } = useGenetics();
  const [selectedGenetic, setSelectedGenetic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGenetics = genetics.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedGenetic) {
    const genetic = genetics.find(g => g.id === selectedGenetic);
    if (genetic) {
      return <GeneticDetail genetic={genetic} onBack={() => setSelectedGenetic(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-primary py-8 px-4 shadow-card">
        <h1 className="text-3xl font-bold text-center text-foreground mb-2">Mi Cultivo</h1>
        <p className="text-center text-foreground/80 text-sm max-w-md mx-auto">
          Revisa y sigue tus genéticas de cannabis. Agrega notas de cultivo a lo largo del tiempo.
        </p>
      </div>

      <div className="p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nombre o banco..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredGenetics.map(genetic => (
            <GeneticCard
              key={genetic.id}
              genetic={genetic}
              onClick={() => setSelectedGenetic(genetic.id)}
            />
          ))}
        </div>

        {filteredGenetics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron genéticas</p>
          </div>
        )}
      </div>
    </div>
  );
};
