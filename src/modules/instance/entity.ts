import type { APIConfig } from "@/api";
import type { InstanceData } from "./types";
import { InstanceClient } from "./client";

export class Instance extends InstanceClient {
  readonly data: InstanceData;

  constructor(data: InstanceData, config: Omit<APIConfig, "apiKey">) {
    super({ id: data.id, token: data.token }, config);
    this.data = data;
  }
}
