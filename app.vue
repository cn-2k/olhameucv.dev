<script setup>
import { Toaster } from "@/components/ui/sonner";

const isPixPaid = ref(false);

const gerarCorrelationIdUnico = (
  len,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) =>
  [...Array(len)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");

const handleClickPix = () => {
  currentCorrelationID.value = gerarCorrelationIdUnico(30);
  window.$openpix.push([
    "pix",
    {
      value: 1000,
      correlationID: currentCorrelationID.value,
      description: "Avaliação de currículo por especialista",
    },
  ]);
};

const currentCorrelationID = ref(null);

onMounted(() => {
  window.$openpix = window.$openpix || [];
  window.$openpix.push(["config", { appID: import.meta.env.VITE_OPEN_PIX }]);

  const logEvents = (event) => {
    console.log("logEvents:", event);

    if (event.type === "PAYMENT_STATUS" && event.data.status === "COMPLETED") {
      console.log("Correlation ID Data:", event.data);
      console.log("Correlation ID", currentCorrelationID.value);
      // aqui da pra saber o currenCorrelationID que foi feito e qual foi pago...

      // podemos armazenar isso em uma lista no localstorage e depois fazer a verificação
      // se o usuário já pagou ou não
      isPixPaid.value = true;
    }
  };

  window.$openpix.addEventListener(logEvents);
});
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col h-screen justify-center items-center w-full">
      <div class="text-center flex flex-col gap-2 mb-4">
        <h1 class="text-4xl font-bold text-zinc-700">✨ CV Analyser</h1>
        <p class="text-sm font-light text-zinc-500 text-center">
          Receba feedbacks e dicas sobre o seu currículo de forma inteligente!
        </p>
      </div>
      <AppFileDropzone v-if="isPixPaid" />
      <div v-else class="flex flex-col gap-4">
        <button
          class="bg-zinc-500 text-white px-4 py-2 rounded-md"
          @click="handleClickPix"
        >
          Pagar com PIX
        </button>
      </div>
    </div>
  </ClientOnly>
  <Toaster rich-colors />
</template>
