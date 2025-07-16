import type { Plugin } from 'vite';

export function validateEnv(requiredVars: string[]): Plugin {
  return {
    name: 'vite-plugin-custom-validate-env',
    configResolved() {
      const missing = requiredVars.filter((key) => !process.env[key]);
      if (missing.length > 0) {
        throw new Error(
          `❌ Missing required environment variables:\n${missing
            .map((k) => ` - ${k}`)
            .join('\n')}\n\nFix your .env file or set them before building.`
        );
      }
    },
  };
}
