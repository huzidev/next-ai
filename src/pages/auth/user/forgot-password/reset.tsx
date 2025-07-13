import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { isPasswordValid } from "@/utils/passwordValidation";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ResetPassword() {
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
      const response = await api.post('/api/auth/user/reset-password', { 
        email,
        password: formData.password
      });

      if (response.success) {
        toast({
          title: "Password Reset Successfully",
          description: "You can now sign in with your new password",
        });
        // Redirect to sign in page
        router.push('/auth/user/signin');
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
            title="Reset Your Password"
            subtitle={`Enter new password for ${email}`}
          />

        <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Create a new password"
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
                
                <PasswordRequirements password={formData.password} show={!!formData.password} />
              </div>

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
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  !passwordsMatch && formData.confirmPassword ? 'max-h-6 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}>
                  <div className="flex items-center text-xs text-red-400">
                    <X className="h-3 w-3 mr-1 transition-transform duration-200" />
                    Passwords do not match
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            <AuthLink 
              text="Remember your password?"
              linkText="Sign in"
              linkHref="/auth/user/signin"
            />
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
