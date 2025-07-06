'use client'

import { useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Lead, LeadStatus } from '@/lib/supabase/types'
import { leadService } from '@/lib/supabase/lead.service'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingLeads, setUpdatingLeads] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'company',
      header: 'Company',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as LeadStatus
        const statusColors = {
          Draft: 'bg-yellow-100 text-yellow-800',
          Approved: 'bg-blue-100 text-blue-800',
          Sent: 'bg-green-100 text-green-800',
        }
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}
          >
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date Added',
      cell: ({ row }) => format(new Date(row.getValue('created_at')), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isUpdating = updatingLeads[row.original.id]
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate(row.original.id, 'Approved')}
              disabled={row.original.status === 'Approved' || isUpdating}
              className="min-w-[100px]"
            >
              {isUpdating && row.original.status !== 'Approved' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {row.original.status === 'Approved' ? 'Approved' : 'Approve'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate(row.original.id, 'Sent')}
              disabled={row.original.status === 'Sent' || isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating && row.original.status !== 'Sent' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {row.original.status === 'Sent' ? 'Sent' : 'Mark as Sent'}
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
  })

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

  const handleStatusUpdate = async (id: string, status: LeadStatus) => {
    const previousLeads = [...leads]
    const leadName = leads.find(lead => lead.id === id)?.name || 'Lead'
    
    try {
      // Optimistic update
      setLeads(prev => 
        prev.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        )
      )
      
      setUpdatingLeads(prev => ({ ...prev, [id]: true }))
      
      await leadService.updateLead(id, { status })
      
      toast.success(`${leadName} marked as ${status.toLowerCase()}`)
    } catch (error) {
      console.error('Error updating lead status:', error)
      // Revert on error
      setLeads(previousLeads)
      toast.error(`Failed to update ${leadName.toLowerCase()}`)
    } finally {
      setUpdatingLeads(prev => ({ ...prev, [id]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Leads Management</h2>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search leads..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-500" />
                    <span>Loading leads...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}