
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchLeads,
  fetchStats,
  createLead,
  updateLeadStatus,
  deleteLead,
} from '../../../services/api/leads.api'

export const leadsKeys = {
  all:     () => ['leads'],
  list:    (filters) => ['leads', 'list', filters],
  stats:   () => ['leads', 'stats'],
  detail:  (id) => ['leads', 'detail', id],
}

// ── useLeadsQuery ─────────────────────────────────────────────────────────────
/**
 * Fetches the paginated, filtered list of leads.
 * @param {Object} filters - { search, status, source, page, limit }
 */
export function useLeadsQuery(filters = {}) {
  return useQuery({
    queryKey:  leadsKeys.list(filters),
    queryFn:   () => fetchLeads(filters),
    staleTime: 30_000,   // Data is "fresh" for 30s — won't re-fetch on re-mount
    gcTime:    5 * 60_000, // Keep in cache for 5 minutes after component unmounts
    placeholderData: (previousData) => previousData, // Keep showing old data while new loads (no flicker)
  })
}


export function useStatsQuery() {
  return useQuery({
    queryKey:  leadsKeys.stats(),
    queryFn:   fetchStats,
    staleTime: 60_000,   // Stats are less time-sensitive — 1 minute fresh
    gcTime:    10 * 60_000,
  })
}


export function useCreateLeadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLead,

    onSuccess: (newLead) => {
      // Invalidate the list and stats so they re-fetch with fresh data
      queryClient.invalidateQueries({ queryKey: leadsKeys.all() })
      toast.success(`Lead "${newLead.name}" added successfully`)
    },

  })
}


export function useUpdateLeadStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => updateLeadStatus(id, status),

    // ── Step 1: Optimistically update the cache before the request fires ──
    onMutate: async ({ id, status }) => {
      // Cancel any in-flight queries for leads (prevent race conditions)
      await queryClient.cancelQueries({ queryKey: leadsKeys.all() })

      // Snapshot the current cache — our rollback data
      const previousQueries = queryClient.getQueriesData({ queryKey: leadsKeys.all() })

      // Optimistically update ALL matching query cache entries
      // (handles any active filter combination)
      queryClient.setQueriesData(
        { queryKey: ['leads', 'list'] },
        (oldData) => {
          if (!oldData?.leads) return oldData
          return {
            ...oldData,
            leads: oldData.leads.map((lead) =>
              lead.id === id ? { ...lead, status } : lead
            ),
          }
        }
      )

      // Return snapshot for rollback in onError
      return { previousQueries }
    },

    // ── Step 2: On success — let React Query sync with real server state ──
    onSuccess: (updatedLead) => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.stats() })
      toast.success(`Status updated to "${updatedLead.status.replace('_', ' ')}"`)
    },

    // ── Step 3: On error — rollback the optimistic update ────────────────
    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      // Error toast already shown by Axios interceptor
    },

    onSettled: () => {
      // Always re-sync from server after mutation (success or error)
      queryClient.invalidateQueries({ queryKey: leadsKeys.all() })
    },
  })
}

// ── useDeleteLeadMutation ─────────────────────────────────────────────────────
/**
 * Deletes a lead with optimistic removal from the list.
 */
export function useDeleteLeadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLead,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: leadsKeys.all() })
      const previousQueries = queryClient.getQueriesData({ queryKey: leadsKeys.all() })

      // Optimistically remove from list
      queryClient.setQueriesData(
        { queryKey: ['leads', 'list'] },
        (oldData) => {
          if (!oldData?.leads) return oldData
          return {
            ...oldData,
            leads: oldData.leads.filter((lead) => lead.id !== id),
            total: (oldData.total || 1) - 1,
          }
        }
      )

      return { previousQueries }
    },

    onSuccess: (deletedLead) => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.all() })
      toast.success(`Lead "${deletedLead.name}" deleted`)
    },

    onError: (err, id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: leadsKeys.all() })
    },
  })
}