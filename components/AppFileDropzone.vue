<template>
  <div class="relative w-full">
    <img
      v-if="!showFeedback"
      src="../assets/images/cta.png"
      class="absolute -top-24 lg:-top-36 w-44 lg:w-64"
    >
    <UploadSection
      v-if="!showFeedback"
      :is-loading="isLoading"
      :show-feedback="showFeedback"
      @update:selected-file="selectedFile = $event"
    />
    <FeedbackSection
      v-if="showFeedback"
      :feedback="feedback"
      :show-feedback="showFeedback"
      @close-feedback="setShowFeedback(false)"
    />
  </div>
</template>

<script setup lang="ts">
import { usePayment } from "@/composables/usePayment"
import { useFileUpload } from "@/composables/useFileUpload"
import type { FeedbackProps } from "@/entities/Feedback"

onMounted(() => {
  openPixSetup()
  addPaymentListener()
})

onUnmounted(() => {
  removePaymentListener()
})

const emit = defineEmits<{
  (e: "update:showFeedback", value: boolean): boolean
}>()

const showFeedback = ref<boolean>(false)
const feedback = ref<FeedbackProps | null>(null)
const selectedFile = ref<File | null>(null)

const { openPixSetup, addPaymentListener, removePaymentListener, isPixPaid } = usePayment()
const { handleFile, isLoading } = useFileUpload((data) => {
  feedback.value = data
  setShowFeedback(true)
})

function setShowFeedback(value: boolean) {
  showFeedback.value = value
  emit("update:showFeedback", value)
}

watch(
  () => isPixPaid.value,
  () => {
    if (isPixPaid.value) {
      handleFile(selectedFile.value)
    }
  },
)
</script>
