import { Card } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Image, FileText, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/utils";

const CreatePost = () => {
  const { user } = useAuth();
  const initials = getInitials(user?.nombre_completo ?? user?.correo ?? "");
  const [firstName] = user?.nombre_completo
    ? user.nombre_completo.trim().split(/\s+/)
    : [];
  const placeholder = firstName
    ? `¿Qué estás pensando, ${firstName}?`
    : "¿Qué estás pensando?";

  return (
    <Card className="p-4 shadow-hover-effect">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          {user?.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt={user.nombre_completo} />
          ) : (
            <AvatarFallback className="bg-muted">{initials || "FL"}</AvatarFallback>
          )}
        </Avatar>
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Image className="h-4 w-4 mr-1" />
          Foto/Video
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <FileText className="h-4 w-4 mr-1" />
          Artículo
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Heart className="h-4 w-4 mr-1" />
          Sentimiento
        </Button>
      </div>
    </Card>
  );
};

export default CreatePost;
