import { Profile } from "./profile";

export class Client {
  public profile: Profile;
  private cookies: { [key: string]: string } = {};

  constructor() {
    this.profile = new Profile(this.request.bind(this));
  }

  private parseAndFilterCookies(setCookieHeader: string | null): {
    [key: string]: string;
  } {
    if (!setCookieHeader) {
      return {};
    }

    const cookies: { [key: string]: string } = {};
    const cookieStrings = setCookieHeader.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

    for (const cookieString of cookieStrings) {
      const parts = cookieString.trim().split(";");
      const [nameValue] = parts;
      const [name, value] = nameValue.includes("=")
        ? nameValue.split("=")
        : [nameValue, ""];

      if (name && (name === "uid" || name === "_yq_rc_")) {
        cookies[name] = value || "";
      }
    }
    return cookies;
  }

  // A helper function that mimics the fetch API for both environments
  private async customFetch(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    if (typeof fetch !== "undefined") {
      // In Node.js or other environments with native fetch
      return fetch(url, options);
    } else if (
      typeof UrlFetchApp !== "undefined" &&
      typeof UrlFetchApp.fetch === "function"
    ) {
      // In Google App Script environment
      const resp = UrlFetchApp.fetch(url, {
        method: options.method
          ? (options.method.toLowerCase() as GoogleAppsScript.URL_Fetch.HttpMethod)
          : undefined,
        headers: options.headers as { [key: string]: string },
        payload: options.body ?? undefined,
        muteHttpExceptions: true,
      });
      const responseCode = resp.getResponseCode();
      const headersObj = resp.getAllHeaders() as {
        [key: string]: string | string[];
      };
      const fakeHeaders = {
        get: (name: string): string | null => {
          const value = headersObj[name];
          if (typeof value === "string") return value;
          if (Array.isArray(value)) return value.join(", ");
          return null;
        },
      };

      const text = resp.getContentText();

      return {
        ok: responseCode >= 200 && responseCode < 300,
        status: responseCode,
        headers: fakeHeaders,
        text: async () => text,
        json: async () => JSON.parse(text),
      } as Response;
    } else {
      // Neither native fetch nor UrlFetchApp.fetch is available
      throw new Error("No suitable fetch implementation available.");
    }
  }

  private async request(method: string, url: string, data?: any): Promise<any> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    const relevantCookies = Object.entries(this.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    if (relevantCookies) {
      headers["Cookie"] = relevantCookies;
    }

    let bodyData = data ? JSON.stringify(data) : undefined;

    const response = await this.customFetch(url, {
      method: method.toUpperCase(),
      headers: headers,
      body: bodyData,
    });

    const setCookieHeader = response.headers.get("Set-Cookie");
    const parsedCookies = this.parseAndFilterCookies(setCookieHeader);
    this.cookies = { ...this.cookies, ...parsedCookies };

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`Request failed: ${response.status} - ${errorText}`);
      }
      throw new Error(
        `Request failed: ${response.status} - Code: ${errorJson.Code}, Message: ${errorJson.Message}`
      );
    }

    return await response.json();
  }
}
