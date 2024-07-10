import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { v4 as generateUUID } from "uuid";
import { toast } from "vue-sonner";

export const usePixStore = defineStore("pix", () => {
  const isPixPaid = ref(false);
  const currentCorrelationID = ref("");
  const showFeedback = useStorage("showFeedback", false);
  const feedback = useStorage("feedback", "");

  function startPayment() {
    currentCorrelationID.value = generateUUID();

    window.$openpix.push([
      "pix",
      {
        value: 1000,
        correlationID: currentCorrelationID.value,
        description: "Avaliação de currículo",
      },
    ]);

    setupPaymentListeners(processId.value, currentCorrelationID.value);
  }

  function setupPaymentListeners(processId: string, correlationId: string) {
    const handlePaymentStatus = async (event: OpenPixEvent) => {
      switch (event.type) {
        case "PAYMENT_STATUS":
          if (event.data.status === "COMPLETED") {
            await confirmPayment(processId, correlationId);
          }
          break;
        case "CHARGE_EXPIRED":
          break;
        case "ON_CLOSE":
          break;
        case "ON_ERROR":
          break;
      }
    };

    if (import.meta.client && window.$openpix.addEventListener) {
      window.$openpix.addEventListener(handlePaymentStatus);
    }
  }

  async function confirmPayment(processId: string, correlationId: string) {
    try {
      isPixPaid.value = true;
      const { data } = await axios.post("/api/payment/confirm", {
        processId,
        correlationId,
      });

      feedback.value = JSON.stringify(data.response);

      provide("feedback", feedback.value);
      showFeedback.value = true;
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
    }
  }

  return { startPayment };
});
