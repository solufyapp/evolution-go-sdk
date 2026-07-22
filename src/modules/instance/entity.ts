import type { AdvancedSettings, ProxyConfig } from "@/shared";
import type { RequestFn } from "@/transport";
import type {
  GetInstanceResponse,
  GetLogsQuery,
  InstanceActionResponse,
  InstanceData,
  LogEntry,
  SetProxyResponse,
  UpdateAdvancedSettingsResponse,
} from "./types";

/**
 * Only exposes the instanceId-scoped operations. connect/disconnect/
 * reconnect/logout/getStatus/getQr/pair have no id param on the server —
 * they act on whichever instance the client's own apikey authenticates
 * as, not necessarily this one — so they stay flat methods on
 * InstanceModule instead of being bound here.
 */
export class Instance {
  readonly #request: RequestFn;
  data: InstanceData;

  constructor(data: InstanceData, request: RequestFn) {
    this.data = data;
    this.#request = request;
  }

  get id() {
    return this.data.id;
  }

  async refresh() {
    const res = await this.#request<GetInstanceResponse>(
      "GET",
      `/instance/info/${this.data.id}`,
    );
    this.data = res.data;
    return this;
  }

  delete() {
    return this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/delete/${this.data.id}`,
    );
  }

  setProxy(body: ProxyConfig) {
    return this.#request<SetProxyResponse>(
      "POST",
      `/instance/proxy/${this.data.id}`,
      { body },
    );
  }

  deleteProxy() {
    return this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/proxy/${this.data.id}`,
    );
  }

  forceReconnect(body?: { number?: string }) {
    return this.#request<InstanceActionResponse>(
      "POST",
      `/instance/forcereconnect/${this.data.id}`,
      body ? { body } : {},
    );
  }

  getLogs(query?: GetLogsQuery) {
    return this.#request<LogEntry[]>("GET", `/instance/logs/${this.data.id}`, {
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  getAdvancedSettings() {
    return this.#request<AdvancedSettings>(
      "GET",
      `/instance/${this.data.id}/advanced-settings`,
    );
  }

  updateAdvancedSettings(settings: AdvancedSettings) {
    return this.#request<UpdateAdvancedSettingsResponse>(
      "PUT",
      `/instance/${this.data.id}/advanced-settings`,
      { body: settings },
    );
  }
}
