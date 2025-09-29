import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlorteButton } from "@/components/ui/florte-button";
import UserAvatar from "@/components/ui/user-avatar";
import { Users, Plus, Search, Settings, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

const Groups = () => {
  const myGroups = [
    {
      id: 1,
      name: "Desarrolladores SENA",
      description: "Espacio para compartir conocimientos sobre programación",
      members: 245,
      posts: 89,
      avatar: "DS",
      isAdmin: true
    },
    {
      id: 2,
      name: "React Developers",
      description: "Todo sobre React, hooks, componentes y más",
      members: 156,
      posts: 67,
      avatar: "RD",
      isAdmin: false
    },
    {
      id: 3,
      name: "UX/UI Design",
      description: "Diseño de interfaces y experiencia de usuario",
      members: 198,
      posts: 124,
      avatar: "UX",
      isAdmin: false
    }
  ];

  const suggestedGroups = [
    {
      id: 4,
      name: "JavaScript Avanzado",
      description: "Técnicas avanzadas de JavaScript",
      members: 312,
      posts: 45,
      avatar: "JS"
    },
    {
      id: 5,
      name: "Backend Developers",
      description: "Node.js, APIs, bases de datos",
      members: 267,
      posts: 78,
      avatar: "BD"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Grupos</h1>
            <p className="text-muted-foreground">Conecta con personas que comparten tus intereses</p>
          </div>
          <div className="flex items-center space-x-3">
            <FlorteButton variant="florte-outline">
              <Search className="w-4 h-4 mr-2" />
              Explorar
            </FlorteButton>
            <FlorteButton variant="florte">
              <Plus className="w-4 h-4 mr-2" />
              Crear Grupo
            </FlorteButton>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="florte-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar grupos..." 
                className="pl-10 bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Groups */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="florte-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Mis Grupos ({myGroups.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <UserAvatar
                        src=""
                        alt={group.name}
                        fallback={group.avatar}
                        size="lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-card-foreground">{group.name}</h3>
                          {group.isAdmin && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {group.members} miembros
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {group.posts} publicaciones
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {group.isAdmin && (
                        <FlorteButton variant="florte-ghost" size="icon">
                          <Settings className="w-4 h-4" />
                        </FlorteButton>
                      )}
                      <FlorteButton variant="florte-outline" size="sm">
                        Ver Grupo
                      </FlorteButton>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Suggested Groups */}
          <div className="space-y-6">
            <Card className="florte-card">
              <CardHeader>
                <CardTitle className="text-lg">Grupos Sugeridos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedGroups.map((group) => (
                  <div key={group.id} className="p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserAvatar
                        src=""
                        alt={group.name}
                        fallback={group.avatar}
                        size="md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground text-sm">{group.name}</h4>
                        <p className="text-xs text-muted-foreground">{group.members} miembros</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{group.description}</p>
                    <FlorteButton variant="florte-outline" size="sm" className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Unirse
                    </FlorteButton>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="florte-card">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{myGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Grupos Unidos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {myGroups.reduce((acc, group) => acc + group.members, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Conexiones Totales</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;