"use client";

import cn from "classnames";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Bot } from "lucide-react";
import { GeminiLiveChat } from '@/components/shop-sim/GeminiLiveChat';
import { Button } from "@/components/ui/button";
import "./side-panel.css";

export default function SidePanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className={`side-panel ${open ? "open" : ""}`}>
      <header className="top">
        <h2 className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Assistant
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="opener"
          onClick={() => setOpen(!open)}
        >
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </header>
      <div className="side-panel-container">
        <div className="p-4 h-full flex flex-col">
          <GeminiLiveChat />
        </div>
      </div>
    </div>
  );
}
