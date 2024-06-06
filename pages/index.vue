<template>
  <ClientOnly>
    <section
      class="flex flex-col justify-between items-center gap-6 lg:flex-row 2xl:mt-48"
    >
      <ContentHero />
      <AppFileDropzone @update:show-feedback="showFeedback" />
    </section>
    <template #fallback>
      <div class="flex flex-col justify-between items-center gap-6 lg:flex-row mt-24 2xl:mt-72">
        <div class="flex flex-col items-center lg:items-start gap-3">
          <Skeleton class="h-10 w-[650px] rounded-xl mb-2" />
          <Skeleton class="h-2 w-[550px] rounded-xl" />
          <Skeleton class="h-2 w-[660px] rounded-xl" />
          <Skeleton class="h-2 w-[660px] rounded-xl" />
          <Skeleton class="h-2 w-[660px] rounded-xl" />
        </div>
        <div class="w-full lg:w-1/2">
          <Skeleton class="h-72" />
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ContentHero from "@/components/ContentHero.vue";

const router = useRouter();

const showFeedback = (isConfirm: boolean) => {
  if (isConfirm) router.push("/confirm");
};
</script>
