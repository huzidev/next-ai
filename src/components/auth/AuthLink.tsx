import Link from "next/link";

interface AuthLinkProps {
  text: string;
  linkText: string;
  linkHref: string;
  variant?: 'blue' | 'purple';
}

export default function AuthLink({ 
  text, 
  linkText, 
  linkHref, 
  variant = 'blue' 
}: AuthLinkProps) {
  const linkColorClass = variant === 'purple' 
    ? "text-purple-400 hover:text-purple-300" 
    : "text-blue-400 hover:text-blue-300";

  return (
    <div className="mt-4 text-center text-sm">
      <span className="text-gray-300">{text} </span>
      <Link href={linkHref} className={`${linkColorClass} font-medium transition-colors`}>
        {linkText}
      </Link>
    </div>
  );
}
