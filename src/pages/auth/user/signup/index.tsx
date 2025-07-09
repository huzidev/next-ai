import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  // Password requirements validation
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);

    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      if (e.target.name === 'password') {
        setPasswordsMatch(e.target.value === formData.confirmPassword || formData.confirmPassword === '');
      } else {
        setPasswordsMatch(e.target.value === formData.password);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    // Check if all password requirements are met
    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
    if (!allRequirementsMet) {
      toast({
        title: "Password Requirements",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/user/signup', formData);

      if (response.success) {
        toast({
          title: "Account Created!",
          description: "Please check your email for verification code",
        });

        // Redirect to verification page with email
        router.push(`/auth/user/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader 
            title="Create Your Account"
            subtitle="Join thousands of users exploring AI possibilities"
          />

        <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center text-gray-200">
                  <User className="h-4 w-4 mr-2" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center text-gray-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center text-gray-200">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="auth-input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1 mt-2">
                    <div className={`flex items-center text-xs ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordRequirements.length ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordRequirements.uppercase ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      One uppercase letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordRequirements.number ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      One number
                    </div>
                    <div className={`flex items-center text-xs ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                      {passwordRequirements.special ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      One special character
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center text-gray-200">
                  <Lock className="h-4 w-4 mr-2" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="auth-input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Password Match Error */}
                {!passwordsMatch && formData.confirmPassword && (
                  <div className="flex items-center text-xs text-red-400 mt-1">
                    <X className="h-3 w-3 mr-1" />
                    Passwords do not match
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <AuthLink 
              text="Already have an account?"
              linkText="Sign in"
              linkHref="/auth/user/signin"
            />
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</Link>
        </div>
        </div>
      </div>
    </div>
  );
}
