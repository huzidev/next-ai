import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Pages where you don't want to show nav links
  const hideNavRoutes = [
    "/auth/user/signin",
    "/auth/user/signup",
    "/auth/user/forgot-password",
    "/auth/user/verify",
    "/auth/admin/signin",
    "/auth/admin/forgot-password",
    "/auth/admin/forgot-password/verify",
    "/auth/user/forgot-password/verify",
    "/auth/admin/forgot-password/reset",
    "/legal/privacy-policy",
    "/legal/terms-of-service",
  ];

  const showNav = !hideNavRoutes.includes(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Logo />

        {showNav && (
          <nav className="flex items-center space-x-4">
            <Link href="/auth/user/signin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-transparent">
                User Login
              </Button>
            </Link>
            <Link href="/auth/admin/signin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-transparent">
                Admin Login
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
