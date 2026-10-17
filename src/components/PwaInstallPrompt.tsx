import { useEffect, useState } from 'react'
import { Download, WifiOff, X } from 'lucide-react'
import { Button } from './ui/Button'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('campus-pwa-dismissed') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleInstallAvailable = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleInstallAvailable)
    window.addEventListener('appinstalled', handleInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallAvailable)
      window.removeEventListener('appinstalled', handleInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    try {
      sessionStorage.setItem('campus-pwa-dismissed', 'true')
    } catch {
      // Ignore sessionStorage errors
    }
  }

  const installApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setInstallPrompt(null)
  }

  if (isDismissed || (!isOffline && (!installPrompt || installed))) return null

  return (
    <div
      className="fixed inset-x-3 bottom-24 z-[60] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border bg-card/95 p-3 text-card-foreground shadow-xl backdrop-blur-md md:bottom-6 md:right-6 md:left-auto"
      role="status"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {isOffline ? (
          <WifiOff className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Download className="h-4 w-4" />
          </div>
        )}
        <p className="text-xs leading-snug text-muted-foreground">
          {isOffline
            ? 'You’re offline. Previously opened pages may still be available.'
            : 'Install Campus Copilot for fast, offline-ready access.'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {installPrompt && !installed && (
          <Button size="sm" className="h-8 px-3 text-xs rounded-xl" onClick={() => void installApp()}>
            Install
          </Button>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Dismiss banner"
          title="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
