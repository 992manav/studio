
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { liveChat } from '@/ai/flows/live-chat';
import { products as allProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Mic, MicOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AudioPulse from '@/components/audio-pulse/AudioPulse';

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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const recognitionRef = useRef<any>(null); // SpeechRecognition instance
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use a ref to keep track of the latest chat history for the API call,
  // preventing stale closures in the handleUserQuery callback.
  const chatHistoryRef = useRef(chatHistory);
  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  useEffect(() => {
    setIsMounted(true);
    // Create audio element once mounted on client
    audioRef.current = new Audio();
  }, []);

  const handleUserQuery = useCallback(async (query: string) => {
    if (!query || isThinking) return;

    setIsListening(false);
    setIsThinking(true);
    
    const userMessage = { role: 'user' as const, content: query };
    const newHistoryWithUser = [...chatHistoryRef.current, userMessage];
    setChatHistory(newHistoryWithUser);
    
    try {
      const cartItems = cart.map((item) => item.name);
      // We pass the full product catalog, excluding only the image and hint,
      // to give the AI context about product details, price, and location.
      const productCatalog = allProducts.map(({ image, hint, ...rest }) => rest);
      
      const result = await liveChat({
        userQuery: query,
        cartItems,
        productCatalog,
        chatHistory: newHistoryWithUser,
      });

      const modelMessage = { role: 'model' as const, content: result.response };
      setChatHistory(prevHistory => [...prevHistory, modelMessage]);
      
      if (result.audioDataUri && audioRef.current) {
          audioRef.current.src = result.audioDataUri;
          audioRef.current.play();
          setIsPlayingAudio(true);
      }

    } catch (e) {
      console.error("Live Chat API failed:", e);
      const errorMessage = { role: 'model' as const, content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setChatHistory(prevHistory => [...prevHistory, errorMessage]);
    } finally {
        setIsThinking(false);
    }
  }, [cart, isThinking, toast]);

  useEffect(() => {
    if (audioRef.current) {
        const handleAudioEnd = () => setIsPlayingAudio(false);
        audioRef.current.addEventListener('ended', handleAudioEnd);
        return () => {
            audioRef.current?.removeEventListener('ended', handleAudioEnd);
        }
    }
  }, [audioRef]);

  useEffect(() => {
    if (!isMounted || !('webkitSpeechRecognition' in window)) {
      return;
    }
    
    const onResult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript) {
            handleUserQuery(transcript.trim());
        }
    };
    
    // Only create the recognition instance once.
    if (!recognitionRef.current) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech' || event.error === 'aborted') {
              setIsListening(false);
              return;
            }

            let errorMessage = "An unknown error occurred with voice recognition.";
            if (event.error === 'network') {
                errorMessage = "Network error with voice recognition. Please check your connection.";
            } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
            }
            
            toast({
                variant: "destructive",
                title: "Voice Chat Error",
                description: errorMessage,
            });
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        }
        recognitionRef.current = recognition;
    }

    // Always update the onresult callback to avoid stale closures.
    recognitionRef.current.onresult = onResult;

  }, [isMounted, handleUserQuery, toast]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if (scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  }, [chatHistory, isThinking]);

  const handleMicClick = () => {
    if (isListening) {
        recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition:", e);
        toast({
          variant: "destructive",
          title: "Voice Chat Error",
          description: "Could not start voice recognition. Please try again.",
        });
        setIsListening(false);
      }
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

  let statusIndicator;
  if (isThinking) {
      statusIndicator = <p className="text-sm text-muted-foreground">Thinking...</p>;
  } else if (isPlayingAudio) {
      statusIndicator = (
          <div className='flex items-center gap-2'>
              <AudioPulse active={true} volume={0.8} hover={false} />
              <p className="text-sm text-muted-foreground">Speaking...</p>
          </div>
      );
  } else if (isListening) {
      statusIndicator = <p className="text-sm text-muted-foreground">Listening...</p>;
  } else if (chatHistory.length > 0) {
      statusIndicator = <p className="text-sm text-muted-foreground">Mic is off</p>;
  } else {
      statusIndicator = <div className="h-5" />; // Placeholder to keep height consistent
  }

  return (
    <div className="flex-shrink-0 flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Bot className="text-accent" />
        Gemini Live Chat
      </h3>
      <ScrollArea className="flex-grow pr-4 -mr-4 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4">
            {chatHistory.length === 0 && !isListening && !isThinking && (
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
         <div className="h-10 flex items-center justify-center">
            {statusIndicator}
         </div>
         <Button onClick={handleMicClick} size="lg" className="rounded-full w-16 h-16" variant={isListening ? 'destructive' : 'secondary'} disabled={isThinking || isPlayingAudio}>
           {isListening ? <MicOff size={28} /> : <Mic size={28} />}
         </Button>
      </div>
    </div>
  );
};
