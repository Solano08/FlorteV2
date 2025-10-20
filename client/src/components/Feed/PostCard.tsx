import { useRef, useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/utils";
import { endpoints, handleResponse } from "../../lib/api";
import { useToast } from "../ui/use-toast";
import type { FeedComment, FeedPost } from "../../types/feed";

interface PostCardProps {
  post: FeedPost;
}

const reactionOptions = [
  { key: "me_gusta", label: "Me gusta", icon: Heart, color: "text-red-500" },
  { key: "apoyo", label: "Apoyo", icon: ThumbsUp, color: "text-blue-500" },
  { key: "divertido", label: "Divertido", icon: Laugh, color: "text-yellow-500" },
  { key: "triste", label: "Triste", icon: Frown, color: "text-slate-500" },
  { key: "enojado", label: "Enojado", icon: Angry, color: "text-orange-500" },
];

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [reactions, setReactions] = useState(post.reactions);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [isReactionLoading, setIsReactionLoading] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments.totalCount);

  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState<File | null>(null);
  const commentFileInput = useRef<HTMLInputElement | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const initials = getInitials(post.author.name);

  const activeReaction = reactionOptions.find((option) => option.key === reactions.userReaction);

  const toggleComments = async () => {
    if (!commentsOpen && !commentsLoaded) {
      await fetchComments();
    }
    setCommentsOpen((prev) => !prev);
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await fetch(endpoints.postComments(post.id));
      const data = await handleResponse(response) as { comments: FeedComment[] };
      setComments(data.comments);
      setCommentsLoaded(true);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "No se pudieron cargar los comentarios.";
      toast({
        variant: "destructive",
        title: "Error al cargar comentarios",
        description,
      });
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleReaction = async (reactionKey: string) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Inicia sesion para reaccionar",
        description: "Debes iniciar sesion antes de interactuar con el contenido.",
      });
      return;
    }

    if (isReactionLoading) return;

    setIsReactionLoading(true);
    try {
      const response = await fetch(endpoints.postReactions(post.id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: user.id,
          tipo: reactionKey,
        }),
      });

      const data = await handleResponse(response) as {
        reactions: { totals: Record<string, number>; totalCount: number; userReaction: string | null };
      };
      setReactions(data.reactions);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "No se pudo registrar la reaccion.";
      toast({
        variant: "destructive",
        title: "Error al reaccionar",
        description,
      });
    } finally {
      setIsReactionLoading(false);
      setShowReactionMenu(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Inicia sesion para comentar",
        description: "Debes iniciar sesion antes de comentar.",
      });
      return;
    }

    if (!commentText.trim() && !commentFile) {
      toast({
        variant: "destructive",
        title: "Comentario vacio",
        description: "Escribe un mensaje o adjunta una imagen para comentar.",
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      const formData = new FormData();
      formData.append("usuarioId", String(user.id));
      formData.append("contenido", commentText.trim());
      if (commentFile) {
        formData.append("media", commentFile);
      }

      const response = await fetch(endpoints.postComments(post.id), {
        method: "POST",
        body: formData,
      });

      const data = await handleResponse(response) as {
        comment: FeedComment;
        totalCount: number;
      };

      setComments((prev) => [...prev, data.comment]);
      setCommentCount(data.totalCount);
      setCommentText("");
      setCommentFile(null);
      if (commentFileInput.current) {
        commentFileInput.current.value = "";
      }
      if (!commentsOpen) {
        setCommentsOpen(true);
      }
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "No se pudo publicar el comentario.";
      toast({
        variant: "destructive",
        title: "Error al comentar",
        description,
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;
    if (post.type === "video") {
      return (
        <video
          src={post.mediaUrl}
          controls
          className="w-full rounded-lg border border-border/60"
        />
      );
    }
    if (post.type === "imagen") {
      return (
        <img
          src={post.mediaUrl}
          alt="Adjunto de la publicacion"
          className="w-full rounded-lg border border-border/60 object-cover"
        />
      );
    }
    return null;
  };

  return (
    <Card className="p-5 shadow-hover-effect space-y-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {post.author.avatarUrl ? (
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
          ) : (
            <AvatarFallback className="bg-muted">{initials || "FL"}</AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
            {post.project && (
              <Link
                to={`/proyectos/${post.project.id}`}
                className="text-xs text-primary hover:underline"
              >
                Ver proyecto
              </Link>
            )}
          </div>

          {post.content && (
            <p className="mt-3 text-sm whitespace-pre-line">{post.content}</p>
          )}

          {renderMedia() && <div className="mt-3">{renderMedia()}</div>}
        </div>
      </div>

      {reactions.totalCount > 0 && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          <span>{reactions.totalCount} reacciones</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-3">
        <div
          className="relative"
          onMouseEnter={() => setShowReactionMenu(true)}
          onMouseLeave={() => setShowReactionMenu(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 ${activeReaction ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            disabled={isReactionLoading}
            onClick={() => handleReaction(activeReaction?.key ?? "me_gusta")}
          >
            {isReactionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : activeReaction ? (
              <activeReaction.icon className={`h-4 w-4 ${activeReaction.color}`} />
            ) : (
              <Heart className="h-4 w-4" />
            )}
            {activeReaction ? activeReaction.label : "Reaccionar"}
          </Button>

          {showReactionMenu && (
            <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-full border border-border bg-card p-2 shadow-lg">
              {reactionOptions.map((reaction) => {
                const Icon = reaction.icon;
                return (
                  <button
                    key={reaction.key}
                    type="button"
                    onClick={() => handleReaction(reaction.key)}
                    className="rounded-full p-2 transition-transform hover:scale-125"
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
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comentarios ({commentCount})
        </Button>

        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>

      {commentsOpen && (
        <div className="space-y-4 border-t pt-4">
          {commentsLoading ? (
            <p className="text-sm text-muted-foreground">Cargando comentarios...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => {
                const commentInitials = getInitials(comment.author.name);
                return (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      {comment.author.avatarUrl ? (
                        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                      ) : (
                        <AvatarFallback className="bg-muted text-xs">
                          {commentInitials || "FL"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-muted/60 p-3">
                      <p className="text-sm font-semibold">{comment.author.name}</p>
                      {comment.content && (
                        <p className="text-sm text-foreground">{comment.content}</p>
                      )}
                      {comment.mediaUrl && (
                        <img
                          src={comment.mediaUrl}
                          alt="Adjunto del comentario"
                          className="mt-2 max-h-48 w-full rounded-md object-cover"
                        />
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Se el primero en comentar.</p>
          )}

          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              {user?.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.nombre_completo ?? ""} />
              ) : (
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {getInitials(user?.nombre_completo ?? user?.correo ?? "TU")}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Escribe un comentario..."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="min-h-[80px] resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    ref={commentFileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setCommentFile(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => commentFileInput.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Imagen
                  </Button>
                  {commentFile && (
                    <span className="text-xs text-muted-foreground">{commentFile.name}</span>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleCommentSubmit}
                  disabled={isSubmittingComment}
                >
                  {isSubmittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publicar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
