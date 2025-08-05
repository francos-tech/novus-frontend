import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { ApiResponse } from '../../types/quotes'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res)
      case 'POST':
        return await handlePost(req, res)
      case 'PUT':
        return await handlePut(req, res)
      case 'DELETE':
        return await handleDelete(req, res)
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' })
    }
  } catch (error: any) {
    console.error('Drafts API error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { created_by } = req.query

  if (!created_by) {
    return res.status(400).json({ 
      success: false, 
      error: 'created_by parameter is required' 
    })
  }

  const { data, error } = await supabaseAdmin
    .from('drafts')
    .select('*')
    .eq('created_by', created_by)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching drafts:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch drafts' 
    })
  }

  res.status(200).json({
    success: true,
    data: data,
    message: `Retrieved ${data?.length || 0} drafts`
  })
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const draftData = { ...req.body }

  if (!draftData.created_by) {
    return res.status(400).json({
      success: false,
      error: 'created_by is required'
    })
  }

  const { data, error } = await supabaseAdmin
    .from('drafts')
    .insert(draftData)
    .select()
    .single()

  if (error) {
    console.error('Error creating draft:', error)
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }

  res.status(201).json({
    success: true,
    data: data,
    message: 'Draft saved successfully'
  })
}

async function handlePut(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query
  const updateData = { ...req.body }

  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'Draft ID is required' 
    })
  }

  delete updateData.id // Remove ID from update data
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('drafts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating draft:', error)
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }

  res.status(200).json({
    success: true,
    data: data,
    message: 'Draft updated successfully'
  })
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'Draft ID is required' 
    })
  }

  const { error } = await supabaseAdmin
    .from('drafts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting draft:', error)
    return res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }

  res.status(200).json({
    success: true,
    message: 'Draft deleted successfully'
  })
} 