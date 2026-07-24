import type { AdvancedSettings, ProxyConfig } from "@/shared";
import { type APIConfig, APITransport } from "@/api";
import { CallModule } from "@/modules/call";
import { ChatModule } from "@/modules/chat";
import { CommunityModule } from "@/modules/community";
import { GroupModule } from "@/modules/group";
import { LabelModule } from "@/modules/label";
import { MessageModule } from "@/modules/message";
import { SendMessageModule } from "@/modules/send-message";
import type {
  ConnectBody,
  ConnectResponse,
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

/**
 * Client for a single instance, authenticated with that instance's own
 * token — everything the server gates behind the `Auth` middleware
 * (as opposed to `AuthAdmin`) lives here: messaging (chat, group, message,
 * sendMessage, label, community, call) and the session operations
 * (connect, disconnect, reconnect, logout, getStatus, getQr, pair).
 *
 * Instance lifecycle management (getInfo, delete, setProxy, forceReconnect,
 * getLogs, ...) only accepts the server's global admin key, so those stay
 * on `EvolutionGoClient#instance` and aren't available here — there's no
 * `refresh()`/`delete()` on this client for the same reason.
 */
export class Instance {
  readonly call: CallModule;
  readonly chat: ChatModule;
  readonly community: CommunityModule;
  readonly group: GroupModule;
  readonly label: LabelModule;
  readonly message: MessageModule;
  readonly sendMessage: SendMessageModule;

  readonly data: InstanceData;
  readonly api: APITransport;

  constructor(data: InstanceData, config: Omit<APIConfig, "apiKey">) {
    this.data = data;
    this.api = new APITransport({ ...config, apiKey: data.token });

    this.call = new CallModule(this.api);
    this.chat = new ChatModule(this.api);
    this.community = new CommunityModule(this.api);
    this.group = new GroupModule(this.api);
    this.label = new LabelModule(this.api);
    this.message = new MessageModule(this.api);
    this.sendMessage = new SendMessageModule(this.api);
  }

  get id() {
    return this.data.id;
  }

  async connect(body: ConnectBody = {}) {
    const res = await this.api.json<ConnectResponse>(
      "POST",
      "/instance/connect",
      { body },
    );
    return res.data;
  }

  async disconnect() {
    await this.api.json<InstanceActionResponse>("POST", "/instance/disconnect");
  }

  async reconnect() {
    await this.api.json<InstanceActionResponse>("POST", "/instance/reconnect");
  }

  async logout() {
    await this.api.json<InstanceActionResponse>("DELETE", "/instance/logout");
  }

  async getStatus() {
    const res = await this.api.json<GetStatusResponse>(
      "GET",
      "/instance/status",
    );
    return res.data;
  }

  async getQr() {
    const res = await this.api.json<GetQrResponse>("GET", "/instance/qr");
    return res.data;
  }

  async pair(body: PairBody) {
    const res = await this.api.json<PairResponse>("POST", "/instance/pair", {
      body,
    });
    return res.data;
  }

  async delete() {
    await this.api.json<InstanceActionResponse>(
      "DELETE",
      `/instance/delete/${this.id}`,
    );
  }

  async setProxy(body: ProxyConfig) {
    const res = await this.api.json<SetProxyResponse>(
      "POST",
      `/instance/proxy/${this.id}`,
      { body },
    );
    return res.data;
  }

  async deleteProxy() {
    await this.api.json<InstanceActionResponse>(
      "DELETE",
      `/instance/proxy/${this.id}`,
    );
  }

  async forceReconnect(body?: { number?: string }) {
    await this.api.json<InstanceActionResponse>(
      "POST",
      `/instance/forcereconnect/${this.id}`,
      body ? { body } : {},
    );
  }

  getLogs(query?: GetLogsQuery) {
    return this.api.json<LogEntry[]>("GET", `/instance/logs/${this.id}`, {
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  getAdvancedSettings() {
    return this.api.json<AdvancedSettings>(
      "GET",
      `/instance/${this.data.id}/advanced-settings`,
    );
  }

  async updateAdvancedSettings(settings: AdvancedSettings) {
    const res = await this.api.json<UpdateAdvancedSettingsResponse>(
      "PUT",
      `/instance/${this.data.id}/advanced-settings`,
      { body: settings },
    );
    return res.settings;
  }
}
