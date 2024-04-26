import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

// Default are on https://tailwindcss.nuxtjs.org/tailwind/config#default-configuration
export default <Partial<Config>>{
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
      },
      backgroundImage: {
        "hero-pattern": "url('~/assets/images/bg.svg')",
      },
      screens: {
        "3xl": "1700px",
      },
    },
  },
  plugins: [animate],
}
