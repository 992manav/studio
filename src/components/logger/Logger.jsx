import "./logger.css";

// import { Part } from "@google/generative-ai";
import cn from "classnames";
import { useLoggerStore } from "../../lib/store-logger";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 as dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  isClientContentMessage,
  isInterrupted,
  isModelTurn,
  isServerContentMessage,
  isToolCallCancellationMessage,
  isToolCallMessage,
  isToolResponseMessage,
  isTurnComplete,
} from "../../multimodel-live-types";

const formatTime = (d) => d.toLocaleTimeString().slice(0, -3);

const LogEntry = ({ log, MessageComponent }) => (
  <li
    className={cn(
      `plain-log`,
      `source-${log.type.slice(0, log.type.indexOf("."))}`,
      {
        receive: log.type.includes("receive"),
        send: log.type.includes("send"),
      }
    )}
  >
    <span className="timestamp">{formatTime(log.date)}</span>
    <span className="source">{log.type}</span>
    <span className="message">
      <MessageComponent message={log.message} />
    </span>
    {log.count && <span className="count">{log.count}</span>}
  </li>
);

const PlainTextMessage = ({ message }) => <span>{message}</span>;

const AnyMessage = ({ message }) => (
  <pre>{JSON.stringify(message, null, "  ")}</pre>
);

function tryParseCodeExecutionResult(output) {
  try {
    const json = JSON.parse(output);
    return JSON.stringify(json, null, "  ");
  } catch (e) {
    return output;
  }
}

const RenderPart = ({ part }) =>
  part.text && part.text.length ? (
    <p className="part part-text">{part.text}</p>
  ) : part.executableCode ? (
    <div className="part part-executableCode">
      <h5>executableCode: {part.executableCode.language}</h5>
      <SyntaxHighlighter
        language={part.executableCode.language.toLowerCase()}
        style={dark}
      >
        {part.executableCode.code}
      </SyntaxHighlighter>
    </div>
  ) : part.codeExecutionResult ? (
    <div className="part part-codeExecutionResult">
      <h5>codeExecutionResult: {part.codeExecutionResult.outcome}</h5>
      <SyntaxHighlighter language="json" style={dark}>
        {tryParseCodeExecutionResult(part.codeExecutionResult.output)}
      </SyntaxHighlighter>
    </div>
  ) : (
    <div className="part part-inlinedata">
      <h5>Inline Data: {part.inlineData?.mimeType}</h5>
    </div>
  );

const ClientContentLog = ({ message }) => {
  const { turns, turnComplete } = message.clientContent;
  return (
    <div className="rich-log client-content user">
      <h4 className="roler-user">User</h4>
      {turns.map((turn, i) => (
        <div key={`message-turn-${i}`}>
          {turn.parts
            .filter((part) => !(part.text && part.text === "\n"))
            .map((part, j) => (
              <RenderPart part={part} key={`message-turn-${i}-part-${j}`} />
            ))}
        </div>
      ))}
      {!turnComplete ? <span>turnComplete: false</span> : ""}
    </div>
  );
};

const ToolCallLog = ({ message }) => {
  const { toolCall } = message;
  return (
    <div className={cn("rich-log tool-call")}>
      {toolCall.functionCalls.map((fc) => (
        <div key={fc.id} className="part part-functioncall">
          <h5>Function call: {fc.name}</h5>
          <SyntaxHighlighter language="json" style={dark}>
            {JSON.stringify(fc, null, "  ")}
          </SyntaxHighlighter>
        </div>
      ))}
    </div>
  );
};

const ToolCallCancellationLog = ({ message }) => (
  <div className={cn("rich-log tool-call-cancellation")}>
    <span>
      ids:{" "}
      {message.toolCallCancellation.ids.map((id) => (
        <span className="inline-code" key={`cancel-${id}`}>
          "{id}"
        </span>
      ))}
    </span>
  </div>
);

const ToolResponseLog = ({ message }) => (
  <div className={cn("rich-log tool-response")}>
    {message.toolResponse.functionResponses.map((fc) => (
      <div key={`tool-response-${fc.id}`} className="part">
        <h5>Function Response: {fc.id}</h5>
        <SyntaxHighlighter language="json" style={dark}>
          {JSON.stringify(fc.response, null, "  ")}
        </SyntaxHighlighter>
      </div>
    ))}
  </div>
);

const ModelTurnLog = ({ message }) => {
  const serverContent = message.serverContent;
  const { modelTurn } = serverContent;
  const { parts } = modelTurn;

  return (
    <div className="rich-log model-turn model">
      <h4 className="role-model">Model</h4>
      {parts
        .filter((part) => !(part.text && part.text === "\n"))
        .map((part, j) => (
          <RenderPart part={part} key={`model-turn-part-${j}`} />
        ))}
    </div>
  );
};

const CustomPlainTextLog = (msg) => () => <PlainTextMessage message={msg} />;

const filters = {
  tools: (log) =>
    isToolCallMessage(log.message) ||
    isToolResponseMessage(log.message) ||
    isToolCallCancellationMessage(log.message),
  conversations: (log) =>
    isClientContentMessage(log.message) || isServerContentMessage(log.message),
  none: () => true,
};

const component = (log) => {
  if (typeof log.message === "string") return PlainTextMessage;
  if (isClientContentMessage(log.message)) return ClientContentLog;
  if (isToolCallMessage(log.message)) return ToolCallLog;
  if (isToolCallCancellationMessage(log.message))
    return ToolCallCancellationLog;
  if (isToolResponseMessage(log.message)) return ToolResponseLog;
  if (isServerContentMessage(log.message)) {
    const { serverContent } = log.message;
    if (isInterrupted(serverContent)) return CustomPlainTextLog("interrupted");
    if (isTurnComplete(serverContent))
      return CustomPlainTextLog("turnComplete");
    if (isModelTurn(serverContent)) return ModelTurnLog;
  }
  return AnyMessage;
};

export default function Logger({ filter = "none" }) {
  const { logs } = useLoggerStore();
  const filterFn = filters[filter];

  return (
    <div className="logger">
      <ul className="logger-list">
        {logs.filter(filterFn).map((log, key) => (
          <LogEntry MessageComponent={component(log)} log={log} key={key} />
        ))}
      </ul>
    </div>
  );
}
