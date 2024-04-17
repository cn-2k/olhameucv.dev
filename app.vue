<template>
  <ClientOnly>
    <div class="flex flex-col h-screen justify-center items-center w-full">
      <div class="text-center flex flex-col gap-2 mb-4">
        <h1 class="text-4xl font-bold text-zinc-700">
          ✨ CV Analyser
        </h1>
        <p class="text-sm font-light text-zinc-500 text-center">
          Receba feedbacks e dicas sobre o seu currículo de forma inteligente!
        </p>
      </div>
      <AppFileDropzone />
    </div>
  </ClientOnly>
  <Toaster rich-colors />
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"
</script>
