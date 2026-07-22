import type { SuccessMessage } from "@/shared";
import type { RequestFn } from "@/transport";
import { parseJid } from "@/jid";
import type { RejectCallBody } from "./types";

export class CallModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  reject(body: RejectCallBody) {
    return this.#request<SuccessMessage>("POST", "/call/reject", {
      body: {
        callCreator: body.callCreator ? parseJid(body.callCreator) : undefined,
        callId: body.callId,
      },
    });
  }
}
