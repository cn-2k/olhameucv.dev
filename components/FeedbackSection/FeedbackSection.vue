<template>
  <div
    class="relative w-full max-w-screen-2xl p-4 border rounded-md shadow-lg bg-white"
  >
    <div
      class="flex flex-col items-center py-5 px-10 gap-4 antialiased"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 24 24"
      ><path
        fill="rgb(74 222 128)"
        d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
      /></svg>
      <p class="text-lg font-bold text-zinc-600">
        🎉 Que bacana! Seu currículo <span class="text-green-500">foi analisado</span>, verifique o resultado abaixo:
      </p>
      <div
        v-if="feedbackResponse"
        class="flex flex-col lg:flex-row gap-8 mt-4"
      >
        <div
          class="space-y-2"
        >
          <h2 class="flex items-center gap-2 text-lg font-bold text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
            /></svg> Visão geral
          </h2>
          <p class="text-justify text-base tracking-tight text-zinc-800">
            {{ feedbackResponse.response.experiences }}
          </p>
        </div>
        <div class="space-y-2">
          <h2 class="flex items-center gap-2 text-lg font-bold text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8.075q.45 0 .85.188t.675.537l3.925 4.725q.225.275.35.6t.125.675V20q0 .675-.612.925T18.3 20.7L14 16.45q-.425.275-.925.413T12 17q-1.65 0-2.825-1.175T8 13t1.175-2.825T12 9t2.825 1.175T16 13q0 .575-.137 1.075T15.45 15L18 17.6V8.7L14.05 4H6v16h8.325q.5 0 .75.313t.25.687t-.25.688t-.75.312zm6-7q.825 0 1.413-.587T14 13t-.587-1.412T12 11t-1.412.588T10 13t.588 1.413T12 15m0-2"
            /></svg> Feedback
          </h2>
          <p class="text-justify text-base tracking-tight text-zinc-800">
            {{ feedbackResponse.response.suggestions }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-10 text-zinc-800">
      <div class="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
        >
          <LucideMail class="size-4 mr-2" /> Enviar análise por e-mail
        </Button>
        <Button
          variant="outline"
          size="sm"
          class="transition-colors"
          @click="handleCloseFeedback"
        >
          <LucideArrowLeft class="size-4 mr-2" /> Avaliar mais 😍
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FeedbackProps } from "@/entities/Feedback"

const props = defineProps<{
  feedback: string
}>()

const emit = defineEmits<{
  (e: "close-feedback"): void
}>()

const feedbackResponse: FeedbackProps | null = JSON.parse(String(props.feedback))

function handleCloseFeedback() {
  emit("close-feedback")
}
</script>
