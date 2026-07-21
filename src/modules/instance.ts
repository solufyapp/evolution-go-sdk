import type { AdvancedSettings, ProxyConfig } from "../shared.js";

type RequestFn = <T>(
  method: string,
  path: string,
  opts?: {
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
  },
) => Promise<T>;

export interface ConnectBody {
  phone?: string;
  immediate?: boolean;
  webhookUrl?: string;
  websocketEnable?: string;
  natsEnable?: string;
  rabbitmqEnable?: string;
  subscribe?: string[];
}

export interface CreateInstanceBody {
  name?: string;
  instanceId?: string;
  token?: string;
  proxy?: ProxyConfig;
  advancedSettings?: AdvancedSettings;
}

export interface PairBody {
  phone?: string;
  subscribe?: string[];
}

export interface GetLogsQuery {
  start_date?: string;
  end_date?: string;
  level?: string;
  limit?: number;
}

export class InstanceModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  getAll() {
    return this.#request("GET", "/instance/all");
  }

  connect(body: ConnectBody) {
    return this.#request("POST", "/instance/connect", { body });
  }

  create(body: CreateInstanceBody) {
    return this.#request("POST", "/instance/create", { body });
  }

  delete(instanceId: string) {
    return this.#request("DELETE", `/instance/delete/${instanceId}`);
  }

  disconnect() {
    return this.#request("POST", "/instance/disconnect");
  }

  forceReconnect(instanceId: string, body?: { number?: string }) {
    return this.#request(
      "POST",
      `/instance/forcereconnect/${instanceId}`,
      body ? { body } : {},
    );
  }

  getInfo(instanceId: string) {
    return this.#request("GET", `/instance/info/${instanceId}`);
  }

  logout() {
    return this.#request("DELETE", "/instance/logout");
  }

  getLogs(instanceId: string, query?: GetLogsQuery) {
    return this.#request("GET", `/instance/logs/${instanceId}`, {
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  pair(body: PairBody) {
    return this.#request("POST", "/instance/pair", { body });
  }

  setProxy(instanceId: string, body: ProxyConfig) {
    return this.#request("POST", `/instance/proxy/${instanceId}`, { body });
  }

  deleteProxy(instanceId: string) {
    return this.#request("DELETE", `/instance/proxy/${instanceId}`);
  }

  getQr() {
    return this.#request("GET", "/instance/qr");
  }

  reconnect() {
    return this.#request("POST", "/instance/reconnect");
  }

  getStatus() {
    return this.#request("GET", "/instance/status");
  }

  getAdvancedSettings(instanceId: string) {
    return this.#request<AdvancedSettings>(
      "GET",
      `/instance/${instanceId}/advanced-settings`,
    );
  }

  updateAdvancedSettings(instanceId: string, settings: AdvancedSettings) {
    return this.#request("PUT", `/instance/${instanceId}/advanced-settings`, {
      body: settings,
    });
  }
}
