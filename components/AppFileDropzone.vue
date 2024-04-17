<template>
  <div
    v-if="!showFeedback"
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
      <p class="text-xs text-gray-400">ou arraste e solte o arquivo aqui</p>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col items-center gap-4 p-10">
      <svg
        class="w-16 h-16 text-green-400 animate-bounce"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <p class="text-lg font-bold text-green-400">Overview</p>
      {{ feedback.response.experiences }}
      <p class="text-lg font-bold text-green-400">Feedback</p>
      {{ feedback.response.suggestions }}
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

const dropZoneRef = ref<HTMLElement>();
const showFeedback = ref(false);
const feedback = ref(null);

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);
const fileData = ref<
  { name: string; size: number; type: string; lastModified: number }[]
>([]);

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files;

  if (file) {
    handleFile(file[0]);
    console.log(file[0]);
  }
}

function onDrop(file: File[] | null) {
  fileData.value = [];
  if (file) {
    fileData.value = file.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    handleFile(file[0]);
    console.log(file[0]);
  }
}

async function handleFile(file: File | null) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:3000/api/resume/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    showFeedback.value = true;
    feedback.value = response.data;
  } catch (error) {
    console.error("Erro ao enviar o arquivo:", error);
  }
}
</script>
