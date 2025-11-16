import { useState } from 'react';
import { useGenetics } from '@/contexts/GeneticsContext';
import { GeneticCard } from './GeneticCard';
import { GeneticDetail } from './GeneticDetail';
import { FilterPanel, FilterOptions } from './FilterPanel';
import { StatsOverview } from './StatsOverview';
import { Input } from '@/components/ui/input';
import { Search, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOption = 'name' | 'bank' | 'thc';

export const GeneticsGallery = () => {
  const { genetics } = useGenetics();
  const [selectedGenetic, setSelectedGenetic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filters, setFilters] = useState<FilterOptions>({
    family: 'Todas',
    thcLevel: 'Todos',
    bank: 'Todos',
  });

  const filteredGenetics = genetics.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         g.bank.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFamily = filters.family === 'Todas' || g.family.includes(filters.family);
    
    const matchesThc = filters.thcLevel === 'Todos' || 
                      (filters.thcLevel === 'Alto (25%+)' && g.thc.includes('Alto')) ||
                      (filters.thcLevel === 'Muy Alto (28%+)' && g.thc.includes('MUY ALTO'));
    
    const matchesBank = filters.bank === 'Todos' || g.bank === filters.bank;

    return matchesSearch && matchesFamily && matchesThc && matchesBank;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'bank':
        return a.bank.localeCompare(b.bank);
      case 'thc':
        return b.thc.localeCompare(a.thc);
      default:
        return 0;
    }
  });

  if (selectedGenetic) {
    const genetic = genetics.find(g => g.id === selectedGenetic);
    if (genetic) {
      return <GeneticDetail genetic={genetic} onBack={() => setSelectedGenetic(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative bg-gradient-primary py-10 px-4 shadow-elevated overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-center text-foreground mb-3 animate-fade-in-up">
            Mi Cultivo
          </h1>
          <p className="text-center text-foreground/90 text-sm max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
            Revisa y sigue tus genéticas de cannabis. Agrega notas de cultivo a lo largo del tiempo.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <StatsOverview />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre o banco..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border/50 focus:border-cannabis-green transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <FilterPanel onFilterChange={setFilters} activeFilters={filters} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-cannabis-purple/30 hover:border-cannabis-purple hover:bg-cannabis-purple/10 transition-all duration-300"
                >
                  <SortDesc className="w-4 h-4 mr-2" />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
                <DropdownMenuItem 
                  onClick={() => setSortBy('name')}
                  className="cursor-pointer hover:bg-muted focus:bg-muted"
                >
                  Por Nombre
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('bank')}
                  className="cursor-pointer hover:bg-muted focus:bg-muted"
                >
                  Por Banco
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('thc')}
                  className="cursor-pointer hover:bg-muted focus:bg-muted"
                >
                  Por THC
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredGenetics.map((genetic, index) => (
            <div
              key={genetic.id}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GeneticCard
                genetic={genetic}
                onClick={() => setSelectedGenetic(genetic.id)}
              />
            </div>
          ))}
        </div>

        {filteredGenetics.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-2">No se encontraron genéticas</p>
            <p className="text-sm text-muted-foreground/70">Intenta ajustar los filtros o búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};
