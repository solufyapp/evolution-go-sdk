import type { AdvancedSettings, ProxyConfig } from "@/shared";
import type { RequestFn } from "@/transport";
import type {
  ConnectBody,
  ConnectResponse,
  CreateInstanceBody,
  CreateInstanceResponse,
  GetAllInstancesResponse,
  GetInstanceResponse,
  GetLogsQuery,
  GetQrResponse,
  GetStatusResponse,
  InstanceActionResponse,
  LogEntry,
  PairBody,
  PairResponse,
  SetProxyResponse,
  UpdateAdvancedSettingsResponse,
} from "./types";
import { Instance } from "./entity";

export class InstanceModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  async getAll() {
    const res = await this.#request<GetAllInstancesResponse>(
      "GET",
      "/instance/all",
    );
    return {
      message: res.message,
      data: res.data.map((d) => new Instance(d, this.#request)),
    };
  }

  connect(body: ConnectBody) {
    return this.#request<ConnectResponse>("POST", "/instance/connect", {
      body,
    });
  }

  async create(body: CreateInstanceBody) {
    const res = await this.#request<CreateInstanceResponse>(
      "POST",
      "/instance/create",
      { body },
    );
    return {
      message: res.message,
      data: new Instance(res.data, this.#request),
    };
  }

  delete(instanceId: string) {
    return this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/delete/${instanceId}`,
    );
  }

  disconnect() {
    return this.#request<InstanceActionResponse>(
      "POST",
      "/instance/disconnect",
    );
  }

  forceReconnect(instanceId: string, body?: { number?: string }) {
    return this.#request<InstanceActionResponse>(
      "POST",
      `/instance/forcereconnect/${instanceId}`,
      body ? { body } : {},
    );
  }

  async getInfo(instanceId: string) {
    const res = await this.#request<GetInstanceResponse>(
      "GET",
      `/instance/info/${instanceId}`,
    );
    return {
      message: res.message,
      data: new Instance(res.data, this.#request),
    };
  }

  logout() {
    return this.#request<InstanceActionResponse>("DELETE", "/instance/logout");
  }

  getLogs(instanceId: string, query?: GetLogsQuery) {
    return this.#request<LogEntry[]>("GET", `/instance/logs/${instanceId}`, {
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  pair(body: PairBody) {
    return this.#request<PairResponse>("POST", "/instance/pair", { body });
  }

  setProxy(instanceId: string, body: ProxyConfig) {
    return this.#request<SetProxyResponse>(
      "POST",
      `/instance/proxy/${instanceId}`,
      { body },
    );
  }

  deleteProxy(instanceId: string) {
    return this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/proxy/${instanceId}`,
    );
  }

  getQr() {
    return this.#request<GetQrResponse>("GET", "/instance/qr");
  }

  reconnect() {
    return this.#request<InstanceActionResponse>("POST", "/instance/reconnect");
  }

  getStatus() {
    return this.#request<GetStatusResponse>("GET", "/instance/status");
  }

  getAdvancedSettings(instanceId: string) {
    return this.#request<AdvancedSettings>(
      "GET",
      `/instance/${instanceId}/advanced-settings`,
    );
  }

  updateAdvancedSettings(instanceId: string, settings: AdvancedSettings) {
    return this.#request<UpdateAdvancedSettingsResponse>(
      "PUT",
      `/instance/${instanceId}/advanced-settings`,
      { body: settings },
    );
  }
}
