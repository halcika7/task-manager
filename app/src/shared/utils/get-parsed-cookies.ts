import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export type ParsedCookies = {
  name: string;
  value: string;
  options: ResponseCookie;
}[];

export const getParsedCookies = (setCookieHeader: string): ParsedCookies => {
  const cookiesArray = setCookieHeader.split(/,(?=[^;]+?=)/);
  const parsedCookies = cookiesArray.map(cookie => {
    const [keyValue, ...attributes] = cookie.split('; '); // Split by "; "
    const [name, value] = keyValue.split('='); // Get the name and value

    // Convert attributes into ResponseCookie options
    const cookieOptions: ResponseCookie = attributes.reduce((acc, attr) => {
      const [attrName, attrValue] = attr.split('=');
      const key = attrName.toLowerCase();

      switch (key) {
        case 'expires':
          acc.expires = new Date(attrValue);
          break;
        case 'max-age':
          acc.maxAge = parseInt(attrValue);
          break;
        case 'domain':
          acc.domain = attrValue;
          break;
        case 'path':
          acc.path = attrValue;
          break;
        case 'secure':
          acc.secure = true;
          break;
        case 'httponly':
          acc.httpOnly = true;
          break;
        case 'samesite':
          acc.sameSite = attrValue as 'lax' | 'strict' | 'none';
          break;
      }
      return acc;
    }, {} as ResponseCookie);

    return {
      name: name.trim(),
      value: value.trim(),
      options: cookieOptions,
    };
  });

  return parsedCookies;
};
