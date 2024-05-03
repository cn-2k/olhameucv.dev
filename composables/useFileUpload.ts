import axios from "axios"
import { toast } from "vue-sonner"
import { v4 as generateUUID } from "uuid"
import { ref } from "vue"
import { useStorage } from "@vueuse/core"

export function useFileUpload() {
  const isProcessingFile = ref(false)
  const isConfirmingPayment = ref(false)
  const showFeedback = useStorage("showFeedback", false)
  const feedback = useStorage("feedback", "")
  const isPixPaid = useStorage("isPixPaid", false)
  const currentCorrelationID = ref("")
  const processId = ref("")

  async function handleFile(file: File) {
    isProcessingFile.value = true

    const formData = new FormData()
    formData.append("file", file)

    try {
      const { data } = await axios.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      processId.value = data.processId
      isProcessingFile.value = false
    }
    catch (error) {
      handleUploadError(error)
    }
  }

  function starPayment() {
    currentCorrelationID.value = generateUUID()

    window.$openpix.push([
      "pix",
      {
        value: 1000,
        correlationID: currentCorrelationID.value,
        description: "Avaliação de currículo por especialista",
      },
    ])

    console.log("Correlation ID", currentCorrelationID.value)
    console.log("Process ID", processId.value)

    setupPaymentListeners(processId.value)
  }

  function setupPaymentListeners(processId: string) {
    const handlePaymentStatus = async (event: OpenPixEvent) => {
      switch (event.type) {
        case "PAYMENT_STATUS":
          if (event.data.status === "COMPLETED") {
            await confirmPayment(processId)
          }
          break
        case "CHARGE_EXPIRED":
          console.log("A cobrança expirou.")
          break
        case "ON_CLOSE":
          if (isConfirmingPayment.value) {
            return
          }
          isConfirmingPayment.value = false
          isProcessingFile.value = false
          break
        case "ON_ERROR":
          console.log("Ocorreu um erro com o pagamento.")
          break
      }
    }

    if (import.meta.client && window.$openpix.addEventListener) {
      window.$openpix.addEventListener(handlePaymentStatus)
    }
  }

  async function confirmPayment(processId: string) {
    try {
      isConfirmingPayment.value = true
      isPixPaid.value = true
      const { data } = await axios.post("/api/payment/confirm", { processId, correlationId: currentCorrelationID.value })
      feedback.value = JSON.stringify(data)
      showFeedback.value = true
      isConfirmingPayment.value = false
    }
    catch (error) {
      console.error("Erro ao confirmar pagamento:", error)
    }
  }

  function handleUploadError(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
    toast.error("Erro ao enviar o arquivo", { description: errorMessage })
  }

  return {
    handleFile,
    feedback,
    isProcessingFile,
    isConfirmingPayment,
    isPixPaid,
    showFeedback,
    starPayment,
  }
}
