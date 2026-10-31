import { z } from "zod";

export const messageBodySchema = z.object({
  text: z.string().max(12_000),
});

export const urlBodySchema = z.object({
  url: z.string().max(2_000),
});

export const deviceBodySchema = z.object({
  remoteAccess: z.boolean(),
  screenSharing: z.boolean(),
  unknownSource: z.boolean(),
  accessibilityRisk: z.boolean(),
});

export const transactionBodySchema = z.object({
  amount: z.number().finite(),
  recipientName: z.string().min(1).max(80),
  recipientUpi: z.string().min(3).max(80),
  newRecipient: z.boolean(),
  knownRecipient: z.boolean().optional(),
  messageContext: z.string().max(12_000).optional().default(""),
  suspiciousUrl: z.string().max(2_000).optional().default(""),
  paymentRequest: z.boolean().optional(),
  urgentPayment: z.boolean().optional(),
  unusualTransaction: z.boolean().optional(),
  device: deviceBodySchema.optional(),
});

export const paymentReviewSchema = transactionBodySchema;
