export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--main-bg)",
        sub: "var(--sub-bg)",
        nav: "var(--nav)",
        btn: "var(--color-btn)",
        navBtn: "var(--color-btn-nav)",
        textColorr: "var(--textColorr)",
        btnActive: "var(--color-btn-active)",
      },
    },
  },
};