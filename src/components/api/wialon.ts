// src/api/wialon.ts

import type { WialonUnit, WialonPosition } from '../types/wialon';

const WIALON_API_URL = import.meta.env.VITE_WIALON_API_URL || 'https://hst-api.wialon.com';
const WIALON_SESSION_TOKEN = import.meta.env.VITE_WIALON_SESSION_TOKEN;

/** 
 * Raw Wialon API response type for search_items
 * You can expand this based on API docs
 */
interface WialonApiResponse {
  error?: number;
  items?: Array<{
    id: number;
    nm: string;            // Name
    pos?: WialonPosition;  // Position object, if available
    ic?: string;           // Icon URL
    // add other properties as needed
  }>;
}

/**
 * Fetch units (vehicles/trackers) from Wialon API
 * Returns typed array matching your WialonUnit interface shape (loosely)
 */
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

  // Map raw items to objects implementing WialonUnit interface
  const units: WialonUnit[] = (json.items || []).map((item) => ({
    getId: () => item.id,
    getName: () => item.nm,
    getPosition: () => item.pos,
    getIconUrl: (size?: number) => item.ic ? `${item.ic}${size ? `?size=${size}` : ''}` : '',
  }));

  return units;
}
