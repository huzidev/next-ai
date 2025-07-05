import { ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  backHref?: string;
  backText?: string;
}

export default function AuthHeader({ 
  title, 
  subtitle, 
  backHref = "/", 
  backText = "Back to Home" 
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-8 relative">
      <div className="absolute top-0 left-0">
        <Link href={backHref} className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{backText}</span>
        </Link>
      </div>
      
      <div className="flex items-center justify-center space-x-2 mb-4 mt-8">
        <Bot className="h-8 w-8 text-blue-400" />
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Next-AI
        </span>
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-300">{subtitle}</p>
    </div>
  );
}
