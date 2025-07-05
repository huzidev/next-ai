import Link from "next/link";

interface AuthFooterProps {
  helpText?: string;
  links?: Array<{
    href: string;
    text: string;
  }>;
}

export default function AuthFooter({ 
  helpText = "Need help?", 
  links = [
    { href: "/support", text: "Contact Support" },
    { href: "/auth/admin/signin", text: "Admin Login" }
  ]
}: AuthFooterProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-400 mb-2">{helpText}</p>
      <div className="space-x-4 text-sm">
        {links.map((link, index) => (
          <span key={link.href}>
            <Link 
              href={link.href} 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {link.text}
            </Link>
            {index < links.length - 1 && (
              <span className="text-gray-600 ml-4">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
