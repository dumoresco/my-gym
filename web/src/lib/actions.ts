"use server";

import { signInSchema } from "@/app/schemas/auth.schema";
import { signIn } from "../../auth";

export const loginAction = async (formData: FormData) => {
  const { success, data } = signInSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!success) {
    return;
  }

  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    throw error;
  }
};
