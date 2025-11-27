import { useState } from 'react';
import { useGenetics } from '@/contexts/GeneticsContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sprout, Leaf, Flower, Package, Edit, Trash2 } from 'lucide-react';
import { EditLogEntryDialog } from './EditLogEntryDialog';
import { LogEntry } from '@/types/genetics';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LogTimelineProps {
  geneticId: string;
}

const stageIcons = {
  germination: Sprout,
  vegetative: Leaf,
  flowering: Flower,
  harvest: Package,
};

const stageLabels = {
  germination: 'Germinación',
  vegetative: 'Vegetativa',
  flowering: 'Floración',
  harvest: 'Cosecha',
};

const stageColors = {
  germination: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  vegetative: 'bg-green-500/20 text-green-400 border-green-500/30',
  flowering: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  harvest: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export const LogTimeline = ({ geneticId }: LogTimelineProps) => {
  const { getLogsByGenetic, deleteLogEntry } = useGenetics();
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<LogEntry | null>(null);

  const logs = getLogsByGenetic(geneticId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    await deleteLogEntry(deletingEntry.id);
    setDeletingEntry(null);
  };

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-card border-border/50">
        <p className="text-muted-foreground">No hay entradas en la bitácora aún</p>
        <p className="text-sm text-muted-foreground mt-2">Agrega tu primera entrada arriba</p>
      </Card>
    );
  }

  return (
    <>
      {editingEntry && (
        <EditLogEntryDialog
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(open) => !open && setEditingEntry(null)}
        />
      )}

      <AlertDialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar entrada?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta entrada de la bitácora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Historial de Cultivo</h3>
        {logs.map((log, index) => {
          const Icon = stageIcons[log.stage];
          return (
            <Card key={log.id} className="p-4 bg-gradient-card border-border/50 relative">
              {index !== logs.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-border" />
              )}
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge className={stageColors[log.stage]}>
                        {stageLabels[log.stage]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEntry(log)}
                        className="h-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingEntry(log)}
                        className="h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{log.observations}</p>
                  {(log.height || log.ph || log.ec || log.temperature) && (
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      {log.height && (
                        <div className="bg-background/50 px-3 py-2 rounded">
                          <span className="text-muted-foreground">Altura:</span>{' '}
                          <span className="font-semibold text-foreground">{log.height} cm</span>
                        </div>
                      )}
                      {log.ph && (
                        <div className="bg-background/50 px-3 py-2 rounded">
                          <span className="text-muted-foreground">pH:</span>{' '}
                          <span className="font-semibold text-foreground">{log.ph}</span>
                        </div>
                      )}
                      {log.ec && (
                        <div className="bg-background/50 px-3 py-2 rounded">
                          <span className="text-muted-foreground">EC:</span>{' '}
                          <span className="font-semibold text-foreground">{log.ec} mS/cm</span>
                        </div>
                      )}
                      {log.temperature && (
                        <div className="bg-background/50 px-3 py-2 rounded">
                          <span className="text-muted-foreground">Temp:</span>{' '}
                          <span className="font-semibold text-foreground">{log.temperature}°C</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};