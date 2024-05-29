<template>
  <div
    ref="dropZoneRef"
    class="relative w-full flex justify-center items-center border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 border-dashed h-72 rounded-lg"
    :class="{
      'border-green-400': isOverDropZone,
    }"
  >
    <input
      id="file-upload"
      accept=".pdf"
      class="hidden"
      type="file"
      :disabled="isLoading || wantsToPay"
      @change="onFileSelect"
    />
    <!-- hidden label  -->
    <label
      for="file-upload"
      class="cursor-pointer absolute top-0 left-0 right-0 bottom-0 block"
    />
    <div
      v-if="!wantsToPay && !isLoading"
      class="z-10 text-center flex flex-col gap-2"
    >
      <!-- label button -->
      <label
        for="file-upload"
        class="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors font-bold tracking-wide rounded-md text-sm px-7 py-4"
      >
        Selecione o seu currículo (.pdf)
      </label>
      <p class="text-xs text-gray-400">ou arraste e solte o arquivo pdf aqui</p>
    </div>
    <div
      v-if="wantsToPay && !isLoading"
      class="z-10 flex flex-col gap-2 overflow-hidden"
    >
      <div>
        <p
          class="text-green-500 tracking-tight text-center font-semibold text-lg"
        >
          Arquivo processado com sucesso!
        </p>
      </div>
      <div class="flex flex-col lg:flex-row gap-2 mx-3">
        <Button
          size="sm"
          variant="default"
          class="flex gap-2 bg-green-600 font-semibold hover:bg-green-700"
          @click="emit('startPayment')"
        >
          <LucideWalletMinimal class="size-4" /> Continuar para o pagamento
        </Button>
        <Button
          size="sm"
          variant="default"
          class="flex gap-2 bg-blue-700 font-semibold hover:bg-blue-800"
          @click="wantsToPay = false"
        >
          Voltar
        </Button>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="text-sm text-center w-full text-zinc-600 items-center flex justify-center flex-col gap-4"
    >
      <LucideLoader class="animate-spin size-6" />
      {{
        isProcessingFile
          ? "Processando o arquivo..."
          : "Estamos analisando, só um momento..."
      }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";

const props = defineProps<{
  isProcessingFile: boolean
  isConfirmingPayment: boolean
}>();

const emit = defineEmits<{
  (event: "update:selectedFile", file: File | null): void
  (event: "handleFile", file: any): void
  (event: "startPayment"): void
}>();

const dropZoneRef = ref<HTMLElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);
const wantsToPay = ref(false);

const isLoading = computed(
  () => props.isProcessingFile || props.isConfirmingPayment
);

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;

  if (!file) return;

  if (file.type !== "application/pdf") {
    toast.error("Erro ao enviar o arquivo", {
      description: "O arquivo deve ser um PDF",
    });
    return;
  }

  if (file && file.type === "application/pdf") {
    emit("update:selectedFile", file);
    emit("handleFile", file);
    wantsToPay.value = true;
  }

  input.value = "";
}

function onDrop(file: File[] | null) {
  if (!file) return;

  if (file[0].type !== "application/pdf") {
    toast.error("Erro ao enviar o arquivo", {
      description: "O arquivo deve ser um PDF",
    });
    return;
  }

  if (file && file[0].type === "application/pdf") {
    emit("update:selectedFile", file[0]);
    emit("handleFile", file[0]);
    wantsToPay.value = true;
  }
}
</script>
