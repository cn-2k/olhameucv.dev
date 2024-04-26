export default defineNuxtPlugin(() => {
  window.$openpix = window.$openpix || []
  window.$openpix.push(["config", { appID: import.meta.env.VITE_OPEN_PIX }])
  console.log("[OpenPix] Plugin initialized")
})
