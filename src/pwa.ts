export function registerServiceWorker() {
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
        console.error("Campus Copilot could not register its offline support.", error)
      })
    }, { once: true })
  }
}
