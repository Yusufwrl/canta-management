import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: [
        { date: 'desc' },        // Önce tarihe göre (yeni tarihler üstte)
        { createdAt: 'desc' }    // Sonra aynı gün içinde oluşturulma zamanına göre (yeni işlemler üstte)
      ]
    })
    
    // Frontend için format dönüştür
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type === 'gelir' ? 'income' : 'expense',
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date.toISOString()
    }))
    
    return NextResponse.json(formattedTransactions)
  } catch (error) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const transaction = await prisma.transaction.create({
      data: {
        type: body.type === 'income' ? 'gelir' : 'gider',
        amount: parseFloat(body.amount),
        description: body.description,
        category: body.category || 'Genel',
        date: body.date ? new Date(body.date) : new Date()
      }
    })
    
    return NextResponse.json({
      id: transaction.id,
      type: transaction.type === 'gelir' ? 'income' : 'expense',
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date.toISOString()
    }, { status: 201 })
  } catch (error) {
    console.error('Transaction creation error:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
