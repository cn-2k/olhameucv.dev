<template>
  <div
    ref="dropZoneRef"
    class="relative w-4/5 max-w-screen-xl flex justify-center items-center border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 border-dashed h-72 rounded-lg"
    :class="{
      'border-green-400': isOverDropZone,
    }"
  >
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
        Selecione o seu currículo
      </label>
      <p class="text-xs text-gray-400">
        ou arraste e solte o arquivo aqui
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios"

const dropZoneRef = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
const fileData = ref<{ name: string, size: number, type: string, lastModified: number }[]>([])

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files

  if (file) {
    handleFile(file[0])
    console.log(file[0])
  }
}

function onDrop(file: File[] | null) {
  fileData.value = []
  if (file) {
    fileData.value = file.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))

    handleFile(file[0])
    console.log(file[0])
  }
}

async function handleFile(file: File | null) {
  if (!file) return

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post("http://localhost:3333/upload-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log(response)
  }
  catch (error) {
    console.error("Erro ao enviar o arquivo:", error)
  }
}
</script>
