<template>
  <div class="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end">
    <Popover :open="popOverOpen">
      <PopoverTrigger>
        <div class="bg-green-500 rounded-full p-4 text-white flex items-center justify-center group" @click="popOverOpen = !popOverOpen">
          <LucideMessageCircleQuestion v-if="!popOverOpen" class="size-7" />
          <LucideX v-if="popOverOpen" class="size-7" />
          <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
            <span class="pl-2 font-semibold">{{ !popOverOpen ? 'Suporte' : 'Fechar' }}</span>
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" :align-offset="10" :side-offset="10" class="w-96 flex flex-col p-0">
        <div class="bg-green-500 rounded-t-md p-6 text-sm text-white font-medium">Clique no nosso contato abaixo para entrar em contato e obter suporte.</div>
        <div class="h-32 flex flex-col items-center justify-center">
          <NuxtLink :href="whatsappLink" target="_blank" class="flex w-[90%] items-center gap-3 hover:bg-gray-100 hover:cursor-pointer transition-colors p-3 rounded-md">
            <img src="~/assets/images/whatsapp-profile.png" class="size-20 rounded-full" alt="">
            <div class="flex flex-col text-sm">
              <p class="text-xs">Suporte (WhatsApp)</p>
              <p class="text-lg font-semibold text-zinc-700">olhameucv<span class="text-blue-700/70">.dev</span></p>
            </div>
          </NuxtLink>
        </div>
        <div v-if="globalStore.processId" class="p-3 text-center border-t">
          <p class="text-xs">Seu último código de processamento:</p>
          <span class="text-center text-zinc-600 text-xs">{{ globalStore.processId }}</span>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGlobalStore } from "@/store/GlobalStore";

const globalStore = useGlobalStore();
const supportMessage = ref<string>("Olá! Gostaria de obter mais informações sobre o serviço que a plataforma oferece.");
const popOverOpen = ref<boolean>(false)

const storeId = computed(() => {
  return globalStore.processId
})

watchEffect(() => {
  if (globalStore.processId) {
    supportMessage.value = `
    Olá, gostaria de obter mais informações sobre a minha recente avaliação no site.\n
    Código de processamento: ${storeId.value}
    `;
  }
})

const whatsappLink = computed(() => {
  const encodedMessage = encodeURIComponent(supportMessage.value);
  return `https://wa.me/5512988251071?text=${encodedMessage}`;
});
</script>
