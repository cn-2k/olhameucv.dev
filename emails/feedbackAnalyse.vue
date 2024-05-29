<script setup>
const props = defineProps({
  feedbackOverview: {
    type: String,
    default: "Feedback",
  },
  feedbackResponse: {
    type: String,
    default: "Feedback",
  },
})

const main = {
  backgroundColor: "#fff",
  fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Inter,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif",
}

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
}

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
}

const boxInfos = {
  padding: "40px 40px",
}
</script>

<template>
  <ETailwind>
    <EHtml>
      <EHead />
      <EPreview>olhameucv.ai</EPreview>
      <EBody :style="main">
        <EContainer class="w-full">
          <ESection class="p-4">
            <EText class="text-xl font-bold">👀 olhameucv<b class="text-blue-700/70">.ai</b></EText>
          </ESection>

          <ESection :style="content" class="border rounded overflow-hidden">
            <ERow
              class="pl-8 pr-8 pt-8 pb-0"
            >
              <EColumn>
                <EHeading class="text-2xl font-bold text-center">🎉 Seu currículo foi <b class="text-green-500">analisado!</b></EHeading>
                <EHeading
                  as="h2"
                  class="text-lg font-bold text-center"
                >
                  Ficamos felizes em te informar que a análise do seu currículo foi concluída. 😊 <br /> Verifique o resultado abaixo:
                </EHeading>

                <EText class="text-base">
                  <h2 class="flex items-center gap-2 text-lg font-bold text-green-500">🔎 Visão geral</h2>
                  {{ props.feedbackOverview }}
                </EText>

                <EText class="text-base">
                  <h2 class="flex items-center gap-2 text-lg font-bold text-green-500">🚀 Feedback</h2>
                  {{ props.feedbackResponse }}
                </EText>
              </EColumn>
            </ERow>

            <ERow :style="{ ...boxInfos, paddingTop: '0' }">
              <EColumn :style="containerButton" class="flex justify-center items-center" col-span="{2}">
                <EButton href="#" class="bg-blue-700 p-4 text-white font-bold rounded"> 👀 Deseja avaliar mais? </EButton>
              </EColumn>
            </ERow>
          </ESection>

          <EText
            :style="{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgb(0,0,0, 0.7)',
            }"
          >
            © 2024 | www.olhameucv.ai.com
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
