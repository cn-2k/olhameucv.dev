<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster rich-colors />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";

useSeoMeta({
  title: "olhameucv.ai",
  ogTitle: "👀 olhameucv.ai",
  description: "Receba uma avaliação rápida e inteligente do seu currículo, com dicas de recrutadores experientes para melhorar suas chances no mercado.",
  ogDescription: "Receba uma avaliação rápida e inteligente do seu currículo, com dicas de recrutadores experientes para melhorar suas chances no mercado.",
})

defineOgImageComponent("Frame", {
  headline: false,
  title: "👀 olhameucv.ai",
  description: "Receba uma avaliação rápida e inteligente do seu currículo, com dicas de recrutadores experientes para melhorar suas chances no mercado.",
})
</script>
