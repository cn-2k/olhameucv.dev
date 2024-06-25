<template>
  <div
    class="relative w-full max-w-screen-2xl p-4 border rounded-md shadow-lg bg-white"
  >
    <div class="flex flex-col items-center py-5 lg:px-10 gap-4 antialiased">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 24 24"
      >
        <path
          fill="rgb(74 222 128)"
          d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
        />
      </svg>
      <p class="text-lg font-bold text-zinc-600">
        🎉 Que bacana! O Seu currículo
        <span class="text-green-500">foi analisado</span>, verifique o resultado
        que <strong class="text-green-500">enviamos no seu e-mail</strong> ou
        por aqui mesmo:
      </p>
      <div v-if="feedbackResponse" class="flex flex-col lg:flex-row gap-8 mt-4">
        <div class="space-y-2">
          <h2 class="flex items-center gap-2 text-lg font-bold text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8.075q.45 0 .85.188t.675.537l3.925 4.725q.225.275.35.6t.125.675V20q0 .675-.612.925T18.3 20.7L14 16.45q-.425.275-.925.413T12 17q-1.65 0-2.825-1.175T8 13t1.175-2.825T12 9t2.825 1.175T16 13q0 .575-.137 1.075T15.45 15L18 17.6V8.7L14.05 4H6v16h8.325q.5 0 .75.313t.25.687t-.25.688t-.75.312zm6-7q.825 0 1.413-.587T14 13t-.587-1.412T12 11t-1.412.588T10 13t.588 1.413T12 15m0-2"
              />
            </svg>
            Feedback
          </h2>
          <div v-if="feedbackResponse" class="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-800 text-center lg:text-justify">
            <div v-for="item in feedbackResponseAnalyse" :key="item.section" class="bg-white rounded-lg shadow-md p-6" :class="{ 'lg:col-span-2': item.section === '🏅 Certificações' }">
              <h1 class="text-lg font-bold mb-3 text-gray-700">{{ item.section }}</h1>
              <div class="space-y-2">
                <p class="text-sm"><span class="font-semibold">🔍 Feedback:</span> {{ item.feedback }}</p>
                <p class="text-sm"><span class="font-semibold">💡 Sugestões:</span> {{ item.suggestions }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-10 text-zinc-800">
      <div class="flex flex-col gap-2">
        <Popover v-if="feedbackResponse">
          <PopoverTrigger as-child>
            <Button size="sm" variant="outline">
              <LucideMail class="size-4 mr-2" /> Alterar ou reenviar e-mail
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-full">
            <div class="flex flex-col gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">
                  Alterar ou reenviar e-mail
                </h4>
                <p class="text-sm text-muted-foreground">
                  Iremos reenviar a sua análise!
                </p>
              </div>
              <div class="flex w-full max-w-sm items-center gap-1.5">
                <Input
                  id="email"
                  v-model="feedbackResponse.email"
                  type="email"
                  placeholder="Email"
                  required
                />
                <Button :disabled="isResending" @click="handleResend"> <LucideLoader2 v-if="isResending" class="w-4 h-4 mr-2 animate-spin" />  {{ isResending ? "Reenviando..." : "Reenviar" }} </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="sm"
          class="transition-colors"
          @click="handleCloseFeedback"
        >
          <LucideArrowLeft class="size-4 mr-2" /> Avaliar mais 😍
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue-sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { FeedbackProps } from "@/entities/Feedback";
import { useFileUpload } from "@/composables/useFileUpload";

const { feedback, showFeedback } = useFileUpload();
const router = useRouter();
const isResending = ref<boolean>(false);

const feedbackResponse: FeedbackProps | null = JSON.parse(
  String(feedback.value)
);

console.log("feedback no FeedbackSection ==> ", feedbackResponse);

const handleResend = async () => {
  isResending.value = true;
  try {
    await axios.post("/api/resume/resend", {
      email: feedbackResponse?.email,
      feedbackResponse: feedbackResponse,
    });

    toast.success("E-mail reenviado, cheque sua caixa de entrada!");
    isResending.value = false;
  } catch (error) {
    console.error(error);
    isResending.value = false;
  }
};

function handleCloseFeedback() {
  showFeedback.value = false;
  router.push("/");
}

const feedbackResponseAnalyse = [
  {
    section: "📄 Resumo",
    feedback: feedbackResponse?.summary.feedback,
    suggestions: feedbackResponse?.summary.suggestions,
  },
  {
    section: "💼 Experiências Profissionais",
    feedback: feedbackResponse?.profissionalExperiences.feedback,
    suggestions: feedbackResponse?.profissionalExperiences.suggestions,
  },
  {
    section: "🎓 Formação acadêmica",
    feedback: feedbackResponse?.education.feedback,
    suggestions: feedbackResponse?.education.suggestions,
  },
  {
    section: "🛠️ Habilidades",
    feedback: feedbackResponse?.skills.feedback,
    suggestions: feedbackResponse?.skills.suggestions,
  },
  {
    section: "🏅 Certificações",
    feedback: feedbackResponse?.certifications.feedback,
    suggestions: feedbackResponse?.certifications.suggestions,
  },
]
</script>
