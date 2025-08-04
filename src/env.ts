// src/env.ts

export const isDev: boolean = typeof import.meta !== "undefined" && !!import.meta.env?.DEV;

export const apiUrl: string =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "";
