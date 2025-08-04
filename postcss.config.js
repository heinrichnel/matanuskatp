// postcss.config.js
export default {
  plugins: {
    "postcss-import": {},
    "postcss-nesting": {},
    tailwindcss: {}, // Correct plugin
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: { preset: "default" } } : {}),
  },
};
