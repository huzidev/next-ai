import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/user/forgot-password', { email });

      if (response.success) {
        setIsEmailSent(true);
        toast({
          title: "Reset Link Sent",
          description: "Check your email for password reset instructions",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader 
            title="Check Your Email"
            subtitle={`We've sent password reset instructions to ${email}`}
            backHref="/auth/user/signin"
            backText="Back to Sign In"
          />

          <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
            <CardHeader className="text-center">
              <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-300">
                If you don't see the email, check your spam folder or try again with a different email address.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => setIsEmailSent(false)} 
                  variant="outline" 
                  className="w-full text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white bg-transparent"
                >
                  Try Different Email
                </Button>
                
                <Link href="/auth/user/signin" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <AuthHeader 
          title="Forgot Password?"
          subtitle="Enter your email to reset your password"
          backHref="/auth/user/signin"
          backText="Back to Sign In"
        />

        {/* Forgot Password Form */}
        <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-white">
              <KeyRound className="h-5 w-5 mr-2 text-blue-400" />
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-300">
              We'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center text-gray-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </Button>
            </form>

            <AuthLink 
              text="Remember your password?"
              linkText="Sign in"
              linkHref="/auth/user/signin"
            />
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>
            If you're having trouble, please contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
