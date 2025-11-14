import { useState } from 'react';
import { Genetic } from '@/types/genetics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Sprout, FlaskConical } from 'lucide-react';
import { LogEntryForm } from './LogEntryForm';
import { LogTimeline } from './LogTimeline';
import { useGenetics } from '@/contexts/GeneticsContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GeneticDetailProps {
  genetic: Genetic;
  onBack: () => void;
}

export const GeneticDetail = ({ genetic, onBack }: GeneticDetailProps) => {
  const { getLogsByGenetic, getSessionByGenetic } = useGenetics();
  const logs = getLogsByGenetic(genetic.id);
  const activeSession = getSessionByGenetic(genetic.id);
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-primary/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{genetic.name}</h1>
            <p className="text-sm text-muted-foreground">Detalles y Seguimiento</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="aspect-video relative overflow-hidden rounded-lg mb-6 shadow-card">
          <img
            src={genetic.image}
            alt={genetic.name}
            className="w-full h-full object-cover"
          />
          {activeSession && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              En Cultivo Activo
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30">
            <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FlaskConical className="w-4 h-4 mr-2" />
              Información
            </TabsTrigger>
            <TabsTrigger value="log" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sprout className="w-4 h-4 mr-2" />
              Bitácora ({logs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-primary" />
                Datos de la Genética
              </h2>
              <div className="space-y-3 text-sm">
                <InfoItem label="Banco" value={genetic.bank} />
                <InfoItem label="Familia" value={genetic.family} />
                <InfoItem label="THC" value={genetic.thc} highlight />
                <InfoItem label="CBD" value={genetic.cbd} />
                <InfoItem label="Tiempo de Floración" value={genetic.flowering} />
                <InfoItem label="Rendimiento" value={genetic.yield} />
                <InfoItem label="Altura" value={genetic.height} />
                <InfoItem label="Producción Interior" value={genetic.indoorProduction} />
                <InfoItem label="Producción Exterior" value={genetic.outdoorProduction} />
                <InfoItem label="Sabor/Aroma" value={genetic.flavor} />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">Linaje y Genética</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{genetic.parentage}</p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">Objetivos del Breeding</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{genetic.breedingGoals}</p>
            </Card>
          </TabsContent>

          <TabsContent value="log" className="mt-4 space-y-4">
            <LogEntryForm geneticId={genetic.id} />
            <LogTimeline geneticId={genetic.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between items-start py-2 border-b border-border/30">
    <span className="font-medium text-muted-foreground">{label}:</span>
    <span className={`text-right ${highlight ? 'text-primary font-bold' : 'text-foreground'}`}>
      {value}
    </span>
  </div>
);
