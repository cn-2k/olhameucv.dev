<template>
  <div
    class="relative w-full flex justify-center items-center border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 border-dashed h-72 rounded-lg"
  >
    <div class="z-10 flex flex-col gap-2 overflow-hidden">
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
          @click="globalStore.setResume(null)"
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
import { useGlobalStore } from "@/store/GlobalStore";

const globalStore = useGlobalStore();

defineEmits<{
  (e: "startPayment"): void;
}>();

const isLoading = ref(false);
const isProcessingFile = ref(false);
</script>
