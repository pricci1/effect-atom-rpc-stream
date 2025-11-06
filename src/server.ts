import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer, Console, Stream, Schedule } from "effect";
import { TheRpcs } from "./lib/schemas.js";

export const LogsLive = TheRpcs.toLayer({
  Numbers: () =>
    Stream.fromSchedule(Schedule.spaced("1 seconds")).pipe(
      Stream.tap((log) => Console.log(log)),
    ),
});

const RpcLayer = RpcServer.layer(TheRpcs).pipe(Layer.provide(LogsLive));

const HttpProtocol = RpcServer.layerProtocolWebsocket({
  path: "/rpc",
}).pipe(Layer.provide(RpcSerialization.layerJson));

const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 3001 })),
);

BunRuntime.runMain(Layer.launch(Main));
