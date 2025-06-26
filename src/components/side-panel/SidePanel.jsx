"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Send } from "lucide-react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useLoggerStore } from "../../lib/store-logger";
import Logger from "../logger/Logger";
import "./side-panel.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SidePanel() {
  const { connected, client } = useLiveAPIContext();
  const [open, setOpen] = useState(false);
  const loggerRef = useRef(null);
  const loggerLastHeightRef = useRef(-1);
  const { log, logs } = useLoggerStore();

  const [textInput, setTextInput] = useState("");
  const [filter, setFilter] = useState("none");

  // Scroll the log to the bottom when new logs come in
  useEffect(() => {
    if (loggerRef.current) {
      const el = loggerRef.current;
      const scrollHeight = el.scrollHeight;
      if (scrollHeight !== loggerLastHeightRef.current) {
        el.scrollTop = scrollHeight;
        loggerLastHeightRef.current = scrollHeight;
      }
    }
  }, [logs]);

  // Listen for log events and store them
  useEffect(() => {
    client.on("log", log);
    return () => {
      client.off("log", log);
    };
  }, [client, log]);

  const handleSubmit = () => {
    if (!textInput.trim()) return;
    client.send([{ text: textInput }]);
    setTextInput("");
  };

  return (
    <div className={`side-panel ${open ? "open" : ""}`}>
      <header className="top">
        <h2>Console</h2>
        <Button
          variant="ghost"
          size="icon"
          className="opener"
          onClick={() => setOpen(!open)}
        >
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </header>
      <div className="indicators">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter logs..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Logs</SelectItem>
            <SelectItem value="conversations">Conversations</SelectItem>
            <SelectItem value="tools">Tool Use</SelectItem>
          </SelectContent>
        </Select>
        <div className={cn("streaming-indicator", { connected })}>
          {connected ? (
            <>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {open && "Streaming"}
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-gray-500" />
              {open && "Paused"}
            </>
          )}
        </div>
      </div>
      <div className="side-panel-container" ref={loggerRef}>
        <Logger filter={filter} />
      </div>
      <div className={cn("input-container", { disabled: !connected })}>
        <div className="input-content">
          <Input
            placeholder="Type something..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={!connected}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!connected || !textInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
