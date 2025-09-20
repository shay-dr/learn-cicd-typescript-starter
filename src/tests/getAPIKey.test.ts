import { describe, expect, test } from "vitest";
import { getAPIKey } from "../api/auth";
import { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  test("should return API key when valid authorization header is provided", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-secret-api-key-123",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("my-secret-api-key-123");
  });

  test("should return null when no authorization header is provided", () => {
    const headers: IncomingHttpHeaders = {};
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  test("should return null when authorization header is undefined", () => {
    const headers: IncomingHttpHeaders = {
      authorization: undefined,
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  test("should return null when authorization header is empty string", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  test("should return null when authorization header has wrong prefix", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer my-jwt-token",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  test("should return null when authorization header has case-sensitive wrong prefix", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey my-secret-key",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  test("should return null when authorization header has only ApiKey without actual key", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey",
    };
    const result = getAPIKey(headers);
    expect(result).toBeNull();
  });

  test("should return empty string when authorization header has only ApiKey with just space", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey ",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("");
  });

  test("should return API key when authorization header has extra parts", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey my-api-key extra-part",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("my-api-key");
  });

  test("should handle API key with special characters", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey abc-123_DEF.ghi@domain.com",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("abc-123_DEF.ghi@domain.com");
  });

  test("should handle API key with numbers only", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey 1234567890",
    };
    const result = getAPIKey(headers);
    expect(result).toBe("1234567890");
  });

});