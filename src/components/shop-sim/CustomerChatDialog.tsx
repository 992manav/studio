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
      const scrollableView = scrollAreaRef.current.querySelector("div");
      if (scrollableView) {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  }, [chatHistory]);

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
      <DialogContent className="sm:max-w-[480px] grid-rows-[auto_1fr_auto] flex flex-col h-[calc(100vh-4rem)] max-h-[600px] p-0 bg-background rounded-xl shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Avatar className="w-8 h-8 bg-muted text-primary-foreground font-bold">
              {npc.name[0]}
            </Avatar>
            Chat with {npc.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1">
            {npc.personality}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea
          className="flex-grow my-2 px-6 pr-4"
          ref={scrollAreaRef}
        >
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                {chat.sender !== "user" && (
                  <Avatar className="w-7 h-7 bg-muted text-primary-foreground font-bold">
                    {npc.name[0]}
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-md transition-all duration-200 text-sm ${
                    chat.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground mr-auto"
                  }`}
                  title={
                    chat.timestamp
                      ? new Date(chat.timestamp).toLocaleTimeString()
                      : ""
                  }
                >
                  <p>{chat.text}</p>
                </div>
                {chat.sender === "user" && (
                  <Avatar className="w-7 h-7 bg-primary text-primary-foreground font-bold">
                    U
                  </Avatar>
                )}
              </div>
            ))}
            {isAiReplying && (
              <div className="flex items-end gap-2 justify-start animate-fade-in">
                <Avatar className="w-7 h-7 bg-muted text-primary-foreground font-bold">
                  {npc.name[0]}
                </Avatar>
                <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-muted shadow-md">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="!justify-start px-6 pb-6 pt-2 bg-background sticky bottom-0">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-grow rounded-full px-4 py-2 border focus:ring-2 focus:ring-primary/50 transition-all"
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
              className="rounded-full shadow-md"
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
