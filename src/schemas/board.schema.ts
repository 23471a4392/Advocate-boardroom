import { z } from 'zod';

export const createSessionSchema = z.object({
  proposalTitle: z
    .string()
    .min(3, 'Proposal title must be at least 3 characters long')
    .max(250, 'Proposal title must not exceed 250 characters'),
  proposalContent: z
    .string()
    .min(10, 'Proposal content must be at least 10 characters long')
    .max(15000, 'Proposal content must not exceed 15000 characters'),
  selectedPersonas: z
    .array(z.string())
    .optional()
    .default(['victor_vance', 'elena_rostova', 'marcus_chen', 'sasha_morales']),
});

export const defendProposalSchema = z.object({
  userArgument: z
    .string()
    .min(5, 'User argument must be at least 5 characters long')
    .max(10000, 'User argument must not exceed 10000 characters'),
  targetPersonaId: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type DefendProposalInput = z.infer<typeof defendProposalSchema>;
