import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Tüm ürünlerdeki kategorileri al
    const products = await prisma.product.findMany({
      select: { category: true }
    })

    // Benzersiz kategorileri bul
    const uniqueCategories = [...new Set(products.map((p: any) => p.category).filter(Boolean))]
    
    console.log('Found categories in products:', uniqueCategories)

    // Mevcut kategorileri al
    const existingCategories = await prisma.category.findMany({
      select: { name: true }
    })
    const existingCategoryNames = existingCategories.map((c: any) => c.name)

    // Eksik kategorileri ekle
    const missingCategories = uniqueCategories.filter(cat => !existingCategoryNames.includes(cat))
    
    console.log('Missing categories:', missingCategories)

    if (missingCategories.length > 0) {
      for (const categoryName of missingCategories) {
        await prisma.category.create({
          data: {
            name: categoryName,
            description: `${categoryName} kategorisi (otomatik oluşturuldu)`,
            productCount: 0
          }
        })
      }
    }

    return NextResponse.json({ 
      message: `${missingCategories.length} kategori eklendi`,
      addedCategories: missingCategories,
      allCategories: uniqueCategories
    })
  } catch (error) {
    console.error('Kategori senkronizasyon hatası:', error)
    return NextResponse.json({ error: 'Kategori senkronizasyonu başarısız' }, { status: 500 })
  }
}
