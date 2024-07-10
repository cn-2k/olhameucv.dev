import axios from "axios";
import { toast } from "vue-sonner";
import { ref } from "vue";

import { useGlobalStore } from "@/store/GlobalStore";

export function useFileUpload() {
  const globalStore = useGlobalStore();
  const isProcessingFile = ref(false);

  function handleFile(file: File) {
    isProcessingFile.value = true;

    const formData = new FormData();
    formData.append("file", file);

    sendResume(formData);
  }

  const sendResume = async (formData: FormData) => {
    try {
      const { data } = await axios.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      globalStore.processId = data.processId;
      globalStore.setResume(true);
    } catch (error) {
      handleUploadError(error);
    } finally {
      isProcessingFile.value = false;
    }
  };

  function handleUploadError(error: unknown) {
    globalStore.showAlert = true; // isso nao deve ficar aqui
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    toast.error("Erro ao enviar o arquivo", { description: errorMessage });
  }

  return {
    handleFile,
    isProcessingFile,
  };
}
