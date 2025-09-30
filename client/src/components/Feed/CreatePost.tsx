import { Card } from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Image, FileText, Heart } from "lucide-react";

const CreatePost = () => {
  return (
    <Card className="p-4 shadow-hover-effect">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-muted">AG</AvatarFallback>
        </Avatar>
        <input
          type="text"
          placeholder="¿Qué estás pensando?"
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
