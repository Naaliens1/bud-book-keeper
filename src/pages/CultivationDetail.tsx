import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGenetics } from '@/contexts/GeneticsContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Leaf } from 'lucide-react';
import { LogEntryForm } from '@/components/LogEntryForm';
import { LogTimeline } from '@/components/LogTimeline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CultivationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sessions, genetics, getLogsByGenetic } = useGenetics();
  const [session, setSession] = useState<any>(null);
  const [genetic, setGenetic] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const foundSession = sessions.find(s => s.id === id);
    if (!foundSession) {
      navigate('/');
      return;
    }

    const foundGenetic = genetics.find(g => g.id === foundSession.geneticId);
    if (!foundGenetic) {
      navigate('/');
      return;
    }

    setSession(foundSession);
    setGenetic(foundGenetic);
  }, [id, sessions, genetics, navigate]);

  if (!session || !genetic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const logs = getLogsByGenetic(genetic.id);
  const duration = session.endDate
    ? Math.floor(
        (new Date(session.endDate).getTime() - new Date(session.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : Math.floor(
        (new Date().getTime() - new Date(session.startDate).getTime()) / (1000 * 60 * 60 * 24)
      );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">
              {session.cultivationName || genetic.name}
            </h1>
            <p className="text-sm text-muted-foreground">{genetic.bank}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Card */}
        <Card className="p-4 md:p-6 bg-gradient-card border-border/50">
          <div className="flex gap-4 items-start">
            <img
              src={genetic.image}
              alt={genetic.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={
                    session.endDate
                      ? 'bg-muted/50 text-muted-foreground border-border'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }
                >
                  {session.endDate ? 'Completado' : 'Activo'}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{duration} días</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Leaf className="w-3 h-3" />
                  <span>{logs.length} entradas</span>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Inicio: {format(new Date(session.startDate), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
                {session.endDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Fin: {format(new Date(session.endDate), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                )}
              </div>

              {session.notes && (
                <p className="text-sm text-foreground/80 leading-relaxed">{session.notes}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Log Entry Form - Only show if active */}
        {!session.endDate && (
          <LogEntryForm geneticId={genetic.id} genetic={genetic} />
        )}

        {/* Timeline */}
        <LogTimeline geneticId={genetic.id} />
      </div>
    </div>
  );
};
