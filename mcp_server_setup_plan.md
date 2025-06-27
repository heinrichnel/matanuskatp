# MCP Server Setup Plan

## Overview

This document outlines the plan to set up a new MCP server in the `genkit-mcp-server/` directory. The process is divided into two main phases: setup and configuration, followed by a demonstration of the server's functionality.

## Phase 1: Setup and Configuration

1.  **Create Server Directory**: Create the `genkit-mcp-server/` directory to house the new server.
2.  **Initialize Node.js Project**: Create a `package.json` file in the new directory with the necessary dependencies: `genkit`, `genkitx-mcp`, `typescript`, and `ts-node`.
3.  **Create Server File**: Create an `index.ts` file inside `genkit-mcp-server/`. This file will contain the Genkit code to define a simple `add` tool and start the MCP server.
4.  **Install Dependencies**: Run `npm install` within the `genkit-mcp-server/` directory to install the specified dependencies.
5.  **Configure Kilo Code MCP Settings**: Update the `.kilocode/mcp.json` file to register the new server. The server will be named `github.com/firebase/genkit/tree/HEAD/js/plugins/mcp` and configured to run from the new directory.

## Phase 2: Demonstration

1.  **Start the Server**: Start the MCP server from the `genkit-mcp-server/` directory.
2.  **Demonstrate a Tool**: Use the `add` tool to verify that the server is running and functioning correctly.

## Visual Plan

```mermaid
graph TD
    subgraph Phase 1: Setup and Configuration
        A[Create genkit-mcp-server/ directory] --> B{Initialize Node.js project (package.json)};
        B --> C[Create genkit-mcp-server/index.ts];
        C --> D{Install npm dependencies};
        D --> E{Configure .kilocode/mcp.json};
    end

    subgraph Phase 2: Demonstration
        E --> F{Start MCP Server};
        F --> G{Use the 'add' tool};
    end