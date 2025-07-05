import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Next-AI
            </span>
          </div>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link href="/auth/user/signin">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              User Login
            </Button>
          </Link>
          <Link href="/auth/admin/signin">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Admin Login
            </Button>
          </Link>
          <Link href="/auth/user/signup">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
