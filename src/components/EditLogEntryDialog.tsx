import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogEntry } from '@/types/genetics';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EditLogEntryDialogProps {
  entry: LogEntry;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditLogEntryDialog = ({ entry, open, onClose, onSuccess }: EditLogEntryDialogProps) => {
  const [date, setDate] = useState<Date>(new Date(entry.date));
  const [stage, setStage] = useState(entry.stage);
  const [observations, setObservations] = useState(entry.observations || '');
  const [height, setHeight] = useState(entry.height?.toString() || '');
  const [ph, setPh] = useState(entry.ph?.toString() || '');
  const [ec, setEc] = useState(entry.ec?.toString() || '');
  const [temperature, setTemperature] = useState(entry.temperature?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!observations.trim()) {
      toast.error('Las observaciones son requeridas');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('log_entries')
        .update({
          date: date.toISOString(),
          stage,
          observations,
          height: height ? parseFloat(height) : null,
          ph: ph ? parseFloat(ph) : null,
          ec: ec ? parseFloat(ec) : null,
          temperature: temperature ? parseFloat(temperature) : null,
        })
        .eq('id', entry.id);

      if (error) throw error;

      toast.success('Entrada actualizada');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Error al actualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta entrada?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('log_entries').delete().eq('id', entry.id);
      if (error) throw error;

      toast.success('Entrada eliminada');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Error al eliminar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Entrada</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fecha</Label>
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Etapa</Label>
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

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Describe lo que observas..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="ej: 45"
              />
            </div>
            <div className="space-y-2">
              <Label>pH</Label>
              <Input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                placeholder="ej: 6.5"
              />
            </div>
            <div className="space-y-2">
              <Label>EC (mS/cm)</Label>
              <Input
                type="number"
                step="0.1"
                value={ec}
                onChange={(e) => setEc(e.target.value)}
                placeholder="ej: 1.8"
              />
            </div>
            <div className="space-y-2">
              <Label>Temp (°C)</Label>
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="ej: 24"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="destructive" onClick={handleDelete} disabled={loading} className="w-full sm:w-auto">
            Eliminar
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 sm:flex-none">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1 sm:flex-none">
              Guardar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
