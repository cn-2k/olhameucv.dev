// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    RESEND_KEY: process.env.RESEND_KEY,
    OPEN_PIX: process.env.OPEN_PIX,
    turso: {
      databaseUrl: "",
      authToken: "",
    },
  },

  app: {
    head: {
      title: "olhameucv.dev",
      link: [
        {
          rel: "icon",
          href: "/favicon.png",
        },
      ],
      script: [
        {
          src: "https://plugin.openpix.com.br/v1/openpix.js",
          defer: true,
          async: true,
        },
      ],
    },
  },

  site: {
    url: "https://olhameucv.dev/",
  },

  css: ["@/assets/css/base.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
    "@vue-email/nuxt",
    "nuxt-og-image",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
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
      Inter: [300, 400, 500, 600, 800],
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

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: ".",
      },
    },
  },
});
