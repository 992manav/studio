"use client";

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Wand2, Loader2 } from 'lucide-react';
import { generateAvatar } from '@/ai/flows/avatar-generator';
import { useToast } from '@/hooks/use-toast';

export const AvatarCustomizer = () => {
  const { avatarConfig, setAvatarConfig } = useGame();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a description for your avatar.",
        });
        return;
    }
    setLoading(true);
    try {
        const result = await generateAvatar({ description });
        setAvatarConfig({ ...avatarConfig, texture: result.avatarDataUri });
        toast({
            title: "Avatar Generated!",
            description: "Your new look has been applied.",
        });
    } catch (error) {
        console.error("Avatar generation failed:", error);
        toast({
            variant: "destructive",
            title: "Avatar Generation Failed",
            description: "Could not generate avatar. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-lg">
          <User />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Avatar Generation</h4>
            <p className="text-sm text-muted-foreground">Describe your avatar and let AI create it.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatar-description">Description</Label>
            <Textarea
              id="avatar-description"
              placeholder="e.g., a knight with shining armor, a robot with glowing blue eyes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? 'Generating...' : 'Generate Avatar'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
