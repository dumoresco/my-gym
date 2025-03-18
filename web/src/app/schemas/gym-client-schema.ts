import { object, z } from "zod";

export const updateGymClientSchema = object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(1, "Phone is required").optional(),
  status: z.string().min(1, "Status is required").optional(),
  subscriptionId: z.string().min(1, "Subscription ID is required").optional(),
});

// {
// 	"name": "Thabata Dandara",
// 	"email": "thabatadandara@gmail.com",
// 	"phone": "51994256512",
// 	"subscriptionId": "4d18fe83-2daf-4ff5-bbd0-a8af2c5a41ad"
// }
export const createGymClientSchema = object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  taxId: z.string().min(1, "Tax ID is required"),
});
