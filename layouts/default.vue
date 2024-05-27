<script setup>
import Header from "@/components/layout/Header.vue";
</script>

<template>
  <div class="pb-6 sm:pb-8 lg:pb-12">
    <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
      <Header />
      <slot />
    </div>
  </div>
</template>
