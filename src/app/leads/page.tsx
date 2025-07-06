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

  const exportToCSV = () => {
    const headers = ['Name', 'Role', 'Company', 'LinkedIn', 'Status', 'Message'];
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => 
        [
          `"${lead.name || ''}"`,
          `"${lead.role || ''}"`,
          `"${lead.company || ''}"`,
          `"${lead.linkedin_url || ''}"`,
          `"${lead.status || ''}"`,
          `"${(lead.message || '').replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">Leads Management</h1>
            <Tabs 
              value={view} 
              onValueChange={(value) => setView(value as 'table' | 'board')}
            >
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={leads.length === 0}
          >
            Export to CSV
          </button>
        </div>
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