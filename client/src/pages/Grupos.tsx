import Navbar from "../components/Layout/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Search, Plus, Users, Settings } from "lucide-react";

const Grupos = () => {
  const myGroups = [
    {
      initials: "DS",
      name: "Desarrolladores SENA",
      badge: "Admin",
      description: "Espacio para compartir conocimientos sobre programación",
      members: 245,
      posts: 89,
    },
    {
      initials: "RD",
      name: "React Developers",
      description: "Todo sobre React, hooks, componentes y más",
      members: 156,
      posts: 67,
    },
    {
      initials: "UX",
      name: "UX/UI Design",
      description: "Diseño de interfaces y experiencia de usuario",
      members: 198,
      posts: 124,
    },
  ];

  const suggestedGroups = [
    { initials: "JS", name: "JavaScript Avanzado", members: 312, description: "Técnicas avanzadas de JavaScript" },
    { initials: "BD", name: "Backend Developers", members: 267, description: "Node.js, APIs, bases de datos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Grupos</h1>
              <p className="text-muted-foreground">Conecta con personas que comparten tus intereses</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Explorar
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Crear Grupo
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar grupos..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Mis Grupos ({myGroups.length})</h2>
                </div>

                <div className="space-y-3">
                  {myGroups.map((group) => (
                    <Card key={group.initials} className="p-4 shadow-hover-effect">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-muted text-lg">{group.initials}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{group.name}</h3>
                            {group.badge && (
                              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                                {group.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{group.members} miembros</span>
                            <span>{group.posts} publicaciones</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-primary border-primary">
                            Ver Grupo
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-4 shadow-hover-effect">
                <h3 className="font-semibold mb-3">Grupos Sugeridos</h3>
                <div className="space-y-3">
                  {suggestedGroups.map((group) => (
                    <div key={group.initials} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted">{group.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.members} miembros</p>
                          <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full text-primary border-primary">
                        <Plus className="h-3 w-3 mr-1" />
                        Unirse
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 shadow-hover-effect">
                <h3 className="font-semibold mb-3">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">Grupos Unidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">599</p>
                    <p className="text-sm text-muted-foreground">Conexiones Totales</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grupos;
