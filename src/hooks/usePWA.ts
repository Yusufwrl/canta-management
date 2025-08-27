'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm('Yeni sürüm mevcut. Şimdi güncellemek ister misiniz?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Install prompt handling
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // App installed handling
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    }

    // Online/Offline status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
      // For iOS
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial checks
    checkIfInstalled()
    setIsOffline(!navigator.onLine)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      } else {
        console.log('User dismissed the install prompt')
        return false
      }
    } catch (error) {
      console.error('Install prompt failed:', error)
      return false
    }
  }

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Çanta Yönetim Sistemi',
          text: 'Çanta mağazası yönetim uygulaması',
          url: window.location.origin,
        })
        return true
      } catch (error) {
        console.error('Share failed:', error)
        return false
      }
    }
    return false
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      })
    }
    return null
  }

  return {
    isInstallable,
    isInstalled,
    isOffline,
    installApp,
    shareApp,
    requestNotificationPermission,
    sendNotification,
  }
}
