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

  // A helper function that mimics the fetch API for GAS
  private async customFetch(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    // if native fetch exists use it
    if (typeof fetch !== "undefined") {
      return fetch(url, options);
    } else {
      // In Google App Script, use UrlFetchApp
      const resp = UrlFetchApp.fetch(url, {
        method: options.method?.toLowerCase(), // GAS expects lowercase method names
        headers: options.headers as { [key: string]: string },
        payload: options.body,
        muteHttpExceptions: true,
      });
      const responseCode = resp.getResponseCode();
      const headersObj = resp.getAllHeaders();
      const fakeHeaders = {
        get: (name: string): string | null => {
          const value = headersObj[name];
          if (typeof value === "string") return value;
          if (Array.isArray(value)) return value.join(", ");
          return null;
        },
      };

      const text = resp.getContentText();

      // Return an object mimicking the Response interface
      return {
        ok: responseCode >= 200 && responseCode < 300,
        status: responseCode,
        headers: fakeHeaders,
        text: async () => text,
        json: async () => JSON.parse(text),
      } as Response;
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
