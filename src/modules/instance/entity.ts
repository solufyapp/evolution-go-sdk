import type { AdvancedSettings, ProxyConfig } from "@/shared";
import type { RequestFn } from "@/transport";
import type {
  ConnectBody,
  ConnectResponse,
  GetInstanceResponse,
  GetLogsQuery,
  GetQrResponse,
  GetStatusResponse,
  InstanceActionResponse,
  InstanceData,
  LogEntry,
  PairBody,
  PairResponse,
  SetProxyResponse,
  UpdateAdvancedSettingsResponse,
} from "./types";

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

  async delete() {
    await this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/delete/${this.data.id}`,
    );
  }

  async setProxy(body: ProxyConfig) {
    const res = await this.#request<SetProxyResponse>(
      "POST",
      `/instance/proxy/${this.data.id}`,
      { body },
    );
    return res.data;
  }

  async deleteProxy() {
    await this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/proxy/${this.data.id}`,
    );
  }

  async forceReconnect(body?: { number?: string }) {
    await this.#request<InstanceActionResponse>(
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

  async updateAdvancedSettings(settings: AdvancedSettings) {
    const res = await this.#request<UpdateAdvancedSettingsResponse>(
      "PUT",
      `/instance/${this.data.id}/advanced-settings`,
      { body: settings },
    );
    return res.settings;
  }

  // The operations below have no instanceId param on the server — they
  // act on whichever instance the request's apikey authenticates as.
  // Sending this instance's own token (rather than the parent client's
  // apiKey) is what makes them correctly scoped to this instance.

  async connect(body: ConnectBody = {}) {
    const res = await this.#request<ConnectResponse>(
      "POST",
      "/instance/connect",
      { body, apiKey: this.data.token },
    );
    return res.data;
  }

  async disconnect() {
    await this.#request<InstanceActionResponse>(
      "POST",
      "/instance/disconnect",
      { apiKey: this.data.token },
    );
  }

  async reconnect() {
    await this.#request<InstanceActionResponse>("POST", "/instance/reconnect", {
      apiKey: this.data.token,
    });
  }

  async logout() {
    await this.#request<InstanceActionResponse>("DELETE", "/instance/logout", {
      apiKey: this.data.token,
    });
  }

  async getStatus() {
    const res = await this.#request<GetStatusResponse>(
      "GET",
      "/instance/status",
      { apiKey: this.data.token },
    );
    return res.data;
  }

  async getQr() {
    const res = await this.#request<GetQrResponse>("GET", "/instance/qr", {
      apiKey: this.data.token,
    });
    return res.data;
  }

  async pair(body: PairBody) {
    const res = await this.#request<PairResponse>("POST", "/instance/pair", {
      body,
      apiKey: this.data.token,
    });
    return res.data;
  }
}
