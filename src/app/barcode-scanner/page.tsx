'use client'

import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Product } from '@/types'
import { Camera, X, Flashlight, RotateCcw, CheckCircle } from 'lucide-react'

export default function BarcodeScanner() {
  const { products } = useApp()
  const [isScanning, setIsScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [foundProduct, setFoundProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [lastScannedCode, setLastScannedCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Kamera başlatma
  const startCamera = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Arka kamera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError('Kamera erişimi reddedildi. Lütfen izin verin.')
      console.error('Camera error:', err)
    }
  }

  // Kamera durdurma
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  // Barkod/ürün kodu ile ürün arama
  const searchProduct = (code: string) => {
    if (!code || code === lastScannedCode) return

    setLastScannedCode(code)
    
    // Önce barkod ile ara
    let product = products.find(p => p.barcode === code)
    
    // Bulunamazsa ürün kodu ile ara
    if (!product) {
      product = products.find(p => p.code.toLowerCase() === code.toLowerCase())
    }

    if (product) {
      setFoundProduct(product)
      setError('')
      
      // Vibration feedback
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
      
      // Ses feedback
      playBeepSound()
    } else {
      setFoundProduct(null)
      setError(`Ürün bulunamadı: ${code}`)
      
      // Error vibration
      if (navigator.vibrate) {
        navigator.vibrate([500])
      }
    }
  }

  // Basit beep sesi
  const playBeepSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  // Manuel kod girişi
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      searchProduct(manualCode.trim())
      setManualCode('')
    }
  }

  // Keyboard dinleme (harici barkod okuyucu için)
  useEffect(() => {
    let barcodeBuffer = ''
    let timeout: NodeJS.Timeout

    const handleKeyPress = (e: KeyboardEvent) => {
      // Enter tuşu ile barkod tamamlandı
      if (e.key === 'Enter' && barcodeBuffer.length > 0) {
        searchProduct(barcodeBuffer)
        barcodeBuffer = ''
        return
      }

      // Alfanumerik karakterleri buffer'a ekle
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        barcodeBuffer += e.key
        
        // Timeout ile buffer'ı temizle (barkod okuyucu hızlı yazar)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          if (barcodeBuffer.length > 3) {
            searchProduct(barcodeBuffer)
          }
          barcodeBuffer = ''
        }, 100)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      clearTimeout(timeout)
    }
  }, [products])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Barkod Tarayıcı</h1>
        <p className="text-gray-400">Barkod okutun veya ürün kodu girin</p>
      </div>

      {/* Manuel Kod Girişi */}
      <div className="mb-6">
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Ürün kodu veya barkod girin..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Ürün Ara
          </button>
        </form>
      </div>

      {/* Kamera Kontrolü */}
      <div className="mb-6">
        {!isScanning ? (
          <button
            onClick={startCamera}
            className="w-full bg-green-600 hover:bg-green-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Camera className="h-5 w-5" />
            <span>Kamerayı Başlat</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <X className="h-5 w-5" />
            <span>Kamerayı Durdur</span>
          </button>
        )}
      </div>

      {/* Kamera Preview */}
      {isScanning && (
        <div className="mb-6">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 border-2 border-red-500 opacity-50 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 border-2 border-red-500"></div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                Barkodu kırmızı çerçeve içine hizalayın
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-600/20 border border-red-600 rounded-lg p-4">
          <p className="text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Bulunan Ürün */}
      {foundProduct && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-bold text-green-400">Ürün Bulundu!</h2>
          </div>

          {/* Ürün Resmi */}
          <div className="mb-4">
            {(() => {
              let firstImage = null
              try {
                if (foundProduct.images && typeof foundProduct.images === 'string') {
                  const images = JSON.parse(foundProduct.images)
                  firstImage = images && images.length > 0 ? images[0] : null
                }
              } catch (error) {
                firstImage = null
              }

              return firstImage ? (
                <img 
                  src={firstImage} 
                  alt={foundProduct.name}
                  className="w-full h-48 object-cover rounded-lg border border-gray-600"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center">
                  <span className="text-gray-400">Resim Yok</span>
                </div>
              )
            })()}
          </div>

          {/* Ürün Bilgileri */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-mono text-lg font-bold">{foundProduct.code}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${foundProduct.inStock ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                {foundProduct.inStock ? 'Stokta' : 'Tükendi'}
              </span>
            </div>

            <h3 className="text-white font-bold text-2xl">{foundProduct.name}</h3>

            {/* BÜYÜK FİYAT */}
            <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 text-center">
              <div className="text-green-400 font-bold text-4xl mb-1">
                {foundProduct.salePrice.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-green-300 text-sm">
                Satış Fiyatı
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong className="text-gray-200">Marka:</strong> {foundProduct.brand}</div>
              <div><strong className="text-gray-200">Kategori:</strong> {foundProduct.category}</div>
              <div><strong className="text-gray-200">Renk:</strong> {foundProduct.color}</div>
              {foundProduct.model && <div><strong className="text-gray-200">Model:</strong> {foundProduct.model}</div>}
            </div>

            {foundProduct.description && (
              <div>
                <strong className="text-gray-200">Açıklama:</strong>
                <p className="text-gray-300 mt-1">{foundProduct.description}</p>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-600">
              <span>Alış: {foundProduct.purchasePrice.toLocaleString('tr-TR')} ₺</span>
              {foundProduct.suggestedSalePrice && (
                <span>Önerilen: {foundProduct.suggestedSalePrice.toLocaleString('tr-TR')} ₺</span>
              )}
            </div>
          </div>

          {/* Yeni Tarama Butonu */}
          <button
            onClick={() => {
              setFoundProduct(null)
              setError('')
              setLastScannedCode('')
            }}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Yeni Tarama</span>
          </button>
        </div>
      )}

      {/* Bilgi */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>💡 USB barkod okuyucu bağlıysa otomatik çalışır</p>
        <p>📱 Mobil cihazlarda kamera kullanabilirsiniz</p>
      </div>
    </div>
  )
}
