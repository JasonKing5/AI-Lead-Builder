'use client'

import { useState, useEffect } from 'react'
import { LeadsTable } from '@/components/leads/leads-table'
import { LeadsBoard } from '@/components/leads/leads-board'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { leadService } from '@/lib/supabase/lead.service'
import { Lead } from '@/lib/supabase/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'table' | 'board'>('table')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const data = await leadService.getLeads()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeadUpdate = async (id: string, updates: Partial<Lead>) => {
    const previousLeads = [...leads]
    
    try {
      // Optimistic update
      setLeads(prev => 
        prev.map(lead => 
          lead.id === id ? { ...lead, ...updates } : lead
        )
      )
      
      await leadService.updateLead(id, updates)
    } catch (error) {
      console.error('Error updating lead:', error)
      // Revert on error
      setLeads(previousLeads)
      throw error
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <Tabs 
          value={view} 
          onValueChange={(value) => setView(value as 'table' | 'board')}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-lg shadow">
        {view === 'table' ? (
          <LeadsTable 
            leads={leads} 
            loading={loading} 
            onLeadUpdate={handleLeadUpdate} 
          />
        ) : (
          <LeadsBoard 
            leads={leads} 
            loading={loading}
            onLeadUpdate={handleLeadUpdate} 
          />
        )}
      </div>
    </div>
  )
}