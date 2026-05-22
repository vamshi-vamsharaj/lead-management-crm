

import apiClient from './axios.config'


/**
 * Fetch all leads with optional filtering/search/pagination.
 * @param {Object} params - { search, status, source, page, limit }
 * @returns {Promise<{ leads, total, page, limit, totalPages }>}
 */
export const fetchLeads = async (params = {}) => {
  // Remove undefined/empty values to keep URLs clean
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  )
  const response = await apiClient.get('/leads', { params: cleanParams })
  return response.data.data
}

/**
 * Fetch dashboard statistics.
 * @returns {Promise<{ total, new, interested, notInterested, converted, conversionRate }>}
 */
export const fetchStats = async () => {
  const response = await apiClient.get('/leads/stats')
  return response.data.data
}

/**
 * Fetch a single lead by ID.
 * @param {string} id - UUID
 * @returns {Promise<Lead>}
 */
export const fetchLeadById = async (id) => {
  const response = await apiClient.get(`/leads/${id}`)
  return response.data.data
}

/**
 * Create a new lead.
 * @param {{ name, phone, source, notes }} data
 * @returns {Promise<Lead>}
 */
export const createLead = async (data) => {
  const response = await apiClient.post('/leads', data)
  return response.data.data
}

/**
 * Update a lead's status.
 * @param {string} id     - UUID
 * @param {string} status - 'new' | 'interested' | 'not_interested' | 'converted'
 * @returns {Promise<Lead>}
 */
export const updateLeadStatus = async (id, status) => {
  const response = await apiClient.patch(`/leads/${id}/status`, { status })
  return response.data.data
}

/**
 * Delete a lead permanently.
 * @param {string} id - UUID
 * @returns {Promise<{ id, name }>}
 */
export const deleteLead = async (id) => {
  const response = await apiClient.delete(`/leads/${id}`)
  return response.data.data
}