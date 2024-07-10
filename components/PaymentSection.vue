<template>
  <div class="lg:h-auto mt-32 lg:mt-0 w-full lg:w-1/2">
    <div class="relative w-full">
      <img
        draggable="false"
        src="~/assets/images/cta.svg"
        class="absolute -top-28 lg:-top-32 w-64 lg:w-72 select-none"
      />
      <div
        class="relative w-full flex justify-center items-center border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200 border-dashed h-72 rounded-lg"
      >
        <div v-if="!isExamine" class="z-10 flex flex-col gap-2 overflow-hidden">
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
              @click="pixStore.startPayment"
            >
              <LucideWalletMinimal class="size-4" /> Continuar para o pagamento
            </Button>
            <Button
              size="sm"
              variant="default"
              class="flex gap-2 bg-blue-700 font-semibold hover:bg-blue-800"
              @click="globalStore.setResume(false)"
            >
              Voltar
            </Button>
          </div>
        </div>
        <div
          v-if="isExamine"
          class="text-sm text-center w-full text-zinc-600 items-center flex justify-center flex-col gap-4"
        >
          <LucideLoader class="animate-spin size-6" />
          Estamos analisando, só um momento...
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from "@/store/GlobalStore";
import { usePixStore } from "@/store/PixStore";

const globalStore = useGlobalStore();
const pixStore = usePixStore();
const { isExamine } = storeToRefs(pixStore);
</script>
