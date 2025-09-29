import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import { FlorteButton } from "./../components/ui/florte-button";
import UserAvatar from "./../components/ui/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../components/ui/tabs";
import { Users, UserPlus, Search, MessageCircle, MoreHorizontal } from "lucide-react";
import { Input } from "./../components/ui/input";

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const friends = [
    {
      id: 1,
      name: "Carlos Mendoza",
      role: "Frontend Developer",
      avatar: "CM",
      mutualFriends: 12,
      online: true,
      lastSeen: "Ahora"
    },
    {
      id: 2,
      name: "María López",
      role: "UX Designer",
      avatar: "ML",
      mutualFriends: 8,
      online: false,
      lastSeen: "Hace 2 horas"
    },
    {
      id: 3,
      name: "Juan Pérez",
      role: "Backend Developer",
      avatar: "JP",
      mutualFriends: 15,
      online: true,
      lastSeen: "Ahora"
    },
    {
      id: 4,
      name: "Laura Martínez",
      role: "Project Manager",
      avatar: "LM",
      mutualFriends: 6,
      online: false,
      lastSeen: "Hace 1 día"
    }
  ];

  const friendRequests = [
    {
      id: 5,
      name: "Diego Ramírez",
      role: "Mobile Developer",
      avatar: "DR",
      mutualFriends: 3
    },
    {
      id: 6,
      name: "Sofia Herrera",
      role: "Data Scientist",
      avatar: "SH",
      mutualFriends: 7
    }
  ];

  const suggestions = [
    {
      id: 7,
      name: "Miguel Torres",
      role: "DevOps Engineer",
      avatar: "MT",
      mutualFriends: 5
    },
    {
      id: 8,
      name: "Ana Ruiz",
      role: "Full Stack Developer",
      avatar: "AR",
      mutualFriends: 9
    },
    {
      id: 9,
      name: "Roberto Silva",
      role: "Cybersecurity Specialist",
      avatar: "RS",
      mutualFriends: 4
    }
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Amigos</h1>
            <p className="text-muted-foreground">Gestiona tu red de conexiones profesionales</p>
          </div>
          <FlorteButton variant="florte">
            <UserPlus className="w-4 h-4 mr-2" />
            Encontrar Amigos
          </FlorteButton>
        </div>

        <Tabs defaultValue="friends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">Mis Amigos ({friends.length})</TabsTrigger>
            <TabsTrigger value="requests">Solicitudes ({friendRequests.length})</TabsTrigger>
            <TabsTrigger value="suggestions">Sugerencias</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-6">
            {/* Search */}
            <Card className="florte-card">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Buscar amigos..." 
                    className="pl-10 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Friends List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFriends.map((friend) => (
                <Card key={friend.id} className="florte-card">
                  <CardContent className="p-6 text-center">
                    <UserAvatar
                      src=""
                      alt={friend.name}
                      fallback={friend.avatar}
                      size="lg"
                      className="mx-auto mb-4"
                      online={friend.online}
                    />
                    <h3 className="font-semibold text-card-foreground mb-1">{friend.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{friend.role}</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {friend.mutualFriends} amigos en común
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {friend.online ? "Conectado" : `Última vez: ${friend.lastSeen}`}
                    </p>
                    <div className="flex space-x-2">
                      <FlorteButton variant="florte" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Mensaje
                      </FlorteButton>
                      <FlorteButton variant="florte-outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </FlorteButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="florte-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-primary" />
                  Solicitudes de Amistad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <UserAvatar
                        src=""
                        alt={request.name}
                        fallback={request.avatar}
                        size="md"
                      />
                      <div>
                        <h4 className="font-medium text-card-foreground">{request.name}</h4>
                        <p className="text-sm text-muted-foreground">{request.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.mutualFriends} amigos en común
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <FlorteButton variant="florte" size="sm">
                        Aceptar
                      </FlorteButton>
                      <FlorteButton variant="florte-outline" size="sm">
                        Rechazar
                      </FlorteButton>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card className="florte-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Personas que podrías conocer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 border border-border/50 rounded-lg text-center">
                      <UserAvatar
                        src=""
                        alt={suggestion.name}
                        fallback={suggestion.avatar}
                        size="lg"
                        className="mx-auto mb-3"
                      />
                      <h4 className="font-medium text-card-foreground mb-1">{suggestion.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{suggestion.role}</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {suggestion.mutualFriends} amigos en común
                      </p>
                      <FlorteButton variant="florte-outline" size="sm" className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Agregar
                      </FlorteButton>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;