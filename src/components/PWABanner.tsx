'use client'

import { useState } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { Download, X, Smartphone, Share, Wifi, WifiOff } from 'lucide-react'

export function PWABanner() {
  const { isInstallable, isInstalled, isOffline, installApp, shareApp } = usePWA()
  const [showBanner, setShowBanner] = useState(true)

  // Don't show banner if already installed or not installable
  if (isInstalled || !isInstallable || !showBanner) {
    return null
  }

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setShowBanner(false)
    }
  }

  const handleShare = async () => {
    const success = await shareApp()
    if (!success) {
      // Fallback for browsers that don't support Web Share API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.origin)
        alert('Link panoya kopyalandı!')
      }
    }
  }

  return (
    <>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm z-50">
          <WifiOff className="inline h-4 w-4 mr-2" />
          Çevrimdışı mod - Veriler yerel olarak saklanıyor
        </div>
      )}

      {/* Install Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg z-40 transform transition-transform duration-300">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Ana ekrana ekle</h3>
              <p className="text-xs opacity-90">Daha hızlı erişim için uygulama olarak yükle</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title="Paylaş"
            >
              <Share className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Yükle</span>
            </button>
            
            <button
              onClick={() => setShowBanner(false)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)

  if (isInstalled || !isInstallable) return null

  return (
    <>
      {/* Floating install button */}
      <button
        onClick={() => setShowPrompt(true)}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-30"
        title="Uygulamayı yükle"
      >
        <Download className="h-6 w-6" />
      </button>

      {/* Install modal */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Uygulamayı Yükle
              </h2>
              
              <p className="text-gray-600 mb-6">
                Çanta Yönetim Sistemi'ni telefonunuza yükleyerek daha hızlı erişim sağlayın.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await installApp()
                    setShowPrompt(false)
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Ana Ekrana Ekle</span>
                </button>
                
                <button
                  onClick={() => setShowPrompt(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
