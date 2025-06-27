import { genkit, z } from 'genkit';
import { mcpServer } from 'genkitx-mcp';

const ai = genkit({});

ai.defineTool(
  {
    name: 'add',
    description: 'add two numbers together',
    inputSchema: z.object({ a: z.number(), b: z.number() }),
    outputSchema: z.number(),
  },
  async ({ a, b }) => {
    return a + b;
  }
);

mcpServer(ai, { name: 'example_server', version: '0.0.1' }).start();