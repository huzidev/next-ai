import { Bot } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  linkHref?: string;
}

export default function Logo({ className = "", linkHref = "/" }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Bot className="h-8 w-8 text-blue-400" />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
        Next-AI
      </span>
    </div>
  );

  return linkHref ? <Link href={linkHref}>{logoContent}</Link> : logoContent;
}
