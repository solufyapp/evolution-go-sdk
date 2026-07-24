import type { APITransport } from "@/api";
import type { ProxyConfig } from "@/shared";
import type {
  CreateInstanceBody,
  CreateInstanceResponse,
  GetAllInstancesResponse,
  GetInstanceResponse,
  GetLogsQuery,
  InstanceActionResponse,
  LogEntry,
  SetProxyResponse,
} from "./types";
import { Instance } from "./entity";

/**
 * Admin-key-only operations (instance lifecycle, by id) — these are the
 * only instance-related endpoints the server accepts a global apikey for.
 * Everything else (connect, chat, group, send message, ...) requires the
 * specific instance's own token and lives on the `Instance` client
 * returned by create()/getInfo()/getAll() instead.
 */
export class InstanceModule {
  constructor(private readonly api: APITransport) {}

  async getAll() {
    const res = await this.api.json<GetAllInstancesResponse>(
      "GET",
      "/instance/all",
    );
    return res.data.map((data) => new Instance(data, this.api.config));
  }

  async create(body: CreateInstanceBody) {
    const res = await this.api.json<CreateInstanceResponse>(
      "POST",
      "/instance/create",
      { body },
    );
    return new Instance(res.data, this.api.config);
  }

  async getInfo(instanceId: string) {
    const res = await this.api.json<GetInstanceResponse>(
      "GET",
      `/instance/info/${instanceId}`,
    );
    return new Instance(res.data, this.api.config);
  }

  async delete(instanceId: string) {
    await this.api.json<InstanceActionResponse>(
      "DELETE",
      `/instance/delete/${instanceId}`,
    );
  }

  async setProxy(instanceId: string, body: ProxyConfig) {
    const res = await this.api.json<SetProxyResponse>(
      "POST",
      `/instance/proxy/${instanceId}`,
      { body },
    );
    return res.data;
  }

  async deleteProxy(instanceId: string) {
    await this.api.json<InstanceActionResponse>(
      "DELETE",
      `/instance/proxy/${instanceId}`,
    );
  }

  async forceReconnect(instanceId: string, body?: { number?: string }) {
    await this.api.json<InstanceActionResponse>(
      "POST",
      `/instance/forcereconnect/${instanceId}`,
      body ? { body } : {},
    );
  }

  getLogs(instanceId: string, query?: GetLogsQuery) {
    return this.api.json<LogEntry[]>("GET", `/instance/logs/${instanceId}`, {
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }
}
