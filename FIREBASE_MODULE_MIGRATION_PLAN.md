# Firebase Module Migration Plan

## Overview

This document outlines a step-by-step plan to migrate from the monolithic `firebase.ts` module to a more optimized, modular structure that enables better code-splitting.

## Why Code-Splitting?

Code-splitting improves application performance by:

1. Reducing the initial bundle size
2. Loading code on-demand as it's needed
3. Better caching of rarely changed modules
4. Faster startup time for the application

## New Structure

```
src/
├── firebase/
│   ├── core.ts                  // Basic Firebase initialization
│   ├── index.ts                 // Re-exports for backward compatibility
│   ├── tyres.ts                 // Existing tyre functionality
│   ├── tyreStores.ts            // Existing tyre stores functionality
│   └── services/
│       ├── trips.ts             // Trip-related Firebase operations
│       ├── diesel.ts            // Diesel-related Firebase operations
│       └── audit.ts             // Audit logs and missed loads operations
├── firebase-new.ts              // New entry point with dynamic imports
└── firebase.ts                  // Original file (to be deprecated)
```

## Migration Steps

### 1. For Files Only Using `db` or Basic Firebase Services

Update imports from:

```typescript
import { db } from "../firebase";
```

To:

```typescript
import { db } from "../firebase/core";
```

### 2. For Files Using Trip Functions

Update imports from:

```typescript
import { addTripToFirebase, updateTripInFirebase } from "../firebase";
```

To:

```typescript
import { addTripToFirebase, updateTripInFirebase } from "../firebase/services/trips";
```

### 3. For Files Using Diesel Functions

Update imports from:

```typescript
import { addDieselToFirebase, updateDieselInFirebase } from "../firebase";
```

To:

```typescript
import { addDieselToFirebase, updateDieselInFirebase } from "../firebase/services/diesel";
```

### 4. For Files Using Audit or Missed Load Functions

Update imports from:

```typescript
import { addAuditLogToFirebase, addMissedLoadToFirebase } from "../firebase";
```

To:

```typescript
import { addAuditLogToFirebase, addMissedLoadToFirebase } from "../firebase/services/audit";
```

### 5. For Files Using Tyre Store Functions

These imports can remain mostly unchanged as they're already modularized:

```typescript
import { addTyreStore, getTyreStoreById } from "../firebase/tyreStores";
```

### 6. Lazy Loading

For components that use Firebase services but don't need them immediately, consider using dynamic imports:

```typescript
// Instead of importing directly
import { addTripToFirebase } from "../firebase/services/trips";

// Use dynamic import
const handleAddTrip = async () => {
  const { addTripToFirebase } = await import("../firebase/services/trips");
  await addTripToFirebase(trip);
};
```

### 7. Gradual Migration

1. Start by migrating files with the simplest imports
2. Update one module at a time and test thoroughly
3. Use the original `firebase.ts` as a fallback during migration

## Completion

After all imports have been updated, the original `firebase.ts` file can be removed and replaced with `firebase-new.ts` (renamed to `firebase.ts`).

## Performance Monitoring

After migration, monitor bundle sizes and load times to verify improvements.
