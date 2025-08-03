// postcss.config.js
export default {
  plugins: {
    "postcss-import": {},
    "postcss-nesting": {},
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
