import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import * as ROUTES from "@/routes/auth/admin/route";
import { isPasswordValid } from "@/utils/passwordValidation";
import { Crown, Eye, EyeOff, Lock, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Get email from URL query params
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);

    // Check if passwords match when either password field changes
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
    if (!isPasswordValid(formData.password)) {
      toast({
        title: "Password Requirements",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/admin/reset-password', { 
        email,
        password: formData.password
      });

      if (response.success) {
        toast({
          title: "Password Reset Successfully",
          description: "You can now sign in with your new password",
        });
        // Redirect to admin sign in page
        router.push(ROUTES.SIGNIN);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
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
            title="Reset Admin Password"
            subtitle="Create a new secure password for your admin account"
          />
          
          <div className="flex items-center justify-center mb-6">
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-400">
              <Crown className="h-3 w-3 mr-1" />
              Admin Portal
            </Badge>
          </div>

          <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center text-gray-200">
                    <Lock className="h-4 w-4 mr-2" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Password Requirements */}
                <PasswordRequirements password={formData.password} show={true} />

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center text-gray-200">
                    <Lock className="h-4 w-4 mr-2" />
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400 pr-10 transition-all duration-200 ${
                        !passwordsMatch && formData.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className={`flex items-center space-x-2 text-sm transition-all duration-200 ${
                      passwordsMatch ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {passwordsMatch ? (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          Passwords match
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="h-3 w-3 mr-2" />
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {email && (
                  <p className="text-sm text-gray-400">
                    Resetting password for: <span className="text-purple-300">{email}</span>
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200"
                  disabled={isLoading || !passwordsMatch || !isPasswordValid(formData.password)}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>

              <AuthLink 
                text="Remember your password?"
                linkText="Sign In"
                linkHref={ROUTES.SIGNIN}
                variant="purple"
              />
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center text-xs text-gray-400">
            <p>
              Your new password will be used for all future admin logins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
