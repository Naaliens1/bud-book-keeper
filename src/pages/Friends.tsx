import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, UserPlus, Users, Send, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const Friends = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - reemplazar con datos reales de Supabase
  const friends = [];
  const pendingRequests = [];
  const sentRequests = [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Amigos y Red</h1>
            <p className="text-sm text-muted-foreground">Conecta con cultivadores</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios por email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              <Users className="w-4 h-4 mr-2" />
              Amigos
            </TabsTrigger>
            <TabsTrigger value="received">
              <UserPlus className="w-4 h-4 mr-2" />
              Recibidas
            </TabsTrigger>
            <TabsTrigger value="sent">
              <Send className="w-4 h-4 mr-2" />
              Enviadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-4 space-y-3">
            {friends.length === 0 && (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Aún no tienes amigos agregados</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Busca usuarios por email para enviar solicitudes
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-4 space-y-3">
            {pendingRequests.length === 0 && (
              <Card className="p-8 text-center">
                <UserPlus className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No tienes solicitudes pendientes</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4 space-y-3">
            {sentRequests.length === 0 && (
              <Card className="p-8 text-center">
                <Send className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No has enviado solicitudes</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};