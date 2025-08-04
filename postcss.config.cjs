// postcss.config.cjs

/**
 * PostCSS config for Vite + Tailwind CSS v4+
 * - Handles imports and nesting
 * - Uses the new @tailwindcss/postcss plugin (required for Tailwind 4.x+)
 * - Adds autoprefixer for cross-browser support
 * - Adds cssnano for production minification
 */

const plugins = {
  "postcss-import": {},          // Enables @import in CSS
  "postcss-nesting": {},         // Enables CSS nesting
  "@tailwindcss/postcss": {},    // Tailwind v4+ official PostCSS plugin
  autoprefixer: {},              // Adds vendor prefixes
};

if (process.env.NODE_ENV === "production") {
  plugins.cssnano = { preset: "default" }; // Minify CSS only in production
}

module.exports = { plugins };
