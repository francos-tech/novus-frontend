import { useCallback, useEffect, useRef } from 'react'

interface UseAutoSaveOptions {
  data: any
  onSave: (data: any) => Promise<void>
  delay?: number // in milliseconds
  enabled?: boolean
}

export function useAutoSave({ 
  data, 
  onSave, 
  delay = 30000, // 30 seconds
  enabled = true 
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dataRef = useRef(data)
  const lastSavedRef = useRef<string | undefined>(undefined)

  const saveData = useCallback(async () => {
    if (!enabled) return

    const currentDataStr = JSON.stringify(data)
    
    // Don't save if data hasn't changed
    if (currentDataStr === lastSavedRef.current) return
    
    try {
      await onSave(data)
      lastSavedRef.current = currentDataStr
      console.log('Draft auto-saved successfully')
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }, [data, onSave, enabled])

  const scheduleAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(saveData, delay)
  }, [saveData, delay])

  // Schedule auto-save when data changes
  useEffect(() => {
    if (!enabled) return

    const currentDataStr = JSON.stringify(data)
    
    // Only schedule if data actually changed
    if (currentDataStr !== JSON.stringify(dataRef.current)) {
      dataRef.current = data
      scheduleAutoSave()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, scheduleAutoSave, enabled])

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    return saveData()
  }, [saveData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { saveNow }
} 