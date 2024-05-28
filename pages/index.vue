<script setup>
import { useRouter } from "vue-router";
import ContentHero from "@/components/ContentHero.vue";
import { Toaster } from "@/components/ui/sonner";

const router = useRouter();

const showFeedback = (isConfirm) => {
  if (isConfirm) router.push("/confirm");
};
</script>

<template>
  <ClientOnly>
    <section
      class="flex flex-col justify-between items-center gap-6 lg:flex-row 2xl:mt-48"
    >
      <ContentHero />
      <AppFileDropzone @update:show-feedback="showFeedback" />
    </section>
    <Toaster rich-colors />
  </ClientOnly>
</template>
