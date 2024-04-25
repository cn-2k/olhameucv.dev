<template>
  <div
    ref="dropZoneRef"
    class="relative w-full flex justify-center items-center border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 border-dashed h-72 rounded-lg"
    :class="{
      'border-green-400': isOverDropZone,
    }"
  >
    <div v-if="!showFeedback && !isLoading">
      <label class="cursor-pointer absolute top-0 left-0 right-0 bottom-0 block">
        <input
          id="file-upload"
          accept=".pdf"
          class="hidden"
          type="file"
          @change="onFileSelect"
        />
      </label>
      <div class="z-50 text-center flex flex-col gap-2">
        <label
          for="file-upload"
          class="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors font-bold tracking-wide rounded-md text-sm px-7 py-4"
        >
          Selecione o seu currículo (.pdf)
        </label>
        <p class="text-xs text-gray-400">
          ou arraste e solte o arquivo pdf aqui
        </p>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="text-sm text-center w-full text-zinc-600 items-center flex justify-center flex-col gap-4"
    >
      <LucideLoader class="animate-spin size-6" />
      Analisando o currículo...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner"

defineProps<{
  showFeedback: boolean
  isLoading: boolean
}>()

const emit = defineEmits<{
  (event: "update:selectedFile", file: File | null): void
}>()

const dropZoneRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
const { startPayment } = usePayment()

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files ? input.files[0] : null

  if (!file) return

  if (file.type !== "application/pdf") {
    toast.error("Erro ao enviar o arquivo", {
      description: "O arquivo deve ser um PDF",
    })
    return
  }

  if (file && file.type === "application/pdf") {
    emit("update:selectedFile", file)
    startPayment()
  }

  input.value = ""
}

function onDrop(file: File[] | null) {
  if (!file) return

  if (file[0].type !== "application/pdf") {
    toast.error("Erro ao enviar o arquivo", {
      description: "O arquivo deve ser um PDF",
    })
    return
  }

  if (file && file[0].type === "application/pdf") {
    emit("update:selectedFile", file[0])
    startPayment()
  }
}
</script>
