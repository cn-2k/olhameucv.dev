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
});
