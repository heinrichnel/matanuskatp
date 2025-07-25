# KiloCode Configuration Documentation

## Core Settings

```json
{
  "kilo-code.enabled": true,
  "kilo-code.agentMode": true,
  "kilo-code.agentModesAllowed": true,
  "kilo-code.customModesFile": true,
  "kilo-code.globalCustomModesFile": "~/.kilocode/custom_modes.yaml",
  "kilo-code.workflowDirectory": ".kilocode/workflows",
  "kilo-code.globalWorkflowDirectory": "~/.kilocode/workflows"
}
```

## Telemetry & Logging

```json
{
  "kilo-code.telemetry.enabled": true,
  "kilo-code.telemetry.level": "full",
  "kilo-code.logging.verbose": true
}
```

## Chat Features

```json
{
  "kilo-code.chat.renderRelatedFiles": true,
  "kilo-code.chat.inlineEnabled": true,
  "kilo-code.chat.autoApproveTools": true,
  "kilo-code.chat.codeSearch.enabled": true,
  "kilo-code.chat.showDiffSummary": true
}
```

## Edit Features

```json
{
  "kilo-code.edit.safeMode": true,
  "kilo-code.edit.autoStageCommits": true,
  "kilo-code.edit.auditTrail": true
}
```

## Prompt Configuration

```json
{
  "kilo-code.prompt.customInstructionFile": ".clinerules-{mode-slug}",
  "kilo-code.prompt.appendWorkspaceInstructions": true
}
```

## Security Settings

```json
{
  "kilo-code.security.confirmDestructiveEdits": true,
  "kilo-code.security.auditLogFile": ".kilocode/audit.log"
}
```

## Experimental Features

```json
{
  "kilo-code.experimental.features": [
    "multimodal",
    "workflowOrchestration"
  ]
}
```

## UI Settings


{
  "kilo-code.sidebar.enabled": true,
  "kilo-code.statusbar.showMode": true,
  "kilo-code.statusbar.showModeTooltip": true
}
```

## Agent Rules

### File Operations

#### onFileEdit Rules:

- Search entire 'src' directory for missing files before reporting
- Never create/delete files without explicit permission
- Report missing imports/components before taking action
- Preserve all working code
- Consolidate duplicates while preserving functionality
- Verify all routes against navigation/sidebar
- Report unlinked/missing routes
- Always request permission for file operations
- Never remove functional code without permission
- Validate mobile/QR/modal/map components on every edit

#### onSave Rules:

- Re-run file edit validations
- Validate all imports and routes
- Re-check mobile/QR/modal/map features

#### onProjectBuild Rules:

- Scan for missing/duplicate components
- Never auto-create/delete files
- Report all findings for confirmation
- List missing mobile/QR/modal/map components

## Layout Management

```json
{
  "layout": {
    "enforceMainLayout": true,
    "requiredComponents": ["navbar", "sidebar", "notifications", "footer"],
    "preventDuplication": true
  }
}
```

## Sidebar Management

```json
{
  "sidebar": {
    "validateRoutes": true,
    "requireComponentImport": true,
    "autoFlagMissingRoutes": true,
    "ensureSubMenuLogic": true,
    "checkMobileQRModalMaps": true
  }
}
```

## Import Management

```json
{
  "imports": {
    "scope": {
      "fileTypes": [".tsx"],
      "directories": ["src/"],
      "focus": ["pages", "components", "mobile", "qr", "modal", "maps"]
    },
    "rules": {
      "validatePaths": true,
      "searchEntireTree": true,
      "allowAutoCreate": false,
      "allowDelete": false,
      "allowCommentOut": false
    },
    "reporting": {
      "listUnresolvedImports": true,
      "showPathChanges": true,
      "requirePermission": [
        "fileCreation",
        "componentCreation",
        "multiFileChanges"
      ]
    }
  }
}
```

## CRUD Functionality

```json
{
  "crudFunctionality": {
    "validateScreens": ["edit", "delete", "view"],
    "modules": [
      "trips",
      "drivers",
      "workshop",
      "tyres",
      "diesel",
      "clients",
      "inventory"
    ],
    "ensureOperations": ["create", "read", "update", "delete"],
    "validateModalAccess": true
  }
}
```

## Data View Patterns

```json
{
  "dataView": {
    "softViewPattern": {
      "progressiveLoading": true,
      "optimisticUpdates": true,
      "fallbackStates": true,
      "realtimeSync": true
    },
    "connectivity": {
      "loadingStates": true,
      "offlineHandling": true,
      "firestorePagination": true,
      "realtimeUpdates": true,
      "dataValidation": true
    }
  }
}
```

## Special Features

```json
{
  "mobileQRCodeModalMapFeatures": {
    "requireMobileSupport": true,
    "requireQRCode": true,
    "requireModalSupport": true,
    "requireGoogleMaps": true,
    "validateImportAndRouting": true
  },
  "mobileSupport": {
    "validateComponents": true,
    "ensureResponsiveDesign": true,
    "checkForMobileSpecificFeatures": true,
    "reportMissingFeatures": true
  }
}
```

## Document Sync

```json
{
  "documentSync": {
    "validateModels": true,
    "ensureCollectionAccess": true,
    "validateUIHandlers": true
  }
}
```

## Integration Rules

```json
{
  "integration": {
    "permitted": {
      "importEdits": true,
      "componentScaffolding": true,
      "sidebarSync": true,
      "crudFlowFixes": true
    },
    "forbidden": {
      "featureRemoval": true,
      "workflowChanges": true
    },
    "deduplication": {
      "preserveFeatures": true,
      "useRobustBase": true,
      "integrateAllFeatures": true,
      "neverRemoveLogic": true,
      "requireApproval": true
    }
  }
}
```

## Permissions

```json
{
  "permissions": {
    "allowAutoEdit": true,
    "allowComponentScaffolding": true,
    "allowSidebarUpdate": true,
    "allowImportAutoFix": true,
    "reportMajorChanges": true,
    "requireApproval": [
      "fileCreation",
      "componentAddition",
      "duplicateRemoval",
      "hierarchyChanges",
      "routingChanges"
    ]
  }
}
```

## Exclusions

- No existing functionality may be deleted/commented without explicit request
- Never modify files/components/imports/routes without permission

## File Type Rules

```json
{
  "fileTypes": {
    "typescript": {
      "extensions": [".ts", ".tsx"],
      "rules": [
        "Ensure valid imports and component references",
        "Never remove functional code without permission"
      ]
    },
    "json": {
      "extensions": [".json"],
      "rules": [
        "Validate JSON structure",
        "Never alter critical configurations without permission"
      ]
    }
  }
}
```

## Vite Configuration Rules

```json
{
  "rules": {
    "vite.config.ts": {
      "manualChunks": [
        "react-ui",
        "firebase-core",
        "firebase-firestore",
        "firebase-storage",
        "charts",
        "pdf",
        "spreadsheet",
        "utils",
        "icons",
        "mui",
        "mobileQRCodeModalMapFeatures"
      ],
      "ignoreImports": [
        "@ant-design",
        "@mui"
      ]
    }
  }
}
```

This markdown file provides comprehensive documentation of your KiloCode configuration in a well-organized format that's easy to read and maintain. The structure follows logical groupings of related settings and includes both JSON snippets for machine-readable content and bullet points for human-readable rules.