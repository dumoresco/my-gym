/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [, dispatchAction, isPending] = useActionState(
    async (_previousData: any, formData: FormData) => {
      const response = await loginAction(formData);

      return response;
    },
    null
  );

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form action={dispatchAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Image src="/dark-icon.svg" alt="Logo" width={32} height={32} />
              </div>
              <span className="sr-only">Iost</span>
            </a>
            <div className="flex  flex-col  items-center mt-4">
              <h2 className="text-xl font-bold">Login</h2>
              <h2 className="text-xl ">Preencha seu email a a sua senha</h2>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Senha</Label>
              <Input
                id="senha"
                type="password"
                name="password"
                placeholder="Informe sua senha"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12" disabled={isPending}>
              {isPending ? (
                <LoaderCircle className="w-6 h-6 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
