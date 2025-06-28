
"use client";

import { useRef, useState } from "react";
import { GameProvider } from '@/contexts/GameContext';
import ShopSim from '@/components/shop-sim/ShopSim';
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import SidePanel from "@/components/side-panel/SidePanel";
import ControlTray from "@/components/control-tray/ControlTray";
import RightPanel from "@/components/right-panel/RightPanel";
import cn from "classnames";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

export default function Home() {
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);

  if (!API_KEY) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-lg">
          <h2 className="text-2xl font-bold">API Key Missing</h2>
          <p className="mt-2 text-muted-foreground">
            Please add your Gemini API key to the <code className="bg-muted px-1 py-0.5 rounded-sm">.env</code> file.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a file named <code className="bg-muted px-1 py-0.5 rounded-sm">.env</code> and add the line: <br />
            <code className="bg-muted px-1 py-0.5 rounded-sm">NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="streaming-console">
          <SidePanel />
          <main>
            <div className="main-app-area">
              <ShopSim />
              <video
                className={cn("stream", {
                  hidden: !videoRef.current || !videoStream,
                })}
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />
            </div>

            <ControlTray
              videoRef={videoRef}
              supportsVideo={true}
              onVideoStreamChange={setVideoStream}
            />
          </main>
          <RightPanel />
        </div>
      </LiveAPIProvider>
    </GameProvider>
  );
}
