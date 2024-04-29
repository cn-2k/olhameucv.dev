import { ref } from "vue"
import { v4 as generateUUID } from "uuid"

export function usePayment() {
  const isPixPaid = ref<boolean>(false)
  const currentCorrelationID = ref<string>("")

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
        isPixPaid.value = false
      }

      if (e.type === "ON_CLOSE" && isPixPaid.value) {
        isPixPaid.value = false
      }

      if (e.type === "ON_ERROR") {
        console.log("ocorreu um erro")
      }
    }

    if (import.meta.client && window.$openpix.addEventListener) {
      window.$openpix.addEventListener(logEvents)
    }
  }

  return {
    isPixPaid,
    startPayment,
  }
}
