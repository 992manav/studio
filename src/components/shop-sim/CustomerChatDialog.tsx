"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Npc, ChatMessage } from "@/lib/types";

interface CustomerChatDialogProps {
  npc: Npc | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isAiReplying: boolean;
}

export const CustomerChatDialog = ({
  npc,
  isOpen,
  onOpenChange,
  chatHistory,
  onSendMessage,
  isAiReplying,
}: CustomerChatDialogProps) => {
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // The viewport is the first div child of the scroll area root
      const scrollableViewport = scrollAreaRef.current.querySelector("div");
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [chatHistory, isAiReplying]);

  if (!npc) return null;

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 flex flex-col h-[80vh] max-h-[600px]">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-muted text-primary-foreground font-bold flex items-center justify-center text-lg">
              {npc.name[0]}
            </Avatar>
            Chat with {npc.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm pt-1">
            {npc.personality}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
          <div className="space-y-4 p-6">
            {chatHistory.map((chat) => (
              <div
                key={chat.timestamp}
                className={`flex items-end gap-2 ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in duration-300`}
              >
                {chat.sender !== "user" && (
                  <Avatar className="w-7 h-7 bg-muted text-primary-foreground font-bold flex items-center justify-center text-xs shrink-0">
                    {npc.name[0]}
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                    chat.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                  title={new Date(chat.timestamp).toLocaleTimeString()}
                >
                  <p className="leading-relaxed">{chat.text}</p>
                </div>
                {chat.sender === "user" && (
                  <Avatar className="w-7 h-7 bg-accent text-accent-foreground font-bold flex items-center justify-center text-xs shrink-0">
                    U
                  </Avatar>
                )}
              </div>
            ))}
            {isAiReplying && (
              <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300">
                <Avatar className="w-7 h-7 bg-muted text-primary-foreground font-bold flex items-center justify-center text-xs shrink-0">
                  {npc.name[0]}
                </Avatar>
                <div className="max-w-[75%] rounded-2xl px-4 py-2.5 bg-muted shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="!justify-start p-4 border-t bg-background sticky bottom-0">
          <div className="flex w-full items-center space-x-3">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiReplying}
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || isAiReplying}
              className="rounded-full shadow-md shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};