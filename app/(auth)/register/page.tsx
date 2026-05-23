"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    startTransition(async () => {
      const result = await registerUser({ name, email, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        setError("Account created. Please sign in.");
        router.push("/login");
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-8 py-12">
      <header className="space-y-2 text-center pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create account
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit offers and track approvals.
        </p>
      </header>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 border border-border bg-card p-8 rounded-xl"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </Label>
          <Input id="name" name="name" required minLength={2} placeholder="John Doe" className="rounded-[6px] h-11 px-4 bg-transparent" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" className="rounded-[6px] h-11 px-4 bg-transparent" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="rounded-[6px] h-11 px-4 bg-transparent"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Six characters minimum.
          </p>
        </div>
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={pending}
            className="w-full rounded-full h-12 text-base font-semibold"
          >
            {pending ? "Creating…" : "Create account"}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground underline-offset-4 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
