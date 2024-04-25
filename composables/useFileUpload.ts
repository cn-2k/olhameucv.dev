// useFileUpload.ts
import { ref } from "vue"
import axios from "axios"
import { toast } from "vue-sonner"

export function useFileUpload(onSuccess: (data: any) => void) {
  const isLoading = ref<boolean>(false)

  async function handleFile(file: File | null) {
    if (!file) return

    isLoading.value = true

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      onSuccess(response.data)
      console.log(response.data)
    }
    catch (error) {
      toast.error("Erro ao enviar o arquivo", {
        description: error || "Ocorreu um erro desconhecido.",
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    handleFile,
    isLoading,
  }
}
