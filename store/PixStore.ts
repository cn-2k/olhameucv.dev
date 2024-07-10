import { defineStore } from "pinia";
import { v4 as generateUUID } from "uuid";
import axios from "axios";
import { useRouter } from "vue-router";
import { useGlobalStore } from "./GlobalStore";

export const usePixStore = defineStore("pix", () => {
  const globalStore = useGlobalStore();
  const router = useRouter();

  const { feedback } = storeToRefs(globalStore);

  const isPixPaid = ref(false);
  const isExamine = ref(false);
  const currentCorrelationID = ref("");

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

    setupPaymentListeners(globalStore.processId, currentCorrelationID.value);
  }

  function setupPaymentListeners(processId: string, correlationId: string) {
    console.log("Setting up payment listeners", processId, correlationId);
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
    console.log("Confirming payment", processId, correlationId);
    isExamine.value = true;
    try {
      isPixPaid.value = true;
      const { data } = await axios.post("/api/payment/confirm", {
        processId,
        correlationId,
      });

      feedback.value = JSON.stringify(data.response);
      globalStore.showFeedback = true;
      router.push("/confirm");
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
    } finally {
      isExamine.value = false;
    }
  }

  return { startPayment, isPixPaid, isExamine };
});
