<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster rich-colors />
    <WhatsAppWidget />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import WhatsAppWidget from "@/components/Widget/WhatsAppWidget.vue";

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" }
  ],
  htmlAttrs: {
    lang: "en"
  }
})

useSeoMeta({
  titleTemplate: "olhameucv.dev",
  ogImage: "https://i.imgur.com/DcG3bk6.png",
  twitterImage: "https://i.imgur.com/DcG3bk6.png",
  twitterCard: "summary_large_image"
})
</script>
