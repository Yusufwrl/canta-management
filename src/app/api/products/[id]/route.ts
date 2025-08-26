import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const {
      code,
      name,
      brand,
      color,
      category,
      purchasePrice,
      salePrice,
      inStock,
      description,
      images
    } = body

    // Kod kontrolü (mevcut ürün hariç)
    const existingProduct = await prisma.product.findFirst({
      where: {
        code: code,
        NOT: { id: id }
      }
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'Bu ürün kodu zaten kullanılıyor!' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        code,
        name,
        brand,
        color,
        category,
        purchasePrice: parseFloat(purchasePrice),
        salePrice: parseFloat(salePrice),
        inStock: Boolean(inStock),
        description: description || null,
        images: images || '[]'
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Önce transaction kontrolü yapalım
    const transactions = await prisma.transaction.findMany({
      where: { productId: id }
    })
    
    if (transactions.length > 0) {
      return NextResponse.json({ 
        error: 'Bu ürünün satış geçmişi bulunduğu için silinemez.' 
      }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
