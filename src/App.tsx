import "./index.css";

import { useAtomValue, Result, Atom, AtomRpc } from "@effect-atom/atom-react";
import * as BrowserSocket from "@effect/platform-browser/BrowserSocket";
import * as RpcClient from "@effect/rpc/RpcClient";
import * as RpcSerialization from "@effect/rpc/RpcSerialization";
import * as Layer from "effect/Layer";
import { TheRpcs } from "@/lib/schemas.js";

class TheRpcClient extends AtomRpc.Tag<TheRpcClient>()("LogsClient", {
  group: TheRpcs,
  protocol: RpcClient.layerProtocolSocket({
    retryTransientErrors: true,
  }).pipe(
    Layer.provide(BrowserSocket.layerWebSocket("ws://localhost:3001/rpc")),
    Layer.provide(RpcSerialization.layerJson),
  ),
}) {}

const numbersAtom = TheRpcClient.query("Numbers", void 0).pipe(Atom.keepAlive);

export function App() {
  const numbersResult = useAtomValue(numbersAtom);

  return (
    <div className="app">
      <div
        style={{ fontFamily: "monospace", height: "600px", overflow: "auto" }}
      >
        <div style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
          {Result.match(numbersResult, {
            onInitial: () => <div>Loading...</div>,
            onFailure: () => <div>Error loading logs</div>,
            onSuccess: (success) => (
              <div>
                {success.waiting ? <p>Loading more...</p> : <p>Loaded chunk</p>}
                {success.value.items.map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "2px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            ),
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
