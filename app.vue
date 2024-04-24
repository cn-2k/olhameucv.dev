<template>
  <ClientOnly>
    <div class="pb-6 sm:pb-8 lg:pb-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <header class="mb-8 flex items-center justify-between py-4 md:mb-12 md:py-8 xl:mb-16">
          <a
            href="/"
            class="inline-flex items-center gap-2.5 text-xl text-zinc-700 font-semibold md:text-2xl"
            aria-label="logo"
          >
            ✨ CV Analyser
          </a>
        </header>

        <section class="flex flex-col justify-between items-center gap-6 lg:flex-row 2xl:mt-48">
          <!-- content - start -->
          <div class="flex gap-4 flex-col justify-center sm:text-center lg:py-12 lg:text-left w-full lg:w-1/2 xl:py-24">
            <h1 class="text-5xl tracking-tighter font-semibold text-zinc-600">
              Dê um <span class="text-yellow-400">boost</span> no seu currículo 🚀
            </h1>

            <p class="mb-8 leading-relaxed text-zinc-600 md:mb-2 lg:w-full xl:text-lg">
              Receba feedbacks e dicas sobre o seu currículo através de inteligência artificial, a análise é feita rapidamente e de forma inteligente, dê o primeiro passo para a sua carreira dos sonhos!
            </p>

            <blockquote class="text-sm text-end italic text-zinc-400 dark:text-white text-pretty">
              <svg
                class="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 14"
              >
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
              </svg>
              <p>O sucesso não é definitivo, o fracasso não é fatal: o que importa é a coragem de continuar - Winston Churchill</p>
            </blockquote>
          </div>
          <!-- content - end -->

          <!-- component - start -->
          <div
            class="lg:h-auto mt-32 lg:mt-0"
            :class="[parentShowFeedback ? 'w-full' : 'w-full lg:w-1/2']"
          >
            <AppFileDropzone @update:show-feedback="(value) => parentShowFeedback = value" />
          </div>
          <!--
          <button
            class="bg-zinc-500 text-white px-4 py-2 rounded-md"
            @click="handleClickPix"
          >
            Pagar com PIX
          </button> -->
          <!-- component - end -->
        </section>
      </div>
    </div>
    <Toaster rich-colors />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"

const parentShowFeedback = ref(false)
const isPixPaid = ref(false)
const currentCorrelationID = ref("")

onMounted(() => {
  window.$openpix = window.$openpix || []
  window.$openpix.push(["config", { appID: import.meta.env.VITE_OPEN_PIX }])

  const logEvents = (event) => {
    console.log("logEvents:", event)

    if (event.type === "PAYMENT_STATUS" && event.data.status === "COMPLETED") {
      console.log("Correlation ID Data:", event.data)
      console.log("Correlation ID", currentCorrelationID.value)
      // aqui da pra saber o currenCorrelationID que foi feito e qual foi pago...

      // podemos armazenar isso em uma lista no localstorage e depois fazer a verificação
      // se o usuário já pagou ou não
      isPixPaid.value = true
    }
  }

  window.$openpix.addEventListener(logEvents)
})

const gerarCorrelationIdUnico = (
  len: number,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
) =>
  [...Array(len)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("")

const handleClickPix = () => {
  currentCorrelationID.value = gerarCorrelationIdUnico(30)
  window.$openpix.push([
    "pix",
    {
      value: 1000,
      correlationID: currentCorrelationID.value,
      description: "Avaliação de currículo por especialista",
    },
  ])
}
</script>
