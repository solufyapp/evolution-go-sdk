import { type APIConfig, APITransport } from "./api";
import { InstanceModule } from "./modules/instance";

/**
 * Admin-scoped client, authenticated with the server's global apikey.
 * Only instance lifecycle management (create/list/info/delete/proxy/
 * forcereconnect/logs) is reachable with this key — every other endpoint
 * (chat, group, message, sendMessage, label, community, call, and the
 * instance session operations like connect/getQr) requires a specific
 * instance's own token instead, and is only reachable through the
 * `Instance` client returned by `instance.create()`/`getInfo()`/`getAll()`.
 */
export class EvolutionGoClient {
  readonly transport: APITransport;
  readonly instance: InstanceModule;

  constructor(config: APIConfig) {
    this.transport = new APITransport(config);
    this.instance = new InstanceModule(this.transport);
  }
}
