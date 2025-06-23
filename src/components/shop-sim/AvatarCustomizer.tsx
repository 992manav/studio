"use client";

import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

export const AvatarCustomizer = () => {
  const { avatarConfig, setAvatarConfig } = useGame();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full h-12 w-12 shadow-lg">
          <User />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Avatar Customization</h4>
            <p className="text-sm text-muted-foreground">Change your look.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatar-color">Color</Label>
            <Input
              id="avatar-color"
              type="color"
              value={avatarConfig.color}
              onChange={(e) => setAvatarConfig({ ...avatarConfig, color: e.target.value })}
              className="p-1 h-10"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
