import type { AdvancedSettings, ProxyConfig } from "@/shared";

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
