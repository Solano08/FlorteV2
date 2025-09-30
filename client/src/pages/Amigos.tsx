import Navbar from "../components/Layout/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Search, UserPlus, MessageCircle, MoreVertical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const Amigos = () => {
  const friends = [
    {
      initials: "CM",
      name: "Carlos Mendoza",
      role: "Frontend Developer",
      mutualFriends: 12,
      status: "Conectado",
      lastSeen: null,
    },
    {
      initials: "ML",
      name: "María López",
      role: "UX Designer",
      mutualFriends: 8,
      status: "Offline",
      lastSeen: "Hace 2 horas",
    },
    {
      initials: "JP",
      name: "Juan Pérez",
      role: "Backend Developer",
      mutualFriends: 15,
      status: "Conectado",
      lastSeen: null,
    },
    {
      initials: "LM",
      name: "Laura Martínez",
      role: "Project Manager",
      mutualFriends: 6,
      status: "Offline",
      lastSeen: "Hace 1 día",
    },
  ];

  const requests = [
    { initials: "PC", name: "Pedro Castro", role: "Data Scientist", mutualFriends: 3 },
    { initials: "SF", name: "Sofía Fernández", role: "Marketing Manager", mutualFriends: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Amigos</h1>
              <p className="text-muted-foreground">Gestiona tu red de conexiones profesionales</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Encontrar Amigos
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar amigos..."
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="friends" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="friends">Mis Amigos (4)</TabsTrigger>
              <TabsTrigger value="requests">Solicitudes (2)</TabsTrigger>
              <TabsTrigger value="suggestions">Sugerencias</TabsTrigger>
            </TabsList>

            <TabsContent value="friends">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <Card key={friend.initials} className="p-4 shadow-hover-effect">
                    <div className="flex items-start justify-between mb-3">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-muted text-xl">{friend.initials}</AvatarFallback>
                      </Avatar>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{friend.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{friend.role}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {friend.mutualFriends} amigos en común
                    </p>
                    
                    {friend.status === "Conectado" ? (
                      <p className="text-xs text-primary mb-3">Conectado</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mb-3">
                        Última vez: {friend.lastSeen}
                      </p>
                    )}
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mensaje
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((request) => (
                  <Card key={request.initials} className="p-4 shadow-hover-effect">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-muted text-xl">{request.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{request.name}</h3>
                        <p className="text-sm text-muted-foreground">{request.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.mutualFriends} amigos en común
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        Aceptar
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Rechazar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggestions">
              <p className="text-center text-muted-foreground py-12">
                No hay sugerencias disponibles en este momento
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Amigos;
