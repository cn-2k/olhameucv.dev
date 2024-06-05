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
        :is-confirming-payment="isConfirmingPayment"
        @update:selected-file="selectedFile = $event"
        @handle-file="handleFile"
        @start-payment="starPayment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFileUpload } from "@/composables/useFileUpload";

const emit = defineEmits<{
  (e: "update:showFeedback", value: boolean): boolean
}>();

const selectedFile = ref<File | null>(null);

const {
  showFeedback,
  feedback,
  handleFile,
  isProcessingFile,
  isConfirmingPayment,
  isPixPaid,
  starPayment,
} = useFileUpload();

watch(
  () => showFeedback.value,
  () => {
    emit("update:showFeedback", showFeedback.value);
    if (showFeedback.value === false) {
      isPixPaid.value = false;
      feedback.value = "";
    }
  },
  { immediate: true }
);
</script>
