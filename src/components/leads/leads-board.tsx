'use client'

import { useState, useMemo } from 'react'
import { DndContext, DragEndEvent, closestCenter, DragOverlay } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { Lead, LeadStatus } from '@/lib/supabase/types'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { LeadCard } from '@/components/leads/lead-card'

const STATUS_CONFIG = {
  Draft: {
    title: 'Draft',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    nextStatus: ['Approved'] as const,
  },
  Approved: {
    title: 'Approved',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    nextStatus: ['Sent'] as const,
  },
  Sent: {
    title: 'Sent',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    nextStatus: [] as const,
  },
} as const

const STATUSES = Object.entries(STATUS_CONFIG).map(([id, config]) => ({
  id: id as LeadStatus,
  ...config
}))

interface LeadsBoardProps {
  leads: Lead[]
  onLeadUpdate: (id: string, updates: Partial<Lead>) => Promise<void>
  loading: boolean
}

export function LeadsBoard({ leads, onLeadUpdate, loading }: LeadsBoardProps) {
  const [isDragging, setIsDragging] = useState(false)

  // Group leads by status
  const groupedLeads = useMemo(() => {
    const groups = {
      Draft: [] as Lead[],
      Approved: [] as Lead[],
      Sent: [] as Lead[],
    }

    leads.forEach((lead: Lead) => {
      if (lead.status in groups) {
        groups[lead.status as keyof typeof groups].push(lead)
      }
    })

    return groups
  }, [leads])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  // Define allowed status transitions
  const getAllowedTransitions = (currentStatus: LeadStatus): LeadStatus[] => {
    const transitions: Record<LeadStatus, LeadStatus[]> = {
      'Draft': ['Approved'],
      'Approved': ['Sent'],
      'Sent': []
    }
    return transitions[currentStatus] || []
  }

  // Check if a drag operation should be allowed
  const canDrop = (activeStatus: LeadStatus, overStatus: LeadStatus): boolean => {
    // Can only drop on a different status
    if (activeStatus === overStatus) return false
    
    // Check if the target status is a valid next status
    return getAllowedTransitions(activeStatus).includes(overStatus)
  }

  // Handle drag over to provide visual feedback
  const handleDragOver = (event: any) => {
    const { active, over } = event
    if (!over) return

    // Get the status column element
    const overElement = document.querySelector(`[data-status] [data-card-id="${over.id}"], [data-status="${over.id}"]`)
    if (!overElement) return

    const statusColumn = overElement.closest('[data-status]') as HTMLElement
    if (!statusColumn) return

    const targetStatus = statusColumn.dataset.status as LeadStatus | undefined
    if (!targetStatus || !STATUSES.some(s => s.id === targetStatus)) return

    // Find the dragged lead
    const activeLead = leads.find(lead => lead.id === active.id)
    if (!activeLead) return

    // Check if the drop is allowed
    const isDropAllowed = canDrop(activeLead.status, targetStatus)
    
    // Set cursor style based on whether drop is allowed
    statusColumn.style.cursor = isDropAllowed ? 'copy' : 'no-drop'
  }

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      setIsDragging(false)
      return
    }

    const activeId = String(active.id)
    let targetStatus: LeadStatus | null = null

    // Get the status from the over element's data-status attribute
    const overElement = document.querySelector(`[data-status] [data-card-id="${over.id}"], [data-status="${over.id}"]`) as HTMLElement | null
    
    if (overElement) {
      // Find the closest status container
      const statusContainer = overElement.closest('[data-status]') as HTMLElement | null
      if (statusContainer?.dataset.status) {
        targetStatus = statusContainer.dataset.status as LeadStatus
      }
    }

    // If we still don't have a target status, bail out
    if (!targetStatus) {
      console.log('No target status found for drop')
      setIsDragging(false)
      return
    }

    // Find the dragged lead
    const activeLead = leads.find(lead => lead.id === activeId)
    if (!activeLead) {
      console.log('Active lead not found')
      setIsDragging(false)
      return
    }

    // Check if the status transition is allowed
    if (!canDrop(activeLead.status, targetStatus)) {
      toast.error(`Cannot move from ${activeLead.status} to ${targetStatus}`)
      setIsDragging(false)
      return
    }

    try {
      // Update the lead status
      await onLeadUpdate(activeId, { status: targetStatus })
      toast.success(`Lead status updated to ${targetStatus}`)
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error('Failed to update lead status')
    } finally {
      setIsDragging(false)
    }
  }

  const renderLeads = (status: LeadStatus) => {
    const leadsForStatus = groupedLeads[status] || []

    return (
      <div 
        className="space-y-2 min-h-[100px] p-2 h-full"
        data-status={status}
      >
        <SortableContext items={leadsForStatus.map(lead => lead.id)}>
          {leadsForStatus.map(lead => (
            <div key={lead.id} className="w-full" data-card-id={lead.id}>
              <LeadCard 
                lead={lead}
                isDragging={isDragging}
              />
            </div>
          ))}
        </SortableContext>
      </div>
    )
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
      autoScroll={false}
    >
      <div className="flex space-x-4 overflow-x-auto pb-4 px-2 min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          STATUSES.map((status) => {
            return (
              <div 
                key={status.id} 
                className="flex-shrink-0 w-80"
                data-status={status.id}
              >
                <div className={`${status.bgColor} border ${status.borderColor} rounded-lg h-full flex flex-col`}>
                  <div 
                    className="flex items-center justify-between px-2 py-1 flex-shrink-0"
                    id={status.id}
                  >
                    <h3 className="font-medium text-gray-700">{status.title}</h3>
                    <span className="text-sm bg-white bg-opacity-50 px-2 py-0.5 rounded-full text-gray-600">
                      {groupedLeads[status.id].length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {renderLeads(status.id)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </DndContext>
  )
}
