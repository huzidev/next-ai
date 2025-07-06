import { Bot } from "lucide-react";
import Link from "next/link";

export default function AuthPageHeader() {
  return (
    <header className="w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto flex h-16 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Next-AI
          </span>
        </Link>
      </div>
    </header>
  );
}
