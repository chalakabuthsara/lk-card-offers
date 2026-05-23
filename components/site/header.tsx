import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { roleAtLeast } from "@/lib/rbac";
import { NavLinks, type NavItem } from "@/components/site/nav-links";
import { MobileNav } from "@/components/site/mobile-nav";
import { AccountMenu } from "@/components/site/account-menu";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { CommandPalette } from "@/components/site/command-palette";

export async function SiteHeader() {
  const session = await auth();
  const role = session?.user?.role;

  const navItems: NavItem[] = [
    { href: "/offers", label: "Offers" },
  ];
  if (session?.user) {
    navItems.push({ href: "/submit", label: "Submit" });
  }
  if (roleAtLeast(role, "maintainer")) {
    navItems.push({ href: "/maintainer", label: "Maintainer" });
  }
  if (roleAtLeast(role, "admin")) {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
              L
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight whitespace-nowrap">
              LkCardOffers
            </span>
          </Link>
          <NavLinks items={navItems} />
        </div>
        <div className="flex items-center gap-3">
          <CommandPalette />
          <ThemeToggle />
          {session?.user ? (
            <AccountMenu
              name={session.user.name ?? "Account"}
              email={session.user.email ?? ""}
              role={session.user.role}
              signOutAction={signOutAction}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden xs:inline-block">
                <Button variant="ghost" className="h-9 rounded-full px-5">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="h-9 rounded-full px-5">Sign up</Button>
              </Link>
            </div>
          )}
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
