import { ref } from "vue"

export function usePayment() {
  const isPixPaid = ref<boolean>(false)
  const currentCorrelationID = ref<string>("")

  function openPixSetup() {
    window.$openpix = window.$openpix || []
    window.$openpix.push(["config", { appID: import.meta.env.VITE_OPEN_PIX }])
  }

  function addPaymentListener() {
    window.$openpix.addEventListener(handlePaymentStatus)
  }

  function removePaymentListener() {
    window.$openpix.removeEventListener(handlePaymentStatus)
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
    currentCorrelationID.value = crypto.randomUUID()
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
    openPixSetup,
    addPaymentListener,
    removePaymentListener,
    startPayment,
  }
}
