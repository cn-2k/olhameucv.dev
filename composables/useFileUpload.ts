import axios from "axios"
import { toast } from "vue-sonner"
import { v4 as generateUUID } from "uuid"
import { useStorage } from "@vueuse/core"

export function useFileUpload() {
  const isLoading = ref<boolean>(false)
  const showFeedback = useStorage("showFeedback", false)
  const feedback = useStorage("feedback", "")
  const isPixPaid = useStorage<boolean>("isPixPaid", false)
  const currentCorrelationID = ref<string>("")

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

      startPayment()

      watchEffect(() => {
        if (isPixPaid.value) {
          feedback.value = JSON.stringify(response.data)
          showFeedback.value = true
          isLoading.value = false
        }
      })
    }
    catch (error) {
      toast.error("Erro ao enviar o arquivo", {
        description: error || "Ocorreu um erro desconhecido.",
      })

      isLoading.value = false
    }
  }

  function startPayment() {
    currentCorrelationID.value = generateUUID()
    window.$openpix.push([
      "pix",
      {
        value: 1000,
        correlationID: currentCorrelationID.value,
        description: "Avaliação de currículo por especialista",
      },
    ])

    const logEvents = (e: OpenPixEvent) => {
      if (e.type === "PAYMENT_STATUS" && e.data.status === "COMPLETED") {
        console.log("Correlation ID Data:", e.data)
        console.log("Correlation ID", currentCorrelationID.value)

        isPixPaid.value = true
      }

      if (e.type === "CHARGE_EXPIRED") {
        console.log("a cobrança foi expirada")
      }

      if (e.type === "ON_CLOSE") {
        console.log("o modal da cobrança foi fechado")
      }

      if (e.type === "ON_CLOSE" && !isPixPaid.value) {
        console.log("o modal da cobrança foi fechado e o user não pagou")
        showFeedback.value = false
        isLoading.value = false
      }

      // if (e.type === "ON_CLOSE" && isPixPaid.value) {
      //   isPixPaid.value = false
      // }

      if (e.type === "ON_ERROR") {
        console.log("ocorreu um erro")
      }
    }

    if (import.meta.client && window.$openpix.addEventListener) {
      window.$openpix.addEventListener(logEvents)
    }
  }

  return {
    handleFile,
    feedback,
    isLoading,
    isPixPaid,
    showFeedback,
  }
}
