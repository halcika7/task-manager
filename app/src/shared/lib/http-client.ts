import { getSession } from '@/modules/auth/actions/get-session';
import { logoutAction } from '@/modules/auth/actions/logout.action';
import { updateSession } from '@/modules/auth/actions/update-session';
import { getUserLocale } from '@/modules/i18n/lib/locale-cookie';
import { BACKEND_URL } from '@/shared/constants';

export type HttpClientResponse<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data: null;
      error: string;
    };

class HttpClient {
  private static instance: HttpClient;
  private readonly baseUrl = BACKEND_URL;

  private constructor() {}

  public static getInstance() {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  async refreshToken(
    refresh?: string,
    withUpdateSession = true
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();

      if (withUpdateSession) {
        await updateSession({
          token: data?.accessToken,
          refresh_token: data?.refreshToken,
        });
      }

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch {
      return null;
    }
  }

  private async _fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = false
  ): Promise<HttpClientResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const [session, locale] = await Promise.all([
      getSession(),
      getUserLocale(),
    ]);

    const headers: HeadersInit = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    };

    if (!('Authorization' in headers)) {
      (headers as Record<string, string>).Authorization =
        `Bearer ${session?.user?.token}`;
    }

    const optionsWithCredentials: RequestInit = {
      credentials: 'include',
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, optionsWithCredentials);

      // Only attempt token refresh for non-refresh endpoints
      if (response.status === 401 && !retry) {
        const refreshed = await this.refreshToken(session?.user?.refresh_token);

        if (!refreshed?.accessToken || !refreshed?.refreshToken) {
          await logoutAction();
          throw new Error('Authentication failed');
        }

        optionsWithCredentials.headers = {
          ...optionsWithCredentials.headers,
          Authorization: `Bearer ${refreshed.accessToken}`,
        };

        // Use the new tokens from the refresh
        return this._fetch(endpoint, optionsWithCredentials, true);
      }

      const data = await response.json();

      return { data: data as T };
    } catch (error) {
      return {
        data: null,
        error: error as string,
      };
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}) {
    return this._fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<R, T = unknown>(
    endpoint: string,
    data?: T,
    options: RequestInit = {}
  ) {
    return this._fetch<R>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<R, T = unknown>(
    endpoint: string,
    data?: T,
    options: RequestInit = {}
  ) {
    return this._fetch<R>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async patch<R, T = unknown>(
    endpoint: string,
    data?: T,
    options: RequestInit = {}
  ) {
    return this._fetch<R>(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}) {
    return this._fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = HttpClient.getInstance();
