"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { liveChat } from '@/ai/flows/live-chat';
import { products as allProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Mic, MicOff, User } from 'lucide-react';

// Extend the Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const GeminiLiveChat = () => {
  const { cart } = useGame();
  const [isMounted, setIsMounted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const recognitionRef = useRef<any>(null); // SpeechRecognition instance
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUserQuery = useCallback(async (query: string) => {
    if (!query || isThinking) return;

    const userMessage = { role: 'user' as const, content: query };
    setChatHistory(prev => [...prev, userMessage]);
    setIsThinking(true);
    
    try {
      const cartItems = cart.map((item) => item.name);
      const productCatalog = allProducts.map(({ id, position, size, image, hint, ...rest }) => rest);
      
      const result = await liveChat({
        userQuery: query,
        cartItems,
        productCatalog,
        chatHistory: [...chatHistory, userMessage],
      });

      const modelMessage = { role: 'model' as const, content: result.response };
      setChatHistory(prev => [...prev, modelMessage]);

    } catch (e) {
      console.error(e);
      const errorMessage = { role: 'model' as const, content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsThinking(false);
    }
  }, [cart, chatHistory, isThinking]);

  useEffect(() => {
    if (!isMounted || !('webkitSpeechRecognition' in window)) {
      return;
    }
    if (recognitionRef.current) {
        return; // Already initialized
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; // Process single commands
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any /* SpeechRecognitionEvent */) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
       if (transcript) {
        handleUserQuery(transcript.trim());
      }
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (isListening) setIsListening(false);
    };

    recognition.onend = () => {
        if (isListening) {
             // Keep listening if the user wants to
            recognition.start();
        }
    }

    recognitionRef.current = recognition;
  }, [isMounted, isListening, handleUserQuery]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if (scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  }, [chatHistory, isThinking]);

  const handleMicClick = () => {
    const newIsListening = !isListening;
    setIsListening(newIsListening);
    if (newIsListening) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  };
  
  if (!isMounted) return null;
  
  if (!('webkitSpeechRecognition' in window)) {
    return (
      <div className="flex-shrink-0 p-4 border rounded-lg bg-muted">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Bot className="text-accent" />
          Gemini Live Chat
        </h3>
        <p className="text-sm text-muted-foreground">Sorry, voice chat is not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Bot className="text-accent" />
        Gemini Live Chat
      </h3>
      <ScrollArea className="flex-grow pr-4 -mr-4 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4">
            {chatHistory.length === 0 && !isListening && (
                <div className="text-center text-muted-foreground py-10">
                    <Bot size={48} className="mx-auto mb-2" />
                    <p>Click the mic to start talking to your shopping assistant.</p>
                </div>
            )}
            {chatHistory.map((chat, index) => (
                <div key={index} className={`flex items-start gap-3 ${chat.role === 'user' ? 'justify-end' : ''}`}>
                    {chat.role === 'model' && <Bot className="flex-shrink-0 text-primary" />}
                    <div className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${chat.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {chat.content}
                    </div>
                     {chat.role === 'user' && <User className="flex-shrink-0" />}
                </div>
            ))}
            {isThinking && (
                 <div className="flex items-start gap-3">
                    <Bot className="flex-shrink-0 text-primary" />
                    <div className="rounded-lg px-3 py-2 bg-muted">
                        <Loader2 className="animate-spin h-5 w-5" />
                    </div>
                </div>
            )}
        </div>
      </ScrollArea>
       <div className="flex flex-col items-center flex-shrink-0">
        <Button onClick={handleMicClick} size="lg" className="rounded-full w-16 h-16" variant={isListening ? 'destructive' : 'secondary'} disabled={isThinking}>
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
        </Button>
         <p className="text-sm text-muted-foreground mt-2 h-5">
            {isThinking ? "Thinking..." : isListening ? "Listening..." : (chatHistory.length > 0 ? "Mic is off" : "")}
         </p>
      </div>
    </div>
  );
};
