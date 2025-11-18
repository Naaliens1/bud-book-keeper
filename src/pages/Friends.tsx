import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, UserPlus, Users, Check, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const Friends = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const { data: friendsData } = await supabase.from('friendships').select('*').eq('user_id', user.id);
    const { data: receivedData } = await supabase.from('friend_requests').select('*').eq('receiver_id', user.id).eq('status', 'pending');
    const { data: sentData } = await supabase.from('friend_requests').select('*').eq('sender_id', user.id).eq('status', 'pending');
    setFriends(friendsData || []);
    setReceivedRequests(receivedData || []);
    setSentRequests(sentData || []);
  };

  const handleSendRequest = async () => {
    if (!user || !searchQuery.trim()) return;
    setLoading(true);
    try {
      const { data } = await supabase.from('profiles').select('id').eq('email', searchQuery.trim()).single();
      if (!data) { toast.error('Usuario no encontrado'); return; }
      await supabase.from('friend_requests').insert({ sender_id: user.id, receiver_id: data.id });
      toast.success('Solicitud enviada');
      setSearchQuery('');
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string, senderId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', requestId);
      await supabase.from('friendships').insert([{ user_id: user.id, friend_id: senderId }, { user_id: senderId, friend_id: user.id }]);
      toast.success('Aceptada');
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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