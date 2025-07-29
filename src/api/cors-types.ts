// Since @types/cors is installed, we can import the types directly
import * as cors from 'cors';
import { RequestHandler } from "express";

// Re-export the types for backward compatibility
export type CorsOptions = cors.CorsOptions;
export default cors;

// You can use this file like: import corsWithTypes from '../api/cors-types';
