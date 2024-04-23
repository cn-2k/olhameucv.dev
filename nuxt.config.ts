// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    OPEN_PIX: process.env.OPEN_PIX,
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: "CV Analyser",
      script: [
        {
          src: "https://plugin.openpix.com.br/v1/openpix.js",
          body: true,
          async: true,
          defer: true,
        },
      ],
    },
  },
  css: ["@/assets/css/base.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
    "nuxt-og-image",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
  ],

  eslint: {
    config: {
      stylistic: {
        quotes: "double",
      },
    },
  },

  googleFonts: {
    base64: true,
    fontsDir: "assets/fonts",
    overwriting: true,
    families: {
      Inter: [300, 500, 800],
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
