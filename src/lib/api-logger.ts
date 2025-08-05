import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface APILogEntry {
  quote_id?: string
  quote_number?: string
  policy_number?: string
  service: string
  endpoint: string
  method: string
  operation_type: 'quote' | 'bind' | 'issue' | 'document' | 'other'
  carrier: 'CF' | 'Markel'
  request_data?: any
  request_headers?: any
  response_data?: any
  response_headers?: any
  status_code?: number
  error_message?: string
  duration_ms?: number
}

// Queue to store pending logs
const logQueue: APILogEntry[] = [];
let isProcessingQueue = false;

// Process logs in background
async function processLogQueue() {
  if (isProcessingQueue || logQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  try {
    while (logQueue.length > 0) {
      const batch = logQueue.splice(0, 10); // Process 10 logs at a time
      
      const { error } = await supabase
        .from('api_logs')
        .insert(batch.map(entry => ({
          ...entry,
          created_at: new Date().toISOString()
        })));

      if (error) {
        console.error('Error processing log batch:', error);
        // Put failed logs back in queue
        logQueue.unshift(...batch);
        break;
      }
    }
  } catch (error) {
    console.error('Error in log queue processing:', error);
  } finally {
    isProcessingQueue = false;
    
    // If there are more logs, schedule next processing
    if (logQueue.length > 0) {
      setTimeout(processLogQueue, 1000);
    }
  }
}

// Non-blocking log function
export function logAPICall(logEntry: APILogEntry) {
  // Add to queue
  logQueue.push({
    ...logEntry,
    duration_ms: Date.now() - (logEntry.duration_ms || Date.now())
  });
  
  // Schedule processing if not already running
  if (!isProcessingQueue) {
    setTimeout(processLogQueue, 0);
  }
}

// Helper to create log entry from axios request/response
export function createLogEntryFromAxios(
  quote_id: string | undefined,
  quote_number: string | undefined,
  operation_type: APILogEntry['operation_type'],
  carrier: APILogEntry['carrier'],
  axiosConfig: any,
  axiosResponse?: any,
  error?: any
) {
  const logEntry: APILogEntry = {
    quote_id,
    quote_number,
    service: carrier.toLowerCase(),
    endpoint: axiosConfig.url,
    method: axiosConfig.method?.toUpperCase() || 'POST',
    operation_type,
    carrier,
    request_data: axiosConfig.data,
    request_headers: axiosConfig.headers,
  }

  if (axiosResponse) {
    logEntry.response_data = axiosResponse.data
    logEntry.response_headers = axiosResponse.headers
    logEntry.status_code = axiosResponse.status
  }

  if (error) {
    logEntry.error_message = error.message
    if (error.response) {
      logEntry.response_data = error.response.data
      logEntry.response_headers = error.response.headers
      logEntry.status_code = error.response.status
    }
  }

  return logEntry
}