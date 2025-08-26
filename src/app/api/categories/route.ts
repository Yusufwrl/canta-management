import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    // Her kategori için ürün sayısını hesapla
    const categoriesWithCount = await Promise.all(
      categories.map(async (category: any) => {
        const productCount = await prisma.product.count({
          where: { category: category.name }
        })
        return {
          ...category,
          productCount
        }
      })
    )

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error('Categories fetch error:', error)
    // Hata durumunda boş array döndür
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
        productCount: 0
      }
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('PUT request body:', body) // Debug için
    
    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // ID string olarak kullan (cuid formatında)
    const categoryId = body.id

    console.log('Category ID to update:', categoryId) // Debug için

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: body.name,
        description: body.description
      }
    })
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update category', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }
    
    // Bu kategoriyi kullanan ürün var mı kontrol et - category name ile kontrol
    const categoryToDelete = await prisma.category.findUnique({
      where: { id: id }
    })
    
    if (!categoryToDelete) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    const products = await prisma.product.findMany({
      where: { category: categoryToDelete.name }
    })
    
    if (products.length > 0) {
      return NextResponse.json({ 
        error: 'Bu kategoriye ait ürünler bulunduğu için silinemez.' 
      }, { status: 400 })
    }
    
    await prisma.category.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
