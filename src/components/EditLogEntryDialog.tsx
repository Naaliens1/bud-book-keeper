import { useState, useEffect } from 'react';
import { LogEntry } from '@/types/genetics';
import { useGenetics } from '@/contexts/GeneticsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EditLogEntryDialogProps {
  entry: LogEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditLogEntryDialog = ({ entry, open, onOpenChange }: EditLogEntryDialogProps) => {
  const { updateLogEntry } = useGenetics();
  const [date, setDate] = useState<Date>(new Date(entry.date));
  const [stage, setStage] = useState(entry.stage);
  const [observations, setObservations] = useState(entry.observations || '');
  const [height, setHeight] = useState(entry.height?.toString() || '');
  const [ph, setPh] = useState(entry.ph?.toString() || '');
  const [ec, setEc] = useState(entry.ec?.toString() || '');
  const [temperature, setTemperature] = useState(entry.temperature?.toString() || '');

  useEffect(() => {
    setDate(new Date(entry.date));
    setStage(entry.stage);
    setObservations(entry.observations || '');
    setHeight(entry.height?.toString() || '');
    setPh(entry.ph?.toString() || '');
    setEc(entry.ec?.toString() || '');
    setTemperature(entry.temperature?.toString() || '');
  }, [entry]);

  const handleSave = async () => {
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

    await updateLogEntry(entry.id, {
      date: date.toISOString(),
      stage: stage as 'germination' | 'vegetative' | 'flowering' | 'harvest',
      observations,
      height: heightNum,
      ph: phNum,
      ec: ecNum,
      temperature: tempNum,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Entrada</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="stage">Etapa</Label>
            <Select value={stage} onValueChange={(v: any) => setStage(v)}>
              <SelectTrigger>
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
              rows={4}
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
                placeholder="0-500"
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
                placeholder="0-14"
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
                placeholder="0-10"
              />
            </div>
            <div>
              <Label htmlFor="temperature">Temp (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="-10 a 60"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};