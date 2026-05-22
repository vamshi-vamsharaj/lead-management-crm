
import { z } from 'zod'

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(
      /^[+\d\s\-().]+$/,
      'Only digits, +, -, spaces, and parentheses allowed'
    ),

  source: z.enum(['call', 'whatsapp', 'field'], {
    required_error: 'Please select a source',
    invalid_type_error: 'Invalid source selected',
  }),

  notes: z
    .string()
    .trim()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
})