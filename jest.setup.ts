import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for Node <18 (for JSDOM compatibility)
if (typeof global.TextEncoder === "undefined") {
  // @ts-ignore: Polyfill for Node environments
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  // @ts-ignore: Polyfill for Node environments
  global.TextDecoder = TextDecoder;
}
