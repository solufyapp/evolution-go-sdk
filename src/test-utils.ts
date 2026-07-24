import { vi } from "vitest";

import type { APITransport } from "@/api";

/** A mocked API instance for module/entity unit tests — asserts against .json/.formData calls. */
export function makeApi(): APITransport {
  return {
    json: vi.fn().mockResolvedValue({}),
    formData: vi.fn().mockResolvedValue({}),
  } as unknown as APITransport;
}
