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
    return res.data.map((d) => new Instance(d, this.#request));
  }

  async connect(body: ConnectBody) {
    const res = await this.#request<ConnectResponse>(
      "POST",
      "/instance/connect",
      { body },
    );
    return res.data;
  }

  async create(body: CreateInstanceBody) {
    const res = await this.#request<CreateInstanceResponse>(
      "POST",
      "/instance/create",
      { body },
    );
    return new Instance(res.data, this.#request);
  }

  async delete(instanceId: string) {
    await this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/delete/${instanceId}`,
    );
  }

  async disconnect() {
    await this.#request<InstanceActionResponse>("POST", "/instance/disconnect");
  }

  async forceReconnect(instanceId: string, body?: { number?: string }) {
    await this.#request<InstanceActionResponse>(
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
    return new Instance(res.data, this.#request);
  }

  async logout() {
    await this.#request<InstanceActionResponse>("DELETE", "/instance/logout");
  }

  getLogs(instanceId: string, query?: GetLogsQuery) {
    return this.#request<LogEntry[]>("GET", `/instance/logs/${instanceId}`, {
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  async pair(body: PairBody) {
    const res = await this.#request<PairResponse>("POST", "/instance/pair", {
      body,
    });
    return res.data;
  }

  async setProxy(instanceId: string, body: ProxyConfig) {
    const res = await this.#request<SetProxyResponse>(
      "POST",
      `/instance/proxy/${instanceId}`,
      { body },
    );
    return res.data;
  }

  async deleteProxy(instanceId: string) {
    await this.#request<InstanceActionResponse>(
      "DELETE",
      `/instance/proxy/${instanceId}`,
    );
  }

  async getQr() {
    const res = await this.#request<GetQrResponse>("GET", "/instance/qr");
    return res.data;
  }

  async reconnect() {
    await this.#request<InstanceActionResponse>("POST", "/instance/reconnect");
  }

  async getStatus() {
    const res = await this.#request<GetStatusResponse>(
      "GET",
      "/instance/status",
    );
    return res.data;
  }

  getAdvancedSettings(instanceId: string) {
    return this.#request<AdvancedSettings>(
      "GET",
      `/instance/${instanceId}/advanced-settings`,
    );
  }

  async updateAdvancedSettings(instanceId: string, settings: AdvancedSettings) {
    const res = await this.#request<UpdateAdvancedSettingsResponse>(
      "PUT",
      `/instance/${instanceId}/advanced-settings`,
      { body: settings },
    );
    return res.settings;
  }
}
