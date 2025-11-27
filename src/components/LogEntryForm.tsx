import { useState } from 'react';
import { useGenetics } from '@/contexts/GeneticsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Play, Square } from 'lucide-react';
import { toast } from 'sonner';
import { Genetic } from '@/types/genetics';
import { CultivationNameModal } from './CultivationNameModal';

interface LogEntryFormProps {
  geneticId: string;
  genetic: Genetic;
}

export const LogEntryForm = ({ geneticId, genetic }: LogEntryFormProps) => {
  const { addLogEntry, startCultivation, endCultivation, getSessionByGenetic } = useGenetics();
  const [showNameModal, setShowNameModal] = useState(false);
  const activeSession = getSessionByGenetic(geneticId);

  const [stage, setStage] = useState<'germination' | 'vegetative' | 'flowering' | 'harvest'>('vegetative');
  const [observations, setObservations] = useState('');
  const [height, setHeight] = useState('');
  const [ph, setPh] = useState('');
  const [ec, setEc] = useState('');
  const [temperature, setTemperature] = useState('');
  const [startNotes, setStartNotes] = useState('');
  const [finalYield, setFinalYield] = useState('');

  const handleAddEntry = async () => {
    if (!observations.trim()) {
      toast.error('Las observaciones son requeridas');
      return;
    }

    // Validate numeric inputs
    const heightNum = height ? parseFloat(height) : undefined;
    const phNum = ph ? parseFloat(ph) : undefined;
    const ecNum = ec ? parseFloat(ec) : undefined;
    const tempNum = temperature ? parseFloat(temperature) : undefined;

    if (height && (isNaN(heightNum!) || heightNum! < 0 || heightNum! > 500)) {
      toast.error('Altura inválida (0-500 cm)');
      return;
    }

    if (ph && (isNaN(phNum!) || phNum! < 0 || phNum! > 14)) {
      toast.error('pH inválido (0-14)');
      return;
    }

    if (ec && (isNaN(ecNum!) || ecNum! < 0 || ecNum! > 10)) {
      toast.error('EC inválida (0-10 mS/cm)');
      return;
    }

    if (temperature && (isNaN(tempNum!) || tempNum! < -10 || tempNum! > 60)) {
      toast.error('Temperatura inválida (-10 a 60°C)');
      return;
    }

    await addLogEntry({
      geneticId,
      date: new Date().toISOString(),
      stage,
      observations,
      height: heightNum,
      ph: phNum,
      ec: ecNum,
      temperature: tempNum,
    });

    setObservations('');
    setHeight('');
    setPh('');
    setEc('');
    setTemperature('');
  };

  const handleStartCultivation = (cultivationName: string) => {
    startCultivation(geneticId, startNotes, cultivationName);
    toast.success('Cultivo iniciado exitosamente');
    setStartNotes('');
    setShowNameModal(false);
  };

  const handleEndCultivation = () => {
    if (!finalYield) {
      toast.error('Ingresa el rendimiento final');
      return;
    }
    
    const yieldNum = parseFloat(finalYield);
    if (isNaN(yieldNum) || yieldNum < 0 || yieldNum > 10000) {
      toast.error('Rendimiento inválido (0-10000 gramos)');
      return;
    }
    
    endCultivation(geneticId, yieldNum);
    toast.success('Cultivo finalizado exitosamente');
    setFinalYield('');
  };

  return (
    <>
      <CultivationNameModal
        open={showNameModal}
        onClose={() => setShowNameModal(false)}
        onConfirm={handleStartCultivation}
        geneticName={genetic.name}
      />
      <div className="space-y-4">
        {!activeSession ? (
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Iniciar Cultivo
            </h3>
            <Button onClick={() => setShowNameModal(true)} className="w-full bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              Iniciar Cultivo
            </Button>
          </Card>
        ) : (
          <Card className="p-6 bg-gradient-card border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Square className="w-5 h-5 text-destructive" />
            Finalizar Cultivo
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="finalYield">Rendimiento Final (gramos)</Label>
              <Input
                id="finalYield"
                type="number"
                value={finalYield}
                onChange={(e) => setFinalYield(e.target.value)}
                placeholder="ej: 450"
                className="bg-background border-border"
              />
            </div>
            <Button onClick={handleEndCultivation} variant="destructive" className="w-full">
              <Square className="w-4 h-4 mr-2" />
              Finalizar Cultivo
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-card border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Nueva Entrada
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="stage">Etapa</Label>
            <Select value={stage} onValueChange={(v: any) => setStage(v)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="germination">Germinación</SelectItem>
                <SelectItem value="vegetative">Vegetativa</SelectItem>
                <SelectItem value="flowering">Floración</SelectItem>
                <SelectItem value="harvest">Cosecha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Describe lo que observas..."
              className="bg-background border-border"
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="ej: 45"
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="ph">pH</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                placeholder="ej: 6.5"
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="ec">EC (mS/cm)</Label>
              <Input
                id="ec"
                type="number"
                step="0.1"
                value={ec}
                onChange={(e) => setEc(e.target.value)}
                placeholder="ej: 1.8"
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="temperature">Temp (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="ej: 24"
                className="bg-background border-border"
              />
            </div>
          </div>

          <Button onClick={handleAddEntry} className="w-full bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Entrada
          </Button>
        </div>
      </Card>
    </div>
    </>
  );
};
