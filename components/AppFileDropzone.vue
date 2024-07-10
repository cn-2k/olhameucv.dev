<template>
  <div class="lg:h-auto mt-32 lg:mt-0 w-full lg:w-1/2">
    <div class="relative w-full">
      <img
        draggable="false"
        src="~/assets/images/cta.svg"
        class="absolute -top-28 lg:-top-32 w-64 lg:w-72 select-none"
      />
      <UploadSection
        :is-processing-file="isProcessingFile"
        @update:selected-file="selectedFile = $event"
        @handle-file="handleFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFileUpload } from "@/composables/useFileUpload";

const selectedFile = ref<File | null>(null);

const { handleFile, isProcessingFile } = useFileUpload();
</script>
