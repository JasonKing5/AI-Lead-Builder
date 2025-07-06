import { NextResponse } from 'next/server'
import { leadService } from '@/lib/supabase/lead.service'
import { LeadInsert } from '@/lib/supabase/types'

export async function GET() {
  try {
    const leads = await leadService.getLeads()
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const leadData: LeadInsert = await request.json()
    const newLead = await leadService.createLead(leadData)
    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}