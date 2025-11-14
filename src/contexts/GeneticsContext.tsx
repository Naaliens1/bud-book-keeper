import React, { createContext, useContext, useState, useEffect } from 'react';
import { Genetic, LogEntry, CultivationSession } from '@/types/genetics';
import { genetics as initialGenetics } from '@/data/geneticsData';

interface GeneticsContextType {
  genetics: Genetic[];
  logEntries: LogEntry[];
  sessions: CultivationSession[];
  addLogEntry: (entry: Omit<LogEntry, 'id'>) => void;
  startCultivation: (geneticId: string, notes: string) => void;
  endCultivation: (geneticId: string, finalYield: number) => void;
  getLogsByGenetic: (geneticId: string) => LogEntry[];
  getSessionByGenetic: (geneticId: string) => CultivationSession | undefined;
}

const GeneticsContext = createContext<GeneticsContextType | undefined>(undefined);

export const GeneticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genetics] = useState<Genetic[]>(initialGenetics);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('cultivoLogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<CultivationSession[]>(() => {
    const saved = localStorage.getItem('cultivoSessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cultivoLogs', JSON.stringify(logEntries));
  }, [logEntries]);

  useEffect(() => {
    localStorage.setItem('cultivoSessions', JSON.stringify(sessions));
  }, [sessions]);

  const addLogEntry = (entry: Omit<LogEntry, 'id'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setLogEntries(prev => [...prev, newEntry]);
  };

  const startCultivation = (geneticId: string, notes: string) => {
    const newSession: CultivationSession = {
      geneticId,
      startDate: new Date().toISOString(),
      notes,
    };
    setSessions(prev => [...prev, newSession]);
  };

  const endCultivation = (geneticId: string, finalYield: number) => {
    setSessions(prev =>
      prev.map(session =>
        session.geneticId === geneticId && !session.endDate
          ? { ...session, endDate: new Date().toISOString(), finalYield }
          : session
      )
    );
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
        addLogEntry,
        startCultivation,
        endCultivation,
        getLogsByGenetic,
        getSessionByGenetic,
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
