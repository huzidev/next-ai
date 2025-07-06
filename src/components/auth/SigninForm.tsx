import AuthLink from "@/components/auth/AuthLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

interface SigninFormProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  showPassword: boolean;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
  variant: 'user' | 'admin';
}

export default function SigninForm({
  formData,
  isLoading,
  showPassword,
  onFormDataChange,
  onSubmit,
  onTogglePassword,
  variant
}: SigninFormProps) {
  const isAdmin = variant === 'admin';
  
  const colorClasses = isAdmin ? {
    focusColor: "focus:border-purple-400 focus:ring-purple-400",
    linkColor: "text-purple-400 hover:text-purple-300",
    buttonGradient: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
  } : {
    focusColor: "focus:border-blue-400 focus:ring-blue-400",
    linkColor: "text-blue-400 hover:text-blue-300",
    buttonGradient: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
  };

  const config = isAdmin ? {
    emailLabel: "Admin Email",
    emailPlaceholder: "Enter your admin email",
    forgotPasswordHref: "/auth/admin/forgot-password",
    buttonText: isLoading ? "Signing In..." : "Sign In to Dashboard",
    authLinkText: "Need admin access?",
    authLinkLabel: "Contact Super Admin",
    authLinkHref: "/contact",
    authLinkVariant: "purple" as const
  } : {
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    forgotPasswordHref: "/auth/user/forgot-password",
    buttonText: isLoading ? "Signing In..." : "Sign In",
    authLinkText: "Don't have an account?",
    authLinkLabel: "Sign up",
    authLinkHref: "/auth/user/signup",
    authLinkVariant: "blue" as const
  };

  return (
    <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center text-gray-200">
              <Mail className="h-4 w-4 mr-2" />
              {config.emailLabel}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={config.emailPlaceholder}
              value={formData.email}
              onChange={onFormDataChange}
              required
              className={`h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${colorClasses.focusColor}`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium flex items-center text-gray-200">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </Label>
              <Link 
                href={config.forgotPasswordHref}
                className={`text-sm ${colorClasses.linkColor} font-medium transition-colors`}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={onFormDataChange}
                required
                className={`h-11 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${colorClasses.focusColor}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-transparent"
                onClick={onTogglePassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full h-11 ${colorClasses.buttonGradient} text-white font-medium transition-all duration-200`}
            disabled={isLoading}
          >
            {config.buttonText}
          </Button>
        </form>

        <AuthLink 
          text={config.authLinkText}
          linkText={config.authLinkLabel}
          linkHref={config.authLinkHref}
          variant={config.authLinkVariant}
        />
      </CardContent>
    </Card>
  );
}
