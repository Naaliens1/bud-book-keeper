import { useState } from 'react';
import { useGenetics } from '@/contexts/GeneticsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Calendar, Droplets, Zap, Thermometer, Ruler, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EditLogEntryDialog } from '@/components/EditLogEntryDialog';
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

export const AllLogEntries = () => {
  const { logEntries, genetics, sessions, deleteLogEntry } = useGenetics();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<LogEntry | null>(null);

  const stageLabels: Record<string, string> = {
    germination: 'Germinación',
    vegetative: 'Vegetativa',
    flowering: 'Floración',
    harvest: 'Cosecha',
  };

  const getSessionInfo = (geneticId: string) => {
    const session = sessions.find(s => s.geneticId === geneticId && !s.endDate);
    return session;
  };

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    await deleteLogEntry(deletingEntry.id);
    setDeletingEntry(null);
  };

  const filteredEntries = logEntries.filter(entry => {
    const genetic = genetics.find(g => g.id === entry.geneticId);
    const session = getSessionInfo(entry.geneticId);
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      genetic?.name.toLowerCase().includes(searchLower) ||
      entry.observations?.toLowerCase().includes(searchLower) ||
      session?.cultivationName?.toLowerCase().includes(searchLower);
    
    const matchesStage = filterStage === 'all' || entry.stage === filterStage;
    
    return matchesSearch && matchesStage;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Entradas de Bitácora</h1>
              <p className="text-sm text-muted-foreground">{logEntries.length} registros</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por genética u observaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="germination">Germinación</SelectItem>
                <SelectItem value="vegetative">Vegetativa</SelectItem>
                <SelectItem value="flowering">Floración</SelectItem>
                <SelectItem value="harvest">Cosecha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {sortedEntries.map(entry => {
              const genetic = genetics.find(g => g.id === entry.geneticId);
              const session = getSessionInfo(entry.geneticId);
              if (!genetic) return null;

              return (
                <Card key={entry.id} className="p-4 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">
                          {session?.cultivationName || genetic.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{genetic.bank}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">
                          {stageLabels[entry.stage]}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEntry(entry)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingEntry(entry)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(entry.date), "dd MMM yyyy, HH:mm", { locale: es })}</span>
                    </div>

                    {entry.observations && (
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {entry.observations}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {entry.height && (
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded">
                          <Ruler className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Altura:</span>
                          <span className="font-medium">{entry.height} cm</span>
                        </div>
                      )}
                      {entry.ph && (
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded">
                          <Droplets className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">pH:</span>
                          <span className="font-medium">{entry.ph}</span>
                        </div>
                      )}
                      {entry.ec && (
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded">
                          <Zap className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">EC:</span>
                          <span className="font-medium">{entry.ec} mS/cm</span>
                        </div>
                      )}
                      {entry.temperature && (
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded">
                          <Thermometer className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Temp:</span>
                          <span className="font-medium">{entry.temperature}°C</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            {sortedEntries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron entradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};