<template>
  <ClientOnly>
    <section
      class="flex flex-col justify-between items-center gap-6 lg:flex-row 2xl:mt-48"
    >
      <ContentHero />
      {{ globalStore.feedback }}
      <AppFileDropzone v-if="!hasResume" />
      <PaymentSection v-else />
      <AlertDialog :open="showAlert">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção!</AlertDialogTitle>
            <AlertDialogDescription>
              <p class="leading-relaxed">
                Para que sua análise seja feita corretamente e da melhor forma
                possível é necessário que o currículo enviado
                <span class="bg-blue-400/30 p-1 text-gray-600 font-semibold">
                  tenha sido gerado através do LinkedIn
                </span>
                salvando o seu perfil como pdf.
              </p>
              <p class="mt-2">
                Clique
                <NuxtLink
                  href="https://www.linkedin.com/help/linkedin/answer/a541960/salvar-um-perfil-como-pdf?lang=pt-BR"
                  target="_blank"
                  class="font-semibold underline text-blue-700"
                >
                  aqui
                </NuxtLink>
                para saber como salvar o seu perfil como pdf no LinkedIn.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction @click="showAlert = false">
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
    <template #fallback>
      <div
        class="flex flex-col justify-between items-center gap-6 lg:flex-row mt-24 2xl:mt-72"
      >
        <div class="flex flex-col items-center lg:items-start gap-3">
          <Skeleton class="h-10 w-[650px] rounded-xl mb-2" />
          <Skeleton class="h-2 w-[550px] rounded-xl" />
          <Skeleton class="h-2 w-[660px] rounded-xl" />
          <Skeleton class="h-2 w-[660px] rounded-xl" />
          <Skeleton class="h-2 w-[660px] rounded-xl" />
        </div>
        <div class="w-full lg:w-1/2">
          <Skeleton class="h-72" />
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/store/GlobalStore";

const globalStore = useGlobalStore();
const { hasResume, showAlert, feedback } = storeToRefs(globalStore);

const router = useRouter();

if (feedback.value) {
  router.push("/confirm");
}
</script>
