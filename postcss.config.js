export default {
  plugins: {
    "postcss-nesting": {},
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
