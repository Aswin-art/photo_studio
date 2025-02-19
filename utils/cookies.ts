import Cookies from 'universal-cookie';

const cookies = new Cookies();

interface CookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
}

const DEFAULT_MAX_AGE = 30 * 60;
const DEFAULT_PATH = '/';

export const cookieUtils = {
  set: <T>(
    key: string,
    value: T,
    options: CookieOptions = {}
  ): void => {
    const defaultOptions: CookieOptions = {
      path: DEFAULT_PATH,
      maxAge: DEFAULT_MAX_AGE,
      ...options,
    };

    cookies.set(key, value, defaultOptions);
  },

  get: <T>(key: string): T | null => {
    try {
      const value = cookies.get(key);
      return value || null;
    } catch {
      return null;
    }
  },

  remove: (key: string, options: CookieOptions = {}): void => {
    const defaultOptions: CookieOptions = {
      path: DEFAULT_PATH,
      ...options,
    };
    
    cookies.remove(key, defaultOptions);
  },

  exists: (key: string): boolean => {
    return !!cookies.get(key);
  },

  clearAll: (): void => {
    const allCookies = cookies.getAll();
    Object.keys(allCookies).forEach((key) => {
      cookies.remove(key, { path: DEFAULT_PATH });
    });
  },
};