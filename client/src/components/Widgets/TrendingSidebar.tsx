import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { getInitials } from "../../lib/utils";

type Trend = { tag: string; posts: number };
type Suggestion = { id: number; name: string; role: string };
type MutualConnection = { id: number; name: string; role: string; isOnline: boolean };

interface TrendingSidebarProps {
  trends?: Trend[];
  suggestions?: Suggestion[];
  mutualConnections?: MutualConnection[];
  isLoading?: boolean;
}

const TrendingSidebar = ({
  trends = [],
  suggestions = [],
  mutualConnections = [],
  isLoading,
}: TrendingSidebarProps) => {
  const renderTrendSkeletons = () =>
    Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={`trend-skeleton-${index}`} className="h-5 w-full" />
    ));

  const renderSuggestionSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <div key={`suggestion-skeleton-${index}`} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-7 w-16" />
      </div>
    ));

  const renderMutualSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <div key={`mutual-skeleton-${index}`} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>
    ));

  return (
    <div className="space-y-4">
      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Tendencias</h3>
        <div className="space-y-3">
          {isLoading
            ? renderTrendSkeletons()
            : trends.map((trend) => (
                <div key={trend.tag} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-primary">{trend.tag}</span>
                  <span className="text-xs text-muted-foreground">{trend.posts} posts</span>
                </div>
              ))}
        </div>
      </Card>

      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Personas que podrias conocer</h3>
        <div className="space-y-3">
          {isLoading
            ? renderSuggestionSkeletons()
            : suggestions.map((person) => {
                const initials = getInitials(person.name);
                return (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.role}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                      Seguir
                    </Button>
                  </div>
                );
              })}
        </div>
      </Card>

      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Conexiones mutuas</h3>
        <div className="space-y-3">
          {isLoading
            ? renderMutualSkeletons()
            : mutualConnections.map((person) => (
                <div key={person.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {person.isOnline && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                    <p className="text-sm font-medium">{person.name}</p>
                  </div>
                  {person.role && (
                    <span className="text-xs text-muted-foreground">{person.role}</span>
                  )}
                </div>
              ))}
          {!isLoading && mutualConnections.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Aun no tienes conexiones mutuas activas.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TrendingSidebar;
