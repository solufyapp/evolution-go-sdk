import type { RequestOptions } from "./transport";
import { EvolutionGoApiError } from "./errors";
import { CallModule } from "./modules/call";
import { ChatModule } from "./modules/chat";
import { CommunityModule } from "./modules/community";
import { GroupModule } from "./modules/group";
import { InstanceModule } from "./modules/instance";
import { LabelModule } from "./modules/label";
import { MessageModule } from "./modules/message";
import { SendMessageModule } from "./modules/send-message";

export interface EvolutionGoClientConfig {
  baseUrl: string;
  apiKey: string;
  fetch?: typeof globalThis.fetch;
}

export class EvolutionGoClient {
  readonly call: CallModule;
  readonly chat: ChatModule;
  readonly community: CommunityModule;
  readonly group: GroupModule;
  readonly instance: InstanceModule;
  readonly label: LabelModule;
  readonly message: MessageModule;
  readonly sendMessage: SendMessageModule;

  readonly #baseUrl: string;
  readonly #apiKey: string;
  readonly #fetch: typeof globalThis.fetch;

  constructor(config: EvolutionGoClientConfig) {
    this.#baseUrl = config.baseUrl.replace(/\/$/, "");
    this.#apiKey = config.apiKey;
    this.#fetch = config.fetch ?? globalThis.fetch;

    this.call = new CallModule(this.request.bind(this));
    this.chat = new ChatModule(this.request.bind(this));
    this.community = new CommunityModule(this.request.bind(this));
    this.group = new GroupModule(this.request.bind(this));
    this.instance = new InstanceModule(this.request.bind(this));
    this.label = new LabelModule(this.request.bind(this));
    this.message = new MessageModule(this.request.bind(this));
    this.sendMessage = new SendMessageModule(
      this.request.bind(this),
      this.requestForm.bind(this),
    );
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = new URL(this.#baseUrl + path);
    if (options.query) {
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const res = await this.#fetch(url.toString(), {
      method,
      headers: {
        apikey: this.#apiKey,
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new EvolutionGoApiError(res.status, json);
    }
    return json as T;
  }

  async requestForm<T>(
    method: string,
    path: string,
    form: FormData,
  ): Promise<T> {
    const url = this.#baseUrl + path;
    const res = await this.#fetch(url, {
      method,
      headers: { apikey: this.#apiKey },
      body: form,
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new EvolutionGoApiError(res.status, json);
    }
    return json as T;
  }
}
