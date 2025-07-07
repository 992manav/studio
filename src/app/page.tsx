"use client";

export const dynamic = "force-static";

import { useRef, useState } from "react";
import ShopSim from "@/components/shop-sim/ShopSim";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import SidePanel from "@/components/side-panel/SidePanel";
import ControlTray from "@/components/control-tray/ControlTray";
import RightPanel from "@/components/right-panel/RightPanel";
import cn from "classnames";
import Link from "next/link";

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
            Please add your Gemini API key to the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm">.env</code> file.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a file named{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm">.env</code> and
            add the line: <br />
            <code className="bg-muted px-1 py-0.5 rounded-sm">
              NEXT_PUBLIC_GEMINI_API_KEY=YOUR_API_KEY
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="flex h-full w-full overflow-hidden">
          <SidePanel />
          <div className="flex-1 flex flex-col min-w-0">
            <ControlTray
              videoRef={videoRef}
              supportsVideo={true}
              onVideoStreamChange={setVideoStream}
            />
            <ShopSim
              videoRef={videoRef}
              videoStream={videoStream}
              setVideoStream={setVideoStream}
            />
          </div>
          <RightPanel />
        </div>
      </LiveAPIProvider>
    </div>
  );
}
