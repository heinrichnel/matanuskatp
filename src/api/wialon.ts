import type { WialonUnit, WialonPosition } from '../types/wialon';

const WIALON_API_URL = 'https://hosting.wialon.com';
const WIALON_SESSION_TOKEN = 'c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053';

/** Raw Wialon API response type for search_items */
interface WialonApiResponse {
  error?: number;
  items?: Array<{
    id: number;
    nm: string;
    pos?: WialonPosition;
    ic?: string;
  }>;
}

export async function getUnits(): Promise<WialonUnit[]> {
  const params = new URLSearchParams({
    svc: 'core/search_items',
    params: JSON.stringify({
      spec: {
        itemsType: 'avl_unit',
        propName: 'sys_name',
        propValueMask: '*',
        sortType: 'sys_name',
      },
      force: 1,
      flags: 1,
      from: 0,
      to: 0,
    }),
    sid: WIALON_SESSION_TOKEN,
  });

  const url = `${WIALON_API_URL}/wialon/ajax.html?${params.toString()}`;
  const response = await fetch(url);
  const json: WialonApiResponse = await response.json();

  if (json.error) {
    throw new Error(`Wialon API error: ${json.error}`);
  }

  return (json.items || []).map((item) => ({
    getId: () => item.id,
    getName: () => item.nm,
    getPosition: () => item.pos,
    getIconUrl: (size?: number) => item.ic ? `${item.ic}${size ? `?size=${size}` : ''}` : '',
  }));
}
