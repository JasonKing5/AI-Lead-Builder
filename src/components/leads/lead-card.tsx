'use client'

import { Lead } from '@/lib/supabase/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LeadCardProps {
  lead: Lead
  isDragging?: boolean
  className?: string
}

export function LeadCard({ lead, isDragging = false, className }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    touchAction: 'none',
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn('touch-none', className)}
    >
      <Card className="mb-2 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{lead.name}</h4>
              {lead.company && (
                <p className="text-sm text-gray-600 truncate">{lead.company}</p>
              )}
              {lead.role && (
                <p className="text-xs text-gray-500 mt-1 truncate">{lead.role}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
