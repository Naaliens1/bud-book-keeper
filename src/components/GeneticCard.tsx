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
      className="cursor-pointer overflow-hidden bg-gradient-card border-border/50 hover:border-primary transition-all duration-300 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={genetic.image}
          alt={genetic.name}
          className="w-full h-full object-cover"
        />
        {activeSession && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            En Cultivo
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold text-foreground">{genetic.name}</h3>
        <p className="text-sm text-muted-foreground">{genetic.bank}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="bg-cannabis-green/20 text-cannabis-green-light border-cannabis-green/30">
            {genetic.family}
          </Badge>
          <Badge variant="secondary" className="bg-cannabis-purple/20 text-accent border-cannabis-purple/30">
            THC: {genetic.thc}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
