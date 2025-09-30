import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

const TrendingSidebar = () => {
  const trends = [
    { tag: "#ReactJS", posts: 155 },
    { tag: "#SENA", posts: 89 },
    { tag: "#Desarrollo", posts: 67 },
    { tag: "#JavaScript", posts: 45 },
  ];

  const suggestions = [
    { name: "Carlos Mendoza", role: "Frontend Developer", initials: "CM" },
    { name: "María López", role: "UX Designer", initials: "ML" },
    { name: "Juan Pérez", role: "Backend Developer", initials: "JP" },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Tendencias</h3>
        <div className="space-y-3">
          {trends.map((trend) => (
            <div key={trend.tag} className="flex justify-between items-center">
              <span className="text-sm font-medium text-primary">{trend.tag}</span>
              <span className="text-xs text-muted-foreground">{trend.posts} posts</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Personas que podrías conocer</h3>
        <div className="space-y-3">
          {suggestions.map((person) => (
            <div key={person.initials} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-muted">{person.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.role}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                Conectar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TrendingSidebar;
