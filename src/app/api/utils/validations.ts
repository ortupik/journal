import { z } from 'zod';

export const journalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  category: z.string().optional(),
  sentiment: z.string().optional(),
  suggestions: z.string().optional()
});
