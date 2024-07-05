<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster rich-colors />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";

useSeoMeta({
  title: "olhameucv.dev",
  ogTitle: "👀 olhameucv.dev",
  description: "Receba uma avaliação rápida e inteligente do seu currículo, com dicas de recrutadores experientes para melhorar suas chances no mercado de desenvolvimento.",
  ogDescription: "Receba uma avaliação rápida e inteligente do seu currículo, com dicas de recrutadores experientes para melhorar suas chances no mercado de desenvolvimento.",
})

defineOgImageComponent("Frame", {
  headline: false,
  title: "👀 olhameucv.dev",
  description: "Receba uma avaliação rápida e inteligente do seu currículo, com dicas de recrutadores experientes para melhorar suas chances no mercado de desenvolvimento.",
})
</script>
