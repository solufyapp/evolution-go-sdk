import type { RequestFn } from "@/transport";
import type { RejectCallBody } from "./types";

export class CallModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  reject(body: RejectCallBody) {
    return this.#request("POST", "/call/reject", { body });
  }
}
