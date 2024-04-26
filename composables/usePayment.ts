import { ref } from "vue"
import { v4 as generateUUID } from "uuid"

export function usePayment() {
  const isPixPaid = ref<boolean>(false)
  const currentCorrelationID = ref<string>("")
  function addPaymentListener() {
    if (import.meta.client && window.$openpix.addEventListener) {
      window.$openpix.addEventListener(handlePaymentStatus)
    }
  }

  function handlePaymentStatus(event: OpenPixEvent) {
    console.log("logEvents:", event)

    if (event.type === "PAYMENT_STATUS" && event.data.status === "COMPLETED") {
      console.log("Correlation ID Data:", event.data)
      console.log("Correlation ID", currentCorrelationID.value)

      isPixPaid.value = true
    }

    if (event.type === "ON_CLOSE" && isPixPaid.value) {
      isPixPaid.value = false
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
  }

  return {
    isPixPaid,
    addPaymentListener,
    startPayment,
  }
}
