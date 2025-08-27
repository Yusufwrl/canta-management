import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import Link from "next/link"
import { AppProvider } from "@/contexts/AppContext"
import { PWABanner, PWAInstallPrompt } from "@/components/PWABanner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Çanta Yönetim Sistemi",
  description: "Çanta mağazası için envanter yönetimi ve satış takip sistemi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Çanta Yönetimi",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Çanta Yönetim Sistemi",
    title: "Çanta Yönetim Sistemi",
    description: "Çanta mağazası için envanter yönetimi ve satış takip sistemi",
  },
  twitter: {
    card: "summary",
    title: "Çanta Yönetim Sistemi",
    description: "Çanta mağazası için envanter yönetimi ve satış takip sistemi",
  },
}

export const viewport: Viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f2937" />
        
        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Çanta Yönetimi" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        
        {/* Microsoft Tile */}
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        
        {/* Prevent zoom on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={geist.className}>
        <AppProvider>
          {/* Mobile Layout - Tek scroll container */}
          <div className="lg:hidden">
            {/* Mobile Header - Fixed */}
            <div className="bg-gray-800 p-4 sticky top-0 z-10">
              <h1 className="text-xl font-bold text-white text-center">
                Çanta Yönetimi
              </h1>
              <nav className="mt-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/" className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                    Ana Sayfa
                  </Link>
                  <Link href="/products" className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                    Ürünler
                  </Link>
                  <Link href="/categories" className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                    Kategoriler
                  </Link>
                  <Link href="/transactions" className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                    Gelir-Gider
                  </Link>
                  <Link href="/products/add" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Ürün Ekle
                  </Link>
                  <Link href="/barcode-scanner" className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    📷 Barkod
                  </Link>
                </div>
              </nav>
            </div>
            
            {/* Mobile Content - Normal akış */}
            <div className="p-3 sm:p-6 bg-gray-900">
              {children}
            </div>
          </div>

          {/* Desktop Layout - Değişmez */}
          <div className="hidden lg:flex h-screen bg-gray-900">
            {/* Desktop Sidebar */}
            <div className="h-full w-64 flex-col bg-gray-800">
              <div className="flex h-16 shrink-0 items-center px-6">
                <h1 className="text-xl font-bold text-white">
                  Çanta Yönetimi
                </h1>
              </div>
              <nav className="flex flex-1 flex-col px-6 py-4">
                <ul className="flex flex-1 flex-col gap-y-1">
                  <li>
                    <Link href="/" className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700">
                      Ana Sayfa
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700">
                      Ürünler
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700">
                      Kategoriler
                    </Link>
                  </li>
                  <li>
                    <Link href="/transactions" className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700">
                      Gelir-Gider
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/add" className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700">
                      Ürün Ekle
                    </Link>
                  </li>
                  <li>
                    <Link href="/barcode-scanner" className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700">
                      Barkod Tarayıcı
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <main className="flex-1 overflow-auto bg-gray-900">
              <div className="p-3 sm:p-6">
                {children}
              </div>
            </main>
          </div>
          
          {/* PWA Components */}
          <PWABanner />
          <PWAInstallPrompt />
        </AppProvider>
      </body>
    </html>
  )
}
