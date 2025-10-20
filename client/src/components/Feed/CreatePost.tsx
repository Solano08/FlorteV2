import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Image as ImageIcon,
  Video,
  Loader2,
  X,
  Folder,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/utils";
import { endpoints, handleResponse } from "../../lib/api";
import { useToast } from "../ui/use-toast";

type ProjectOption = {
  id: number;
  title: string;
};

interface CreatePostProps {
  projects: ProjectOption[];
  defaultProjectId?: number;
  lockProject?: boolean;
}

const determinePostType = (file: File | null): "texto" | "imagen" | "video" => {
  if (!file) return "texto";
  if (file.type.startsWith("video/")) return "video";
  return "imagen";
};

const CreatePost = ({ projects, defaultProjectId, lockProject = false }: CreatePostProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId ? String(defaultProjectId) : ""
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initials = getInitials(user?.nombre_completo ?? user?.correo ?? "");
  const [firstName] = user?.nombre_completo
    ? user.nombre_completo.trim().split(/\s+/)
    : [];
  const placeholder = firstName
    ? `Que estas pensando, ${firstName}?`
    : "Que estas pensando?";

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("Debes iniciar sesion para publicar.");
      }

      if (!content.trim() && !mediaFile) {
        throw new Error("Agrega texto o un archivo para publicar.");
      }

      const formData = new FormData();
      formData.append("usuarioId", String(user.id));
      formData.append("contenido", content.trim());
      formData.append("tipo", determinePostType(mediaFile));

      if (selectedProjectId) {
        formData.append("proyectoId", selectedProjectId);
      }

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const response = await fetch(endpoints.posts, {
        method: "POST",
        body: formData,
      });

      return handleResponse(response);
    },
    onSuccess: () => {
      toast({
        title: "Publicacion creada",
        description: "Tu publicacion ahora es visible para la comunidad.",
      });
      setContent("");
      setMediaFile(null);
      setSelectedProjectId("");
      queryClient.invalidateQueries({ queryKey: ["feed", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", user?.id] });
    },
    onError: (error) => {
      const description =
        error instanceof Error ? error.message : "No se pudo crear la publicacion.";
      toast({
        variant: "destructive",
        title: "Error al publicar",
        description,
      });
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  useEffect(() => {
    if (defaultProjectId) {
      setSelectedProjectId(String(defaultProjectId));
    }
  }, [defaultProjectId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mutation.isPending) {
      mutation.mutate();
    }
  };

  return (
    <Card className="p-5 shadow-hover-effect">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.nombre_completo ?? ""} />
            ) : (
              <AvatarFallback className="bg-muted">{initials || "FL"}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={placeholder}
              className="min-h-[100px] resize-none"
            />

            <div className="flex flex-wrap gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                {mediaFile?.type.startsWith("video/") ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                {mediaFile ? "Cambiar archivo" : "Adjuntar foto o video"}
              </Button>

              {lockProject && selectedProjectId ? (
                <span className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Folder className="h-3.5 w-3.5" />
                  {projects.find((project) => String(project.id) === selectedProjectId)?.title ??
                    "Proyecto seleccionado"}
                </span>
              ) : (
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger className="w-[220px]">
                    <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Publicar en proyecto (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin proyecto</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContent((prev) => (prev ? `${prev} #` : "#"))}
              >
                <FileText className="h-4 w-4 mr-2" />
                Hashtag
              </Button>
            </div>

            {mediaFile && (
              <div className="flex items-center justify-between rounded-md border border-dashed border-border/60 px-3 py-2 text-sm">
                <span className="truncate">{mediaFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setMediaFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Publicando...
              </span>
            ) : (
              "Publicar"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePost;
