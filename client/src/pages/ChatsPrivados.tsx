import { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";

const ChatsPrivados = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const chats = [
    {
      id: 1,
      name: "Carlos Méndez",
      initials: "CM",
      lastMessage: "¿Cómo va el proyecto?",
      time: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "María Rodríguez",
      initials: "MR",
      lastMessage: "Perfecto, gracias!",
      time: "Ayer",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Juan Pérez",
      initials: "JP",
      lastMessage: "Nos vemos mañana",
      time: "Ayer",
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: "Laura García",
      initials: "LG",
      lastMessage: "Excelente presentación!",
      time: "Lunes",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Carlos Méndez",
      content: "Hola! ¿Cómo estás?",
      time: "10:15 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "Tú",
      content: "¡Hola Carlos! Todo bien, gracias. ¿Y tú?",
      time: "10:20 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Carlos Méndez",
      content: "Muy bien! Quería preguntarte sobre el proyecto de React que estamos desarrollando.",
      time: "10:25 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Carlos Méndez",
      content: "¿Cómo va el proyecto?",
      time: "10:30 AM",
      isOwn: false,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-180px)] overflow-hidden glass-effect">
          <div className="grid grid-cols-12 h-full">
            {/* Lista de conversaciones */}
            <div className="col-span-4 border-r border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold mb-3">Chats</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversaciones..."
                    className="pl-10 glass-input"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100%-120px)]">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-accent/50 ${
                      selectedChat === chat.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {chat.initials}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold truncate">{chat.name}</p>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Área de chat */}
            <div className="col-span-8 flex flex-col">
              {/* Header del chat */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      CM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Carlos Méndez</p>
                    <p className="text-xs text-muted-foreground">En línea</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-accent">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-accent">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-accent">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Mensajes */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } rounded-2xl px-4 py-2 shadow-sm`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.isOwn
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-accent">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="glass-input pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                    >
                      <Smile className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    size="icon"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatsPrivados;
