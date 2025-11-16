import { useGenetics } from '@/contexts/GeneticsContext';
import { Card } from '@/components/ui/card';
import { Sprout, Calendar, TrendingUp, Award } from 'lucide-react';

export const StatsOverview = () => {
  const { genetics, sessions, logEntries } = useGenetics();

  const activeCultivations = sessions.filter(s => !s.endDate).length;
  const totalCultivations = sessions.length;
  const totalLogs = logEntries.length;
  const completedCultivations = sessions.filter(s => s.endDate).length;

  const stats = [
    {
      icon: Sprout,
      label: 'Cultivos Activos',
      value: activeCultivations,
      color: 'cannabis-green',
      bgColor: 'cannabis-green/10',
    },
    {
      icon: Calendar,
      label: 'Total Cultivos',
      value: totalCultivations,
      color: 'cannabis-purple',
      bgColor: 'cannabis-purple/10',
    },
    {
      icon: TrendingUp,
      label: 'Entradas de Bitácora',
      value: totalLogs,
      color: 'cannabis-accent',
      bgColor: 'cannabis-accent/10',
    },
    {
      icon: Award,
      label: 'Completados',
      value: completedCultivations,
      color: 'cannabis-green-light',
      bgColor: 'cannabis-green-light/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-5 bg-gradient-card border-border/50 hover:border-border transition-all duration-300 hover:shadow-soft animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-${stat.bgColor} border border-${stat.color}/20`}>
                <Icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
