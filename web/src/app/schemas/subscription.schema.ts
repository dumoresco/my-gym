import { object, z } from "zod";

export const subscriptionSchema = object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters"),
  price: z.number().min(1, "Price is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});
