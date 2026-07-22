export interface RejectCallBody {
  /** Call creator JID as a plain "user@server" string; sent to the server as a Jid object. */
  callCreator?: string;
  callId?: string;
}
