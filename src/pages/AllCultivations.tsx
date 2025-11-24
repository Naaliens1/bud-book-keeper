import { useState } from 'react';
import { useGenetics } from '@/contexts/GeneticsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const AllCultivations = () => {
  const { sessions, genetics } = useGenetics();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('start-date');

  const filteredSessions = sessions.filter(session => {
    const genetic = genetics.find(g => g.id === session.geneticId);
    const searchLower = searchQuery.toLowerCase();
    return (
      genetic?.name.toLowerCase().includes(searchLower) ||
      session.cultivationName?.toLowerCase().includes(searchLower)
    );
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'start-date') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    if (sortBy === 'end-date') {
      if (!a.endDate && !b.endDate) return 0;
      if (!a.endDate) return -1;
      if (!b.endDate) return 1;
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
    if (sortBy === 'name') return (a.cultivationName || '').localeCompare(b.cultivationName || '');
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Todos los Cultivos</h1>
            <p className="text-sm text-muted-foreground">{sessions.length} total</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start-date">Fecha Inicio</SelectItem>
              <SelectItem value="end-date">Fecha Fin</SelectItem>
              <SelectItem value="name">Por Nombre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {sortedSessions.map(session => {
            const genetic = genetics.find(g => g.id === session.geneticId);
            if (!genetic) return null;

            return (
              <Card
                key={session.id || session.startDate}
                className="p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/cultivation/${session.id}`)}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={genetic.image}
                    alt={genetic.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">
                      {session.cultivationName || genetic.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{genetic.bank}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={session.endDate 
                          ? "bg-muted/50 text-muted-foreground border-border" 
                          : "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        {session.endDate ? 'Completado' : 'Activo'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.startDate).toLocaleDateString()}
                        {session.endDate && ` - ${new Date(session.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {sortedSessions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron cultivos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};