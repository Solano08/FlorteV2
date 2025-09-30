import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Heart, MessageCircle, Share2, Image, Send, ThumbsUp, Laugh, Angry, Frown } from "lucide-react";
import { toast } from "sonner";

interface PostCardProps {
  author: string;
  initials: string;
  date: string;
  content: string;
  hasImage?: boolean;
}

const PostCard = ({ author, initials, date, content, hasImage }: PostCardProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionCount, setReactionCount] = useState(24);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "María López",
      initials: "ML",
      content: "¡Excelente trabajo! Me encantaría saber más sobre cómo implementaron las APIs.",
      date: "Hace 2 horas"
    }
  ]);

  const reactions = [
    { icon: Heart, label: "Me gusta", color: "text-red-500" },
    { icon: ThumbsUp, label: "Apoyo", color: "text-blue-500" },
    { icon: Laugh, label: "Divertido", color: "text-yellow-500" },
    { icon: Frown, label: "Triste", color: "text-gray-500" },
    { icon: Angry, label: "Enojado", color: "text-orange-500" },
  ];

  const handleReaction = (label: string) => {
    if (selectedReaction === label) {
      setSelectedReaction(null);
      setReactionCount(prev => prev - 1);
    } else {
      if (!selectedReaction) {
        setReactionCount(prev => prev + 1);
      }
      setSelectedReaction(label);
    }
    setShowReactions(false);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Tú",
        initials: "TU",
        content: comment,
        date: "Ahora"
      };
      setComments([...comments, newComment]);
      setComment("");
      toast.success("Comentario publicado");
    }
  };

  return (
    <Card className="p-4 shadow-hover-effect">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-muted">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{author}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      
      <p className="text-sm mb-3">{content}</p>
      
      {hasImage && (
        <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-3">
          <Image className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      
      {/* Contador de reacciones */}
      {reactionCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          <span>{reactionCount} reacciones</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={`text-muted-foreground hover:text-primary ${
              selectedReaction ? "text-primary" : ""
            }`}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
            onClick={() => handleReaction("Me gusta")}
          >
            <Heart
              className={`h-4 w-4 mr-1 ${
                selectedReaction ? "fill-primary" : ""
              }`}
            />
            {selectedReaction || "Me gusta"}
          </Button>

          {showReactions && (
            <div
              className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-full shadow-lg p-2 flex gap-1 z-10"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {reactions.map((reaction) => {
                const Icon = reaction.icon;
                return (
                  <button
                    key={reaction.label}
                    onClick={() => handleReaction(reaction.label)}
                    className="p-2 hover:scale-125 transition-transform"
                    title={reaction.label}
                  >
                    <Icon className={`h-5 w-5 ${reaction.color}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Comentar
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Share2 className="h-4 w-4 mr-1" />
          Compartir
        </Button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div className="mt-4 space-y-4">
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-xs">
                    {c.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <p className="text-sm font-semibold">{c.author}</p>
                  <p className="text-sm text-foreground">{c.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                TU
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Escribe un comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none glass-input"
              />
              <Button
                onClick={handleAddComment}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
