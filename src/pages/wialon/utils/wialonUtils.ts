/**
 * Utilities for working with Wialon data
 */

import { WialonPosition, WialonUnit } from "../../../types/wialon";

/**
 * Safely gets a unit's position regardless of access pattern
 */
export function getUnitPosition(unit: WialonUnit): WialonPosition | undefined {
  if (!unit) return undefined;

  // Try method-based access first
  if (typeof unit.getPosition === "function") {
    return unit.getPosition();
  }

  // Fall back to property-based access
  return unit.lastPosition;
}

/**
 * Safely gets a unit's ID regardless of access pattern
 */
export function getUnitId(unit: WialonUnit): number | undefined {
  if (!unit) return undefined;

  // Try method-based access first
  if (typeof unit.getId === "function") {
    return unit.getId();
  }

  // Fall back to property-based access
  return unit.id;
}

/**
 * Safely gets a unit's name regardless of access pattern
 */
export function getUnitName(unit: WialonUnit): string | undefined {
  if (!unit) return undefined;

  // Try method-based access first
  if (typeof unit.getName === "function") {
    return unit.getName();
  }

  // Fall back to property-based access
  return unit.name;
}

/**
 * Safely gets a unit's UID regardless of access pattern
 */
export function getUnitUID(unit: WialonUnit): string | undefined {
  if (!unit) return undefined;

  // Try method-based access first
  if (typeof unit.getUID === "function") {
    return unit.getUID();
  }

  // Fall back to property-based access
  return unit.uid;
}
