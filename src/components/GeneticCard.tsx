import { Genetic } from '@/types/genetics';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGenetics } from '@/contexts/GeneticsContext';

interface GeneticCardProps {
  genetic: Genetic;
  onClick: () => void;
}

export const GeneticCard = ({ genetic, onClick }: GeneticCardProps) => {
  const { getSessionByGenetic } = useGenetics();
  const activeSession = getSessionByGenetic(genetic.id);

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:border-primary/60 transition-all duration-500 hover:shadow-glow hover:scale-[1.03] active:scale-[0.97] animate-fade-in-up"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img
          src={genetic.image}
          alt={genetic.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {activeSession && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-elevated animate-pulse-glow z-20">
            En Cultivo
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
      </div>
      <div className="p-5 space-y-3 relative">
        <h3 className="text-xl font-bold text-foreground group-hover:text-cannabis-green-light transition-colors duration-300">{genetic.name}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cannabis-green-light"></span>
          {genetic.bank}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="bg-cannabis-green/20 text-cannabis-green-light border-cannabis-green/40 hover:bg-cannabis-green/30 transition-colors">
            {genetic.family}
          </Badge>
          <Badge variant="secondary" className="bg-cannabis-purple/20 text-cannabis-purple-light border-cannabis-purple/40 hover:bg-cannabis-purple/30 transition-colors">
            THC: {genetic.thc}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
