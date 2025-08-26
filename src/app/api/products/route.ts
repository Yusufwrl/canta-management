import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Otomatik ürün kodu oluşturma
    const lastProduct = await prisma.product.findFirst({
      orderBy: { code: 'desc' }
    })
    
    let nextCode = '001'
    if (lastProduct) {
      const lastCodeNum = parseInt(lastProduct.code)
      nextCode = (lastCodeNum + 1).toString().padStart(3, '0')
    }
    
    const product = await prisma.product.create({
      data: {
        code: nextCode,
        name: body.name,
        brand: body.brand,
        color: body.color,
        category: body.category,
        model: body.model,
        description: body.description,
        purchasePrice: parseFloat(body.purchasePrice),
        salePrice: parseFloat(body.salePrice),
        suggestedSalePrice: body.suggestedSalePrice ? parseFloat(body.suggestedSalePrice) : null,
        images: JSON.stringify(body.images || []),
        inStock: true
      }
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
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
