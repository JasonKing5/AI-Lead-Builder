export type LeadStatus = 'Draft' | 'Approved' | 'Sent'

export type Lead = {
  id: string
  name: string
  role: string
  company: string
  linkedin_url: string | null
  message: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'> & {
  status?: LeadStatus
}

export type LeadUpdate = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>