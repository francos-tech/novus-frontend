'use client'

import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Quote, QuoteStatus } from '@/types/quotes'

interface KanbanColumn {
  title: string
  status: QuoteStatus
  quotes: Quote[]
}

interface QuoteCardProps {
  quote: Quote
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const QuoteCard = ({ quote, isSelected, onSelect }: QuoteCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: quote.id || quote.quote_number || 'temp-' + Date.now() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isPublicSubmission = quote.submission_source === 'public_form' || quote.submission_type === 'public'

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`mb-3 cursor-move kanban-card ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {quote.company_name || quote.applicant_name || 'Unnamed Quote'}
            </CardTitle>
            <Badge variant={isSelected ? "default" : "secondary"}>
              ${quote.premium ? Math.round(quote.premium / 1000) + 'k' : 'N/A'}
            </Badge>
          </div>
          {isPublicSubmission && (
            <Badge variant="secondary" className="text-xs mt-1">
              Public Submission
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-sm text-muted-foreground">
            <p>Policy: {quote.policy_type || 'Not specified'}</p>
            <p>Created: {quote.created_at ? new Date(quote.created_at).toISOString().split('T')[0] : 'N/A'}</p>
          </div>
          {onSelect && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => onSelect(quote.id || quote.quote_number || '')}
            >
              {isSelected ? 'Deselect' : 'Select for comparison'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface KanbanBoardProps {
  quotes: Quote[]
  onStatusChange: (quoteId: string, newStatus: QuoteStatus) => void
  onCompareQuotes: (quoteIds: string[]) => void
}

export function KanbanBoard({ quotes, onStatusChange, onCompareQuotes }: KanbanBoardProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns: KanbanColumn[] = [
    { title: 'New', status: 'new', quotes: quotes.filter(q => q.status === 'new') },
    { title: 'Pending', status: 'pending', quotes: quotes.filter(q => q.status === 'pending') },
    { title: 'Under Review', status: 'under_review', quotes: quotes.filter(q => q.status === 'under_review') },
    { title: 'Quoted', status: 'quoted', quotes: quotes.filter(q => q.status === 'quoted') },
    { title: 'Negotiating', status: 'negotiating', quotes: quotes.filter(q => q.status === 'negotiating') },
    { title: 'Bound', status: 'bound', quotes: quotes.filter(q => q.status === 'bound') },
    { title: 'Issued', status: 'issued', quotes: quotes.filter(q => q.status === 'issued') },
    { title: 'Cancelled', status: 'cancelled', quotes: quotes.filter(q => q.status === 'cancelled') }
  ]

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const activeQuote = quotes.find(q => q.id === active.id)
      const overColumn = columns.find(col => 
        col.quotes.some(q => q.id === over.id)
      )

      if (activeQuote && overColumn) {
        if (activeQuote.id) {
          onStatusChange(activeQuote.id, overColumn.status)
        }
      }
    }
    
    setActiveId(null)
  }

  const handleQuoteSelect = (quoteId: string) => {
    setSelectedQuotes(prev => {
      const isSelected = prev.includes(quoteId)
      if (isSelected) {
        return prev.filter(id => id !== quoteId)
      }
      return [...prev, quoteId]
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4">
        {selectedQuotes.length > 0 && (
          <div className="mb-6 flex items-center justify-between bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedQuotes.length} quotes selected
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onCompareQuotes(selectedQuotes)
                  setSelectedQuotes([])
                }}
              >
                Compare Selected
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedQuotes([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {columns.map(column => (
            <div key={column.status} className="bg-card rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  {column.title}
                  <Badge variant="outline" className="ml-auto">
                    {column.quotes.length}
                  </Badge>
                </h3>
              </div>
              
              <div className="p-2 min-h-[200px]">
                <SortableContext
                  items={column.quotes.map(q => q.id || q.quote_number || 'temp-' + Date.now())}
                  strategy={verticalListSortingStrategy}
                >
                  {column.quotes.map(quote => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      isSelected={quote.id ? selectedQuotes.includes(quote.id) : false}
                      onSelect={column.status === 'quoted' ? handleQuoteSelect : undefined}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="transform-none">
            <QuoteCard
              quote={quotes.find(q => q.id === activeId)!}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
} 