import React, { createContext, useContext, useState, useEffect } from 'react';
import { Genetic, LogEntry, CultivationSession } from '@/types/genetics';
import { genetics as initialGenetics } from '@/data/geneticsData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GeneticsContextType {
  genetics: Genetic[];
  logEntries: LogEntry[];
  sessions: CultivationSession[];
  loading: boolean;
  addLogEntry: (entry: Omit<LogEntry, 'id'>) => Promise<void>;
  startCultivation: (geneticId: string, notes: string, cultivationName: string) => Promise<void>;
  endCultivation: (geneticId: string, finalYield: number) => Promise<void>;
  getLogsByGenetic: (geneticId: string) => LogEntry[];
  getSessionByGenetic: (geneticId: string) => CultivationSession | undefined;
  refreshData: () => Promise<void>;
}

const GeneticsContext = createContext<GeneticsContextType | undefined>(undefined);

export const GeneticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genetics] = useState<Genetic[]>(initialGenetics);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [sessions, setSessions] = useState<CultivationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshData = async () => {
    if (!user) {
      setLogEntries([]);
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('cultivation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (sessionsError) throw sessionsError;

      const { data: logsData, error: logsError } = await supabase
        .from('log_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (logsError) throw logsError;

      const mappedSessions: CultivationSession[] = (sessionsData || []).map(session => ({
        geneticId: session.genetic_id,
        startDate: session.start_date,
        endDate: session.end_date || undefined,
        notes: session.notes || '',
        finalYield: undefined,
        cultivationName: session.cultivation_name || undefined,
      }));

      const mappedLogs: LogEntry[] = (logsData || []).map(log => ({
        id: log.id,
        geneticId: log.session_id,
        date: log.date,
        stage: (log.stage as 'germination' | 'vegetative' | 'flowering' | 'harvest'),
        observations: log.observations || '',
        height: log.height ? Number(log.height) : undefined,
        ph: log.ph ? Number(log.ph) : undefined,
        ec: log.ec ? Number(log.ec) : undefined,
        temperature: log.temperature ? Number(log.temperature) : undefined,
      }));

      setSessions(mappedSessions);
      setLogEntries(mappedLogs);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al cargar datos",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    if (!user) return;

    const sessionsChannel = supabase
      .channel('cultivation_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cultivation_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setTimeout(() => refreshData(), 0);
        }
      )
      .subscribe();

    const logsChannel = supabase
      .channel('log_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'log_entries',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setTimeout(() => refreshData(), 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(logsChannel);
    };
  }, [user]);

  const addLogEntry = async (entry: Omit<LogEntry, 'id'>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para agregar entradas",
      });
      return;
    }

    try {
      const activeSession = sessions.find(s => s.geneticId === entry.geneticId && !s.endDate);
      
      if (!activeSession) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debes iniciar un cultivo primero",
        });
        return;
      }

      const { data: sessionData } = await supabase
        .from('cultivation_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('genetic_id', entry.geneticId)
        .is('end_date', null)
        .single();

      if (!sessionData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró la sesión activa",
        });
        return;
      }

      const { error } = await supabase.from('log_entries').insert({
        user_id: user.id,
        session_id: sessionData.id,
        date: entry.date,
        stage: entry.stage,
        observations: entry.observations,
        height: entry.height,
        ph: entry.ph,
        ec: entry.ec,
        temperature: entry.temperature,
      });

      if (error) throw error;

      toast({
        title: "Entrada agregada",
        description: "La entrada se agregó correctamente a la bitácora",
      });

      await refreshData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al agregar entrada",
        description: error.message,
      });
    }
  };

  const startCultivation = async (geneticId: string, notes: string, cultivationName: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para comenzar un cultivo",
      });
      return;
    }

    try {
      const { error } = await supabase.from('cultivation_sessions').insert({
        user_id: user.id,
        genetic_id: geneticId,
        start_date: new Date().toISOString(),
        notes,
        cultivation_name: cultivationName,
      });

      if (error) throw error;

      toast({
        title: "Cultivo iniciado",
        description: "El cultivo se ha iniciado correctamente",
      });

      await refreshData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al iniciar cultivo",
        description: error.message,
      });
    }
  };

  const endCultivation = async (geneticId: string, finalYield: number) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cultivation_sessions')
        .update({ end_date: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('genetic_id', geneticId)
        .is('end_date', null);

      if (error) throw error;

      toast({
        title: "Cultivo finalizado",
        description: "El cultivo se ha finalizado correctamente",
      });

      await refreshData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al finalizar cultivo",
        description: error.message,
      });
    }
  };

  const getLogsByGenetic = (geneticId: string) => {
    return logEntries.filter(log => log.geneticId === geneticId);
  };

  const getSessionByGenetic = (geneticId: string) => {
    return sessions.find(session => session.geneticId === geneticId && !session.endDate);
  };

  return (
    <GeneticsContext.Provider
      value={{
        genetics,
        logEntries,
        sessions,
        loading,
        addLogEntry,
        startCultivation,
        endCultivation,
        getLogsByGenetic,
        getSessionByGenetic,
        refreshData,
      }}
    >
      {children}
    </GeneticsContext.Provider>
  );
};

export const useGenetics = () => {
  const context = useContext(GeneticsContext);
  if (!context) {
    throw new Error('useGenetics must be used within GeneticsProvider');
  }
  return context;
};
