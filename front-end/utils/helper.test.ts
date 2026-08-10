import { handleResponse, fetchJSON } from "./helper.js";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

describe("handleResponse", () => {
  it("should parse JSON for a successful response", async () => {
    const res = {
      ok: true,
      json: jest.fn<() => Promise<any>>().mockResolvedValue({ id: 1 }),
    } as unknown as Response;

    const data = await handleResponse(res);

    expect(data).toEqual({ id: 1 });
  });

  it("should throw with error message for a failed response", async () => {
    const res = {
      ok: false,
      json: jest
        .fn<() => Promise<any>>()
        .mockResolvedValue({ error: "Bad request" }),
    } as unknown as Response;

    await expect(handleResponse(res)).rejects.toThrow("Bad request");
  });

  it("should throw fallback message when failed response has no error field", async () => {
    const res = {
      ok: false,
      json: jest.fn<() => Promise<any>>().mockResolvedValue({}),
    } as unknown as Response;

    await expect(handleResponse(res)).rejects.toThrow("Something went wrong");
  });

  it("should handle JSON parse failure gracefully", async () => {
    const res = {
      ok: false,
      json: jest
        .fn<() => Promise<any>>()
        .mockRejectedValue(new Error("Invalid JSON")),
    } as unknown as Response;

    await expect(handleResponse(res)).rejects.toThrow("Something went wrong");
  });
});

describe("fetchJSON", () => {
  let fetchMock: jest.Mock<(...args: any[]) => Promise<any>>;

  beforeEach(() => {
    fetchMock = jest.fn<(...args: any[]) => Promise<any>>();
    global.fetch = fetchMock as unknown as typeof fetch;
    jest.restoreAllMocks();
  });

  it("should call fetch with Content-Type header and return parsed data", async () => {
    const fakeResponse = {
      ok: true,
      json: jest.fn<() => Promise<any>>().mockResolvedValue({ data: "ok" }),
    };
    fetchMock.mockResolvedValue(fakeResponse);

    const result = await fetchJSON("/api/test");

    expect(fetchMock).toHaveBeenCalledWith("/api/test", {
      headers: { "Content-Type": "application/json" },
    });
    expect(result).toEqual({ data: "ok" });
  });

  it("should merge custom options with default headers", async () => {
    const fakeResponse = {
      ok: true,
      json: jest.fn<() => Promise<any>>().mockResolvedValue({ success: true }),
    };
    fetchMock.mockResolvedValue(fakeResponse);

    await fetchJSON("/api/test", { method: "POST", body: "{}" });

    expect(fetchMock).toHaveBeenCalledWith("/api/test", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: "{}",
    });
  });
});
