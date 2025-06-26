import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

// --- Function Declarations ---

const renderAltairDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: "object",
    properties: {
      json_graph: {
        type: "string",
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

const changeBackgroundDeclaration = {
  name: "change_background",
  description: "Changes the background color of the page.",
  parameters: {
    type: "object",
    properties: {
      color: {
        type: "string",
        description:
          "The background color to set. Accepts any valid CSS color value.",
      },
    },
    required: ["color"],
  },
};

// --- Main Component ---

function AltairComponent() {
  const [jsonString, setJSONString] = useState("");
  const { client, setConfig } = useLiveAPIContext();

  // Configure Gemini + tool declarations
  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: `You are my helpful assistant. Any time I ask you for a graph, call the "render_altair" function. If I ask you to change the background color, call "change_background". Make your best judgment.`,
          },
        ],
      },
      tools: [
        { googleSearch: {} },
        {
          functionDeclarations: [
            renderAltairDeclaration,
            changeBackgroundDeclaration,
          ],
        },
      ],
    });
  }, [setConfig]);

  // Listen for tool calls (from Gemini)
  useEffect(() => {
    const onToolCall = (toolCall) => {
      console.log("got toolcall", toolCall);

      toolCall.functionCalls.forEach((fc) => {
        if (fc.name === "render_altair") {
          const str = fc.args?.json_graph;
          if (str) setJSONString(str);
        }

        if (fc.name === "change_background") {
          const color = fc.args?.color;
          if (color) {
            document.body.querySelector(
              ".streaming-console"
            ).style.backgroundColor = color;
          }
        }
      });

      if (toolCall.functionCalls.length) {
        setTimeout(() => {
          client.sendToolResponse({
            functionResponses: toolCall.functionCalls.map((fc) => ({
              response: { output: { success: true } },
              id: fc.id,
            })),
          });
        }, 200);
      }
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  // Embed the Altair/Vega chart
  const embedRef = useRef(null);
  useEffect(() => {
    if (embedRef.current && jsonString) {
      try {
        vegaEmbed(embedRef.current, JSON.parse(jsonString));
      } catch (err) {
        console.error("Error parsing or rendering Vega JSON:", err);
      }
    }
  }, [embedRef, jsonString]);

  return <div className="vega-embed" ref={embedRef} />;
}

export default memo(AltairComponent);
