"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import type { Npc, ChatMessage } from '@/lib/types';

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
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if (scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  }, [chatHistory]);

  if (!npc) return null;

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] grid-rows-[auto_1fr_auto] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chat with {npc.name}</DialogTitle>
          <DialogDescription>{npc.personality}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow my-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    chat.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{chat.text}</p>
                </div>
              </div>
            ))}
            {isAiReplying && (
                <div className="flex items-end gap-2 justify-start">
                     <div className="max-w-[75%] rounded-lg px-4 py-2 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin" />
                     </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="!justify-start">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiReplying}
            />
            <Button type="submit" size="icon" onClick={handleSend} disabled={!message.trim() || isAiReplying}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
