import type {
  AdvancedSettings,
  ProxyConfig,
  SuccessMessage,
  SuccessResponse,
} from "@/shared";

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

export interface InstanceData {
  id: string;
  name: string;
  token: string;
  webhook: string;
  rabbitmqEnable: string;
  websocketEnable: string;
  natsEnable: string;
  jid: string;
  qrcode: string;
  connected: boolean;
  expiration: number;
  disconnect_reason: string;
  events: string;
  os_name: string;
  proxy: string;
  client_name: string;
  createdAt: string;
  alwaysOnline: boolean;
  rejectCall: boolean;
  msgRejectCall: string;
  readMessages: boolean;
  ignoreGroups: boolean;
  ignoreStatus: boolean;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  instance_id: string;
  message: string;
  metadata?: unknown;
}

export type GetAllInstancesResponse = SuccessResponse<InstanceData[]>;

export type ConnectResponse = SuccessResponse<{
  jid: string;
  webhookUrl: string;
  eventString: string;
}>;

export type CreateInstanceResponse = SuccessResponse<InstanceData>;

export type GetInstanceResponse = SuccessResponse<InstanceData>;

export type PairResponse = SuccessResponse<{ PairingCode: string }>;

export type SetProxyResponse = SuccessResponse<{
  protocol: string;
  host: string;
  port: string;
  hasAuth: boolean;
}>;

export type GetQrResponse = SuccessResponse<{
  qrcode: string;
  code: string;
  passkeyStage?: string;
  passkeyOpenUrl?: string;
}>;

export type GetStatusResponse = SuccessResponse<{
  Connected: boolean;
  LoggedIn: boolean;
  Name: string;
}>;

export type InstanceActionResponse = SuccessMessage;

export interface UpdateAdvancedSettingsResponse {
  message: string;
  settings: AdvancedSettings;
}
