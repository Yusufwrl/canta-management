import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params
    
    const transaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        type: body.type === 'income' ? 'gelir' : 'gider',
        amount: parseFloat(body.amount),
        description: body.description,
        date: body.date ? new Date(body.date) : new Date()
      }
    })
    
    return NextResponse.json({
      id: transaction.id,
      type: transaction.type === 'gelir' ? 'income' : 'expense',
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date.toISOString()
    })
  } catch (error) {
    console.error('Transaction update error:', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    await prisma.transaction.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Transaction delete error:', error)
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
}
