import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultimodalLiveClient } from "../lib/multimodel-live-client";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";

export function useLiveAPI({ url, apiKey }) {
  const client = useMemo(
    () => new MultimodalLiveClient({ url, apiKey }),
    [url, apiKey]
  );
  const audioStreamerRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState({
    model: "models/gemini-2.0-flash-exp",
  });
  const [volume, setVolume] = useState(0);

  // Setup audio streaming for output (speakers)
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet("vumeter-out", VolMeterWorket, (ev) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // worklet added
          });
      });
    }
  }, [audioStreamerRef]);

  // Register event listeners for audio + connection
  useEffect(() => {
    const onClose = () => {
      setConnected(false);
    };

    const stopAudioStreamer = () => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };

    const onAudio = (data) => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };

    client
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      client
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio);
    };
  }, [client]);

  // Connect to server with current config
  const connect = useCallback(async () => {
    if (!config) {
      throw new Error("config has not been set");
    }
    client.disconnect();
    await client.connect(config);
    setConnected(true);
  }, [client, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [client]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
  };
}
