// postcss.config.js
export default {
  plugins: {
    "postcss-import": {},
    "postcss-nesting": {},
    "@tailwindcss/postcss": {}, // <-- THIS IS CORRECT FOR TAILWIND V4+
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: { preset: "default" } } : {}),
  },
};
