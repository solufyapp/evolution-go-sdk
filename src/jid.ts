import type { Jid } from "@/shared";

/**
 * Parses a "user@server" JID string (optionally "user:device@server" or
 * "user.rawAgent:device@server") into the raw object shape the Go server
 * expects for the two request fields declared as `types.JID` structs
 * instead of strings: call.reject's callCreator and group.leave's groupJid.
 */
export function parseJid(jid: string): Jid {
  const atIndex = jid.indexOf("@");
  const left = atIndex === -1 ? jid : jid.slice(0, atIndex);
  const server = atIndex === -1 ? "" : jid.slice(atIndex + 1);

  const colonIndex = left.indexOf(":");
  const userAndAgent = colonIndex === -1 ? left : left.slice(0, colonIndex);
  const device = colonIndex === -1 ? 0 : Number(left.slice(colonIndex + 1));

  const dotIndex = userAndAgent.indexOf(".");
  const user = dotIndex === -1 ? userAndAgent : userAndAgent.slice(0, dotIndex);
  const rawAgent =
    dotIndex === -1 ? 0 : Number(userAndAgent.slice(dotIndex + 1));

  return {
    User: user,
    Server: server,
    Device: device,
    RawAgent: rawAgent,
    Integrator: 0,
  };
}

/**
 * Inverse of parseJid — formats a Jid object (as returned inside raw
 * response payloads like GroupInfo.JID) back into whatsmeow's own
 * "user@server" string format, mirroring whatsmeow's JID#String().
 */
export function jidToString(jid: Jid): string {
  if (jid.RawAgent > 0) {
    return `${jid.User}.${jid.RawAgent}:${jid.Device}@${jid.Server}`;
  }
  if (jid.Device > 0) {
    return `${jid.User}:${jid.Device}@${jid.Server}`;
  }
  return `${jid.User}@${jid.Server}`;
}
