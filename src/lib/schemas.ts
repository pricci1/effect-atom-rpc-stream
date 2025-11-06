import { Schema } from "effect";
import { Rpc, RpcGroup } from "@effect/rpc";

export class TheRpcs extends RpcGroup.make(
  Rpc.make("Numbers", {
    success: Schema.Number,
    stream: true,
  }),
) {}
