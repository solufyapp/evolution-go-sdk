import type { APITransport } from "@/api";
import type { SuccessMessage } from "@/shared";
import { parseJid } from "@/jid";
import type { RejectCallBody } from "./types";

export class CallModule {
  constructor(private readonly api: APITransport) {}

  async reject(body: RejectCallBody) {
    await this.api.json<SuccessMessage>("POST", "/call/reject", {
      body: {
        callCreator: body.callCreator ? parseJid(body.callCreator) : undefined,
        callId: body.callId,
      },
    });
  }
}
