import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-8 py-12">
      <header className="space-y-2 text-center pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to the wire.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground text-center">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
