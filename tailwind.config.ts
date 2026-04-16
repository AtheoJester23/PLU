export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--main-bg)",
        sub: "var(--sub-bg)",
      },
    },
  },
};