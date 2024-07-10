import { defineStore } from "pinia";

export const useGlobalStore = defineStore("resume", () => {
  const showAlert = ref(false);
  const resume: Ref<boolean> = ref(false);
  const processId = ref("");

  const hasResume = computed(() => resume.value);

  const setResume = (newResume: boolean) => {
    resume.value = newResume;
  };

  return { processId, hasResume, showAlert, setResume };
});
