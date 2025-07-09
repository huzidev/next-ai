import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import * as ROUTES from "@/routes/auth/admin/route";
import { Crown, Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminVerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Get email from URL query params
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/admin/verify-reset-code', { 
        email, 
        code: otp 
      });

      if (response.success) {
        toast({
          title: "Code Verified",
          description: "You can now reset your password",
        });
        // Redirect to password reset page
        router.push(`/auth/admin/forgot-password/reset?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          title: "Invalid Code",
          description: response.error || "The verification code is incorrect or expired",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      const response = await api.post('/api/auth/admin/forgot-password', { email });

      if (response.success) {
        toast({
          title: "New Code Sent",
          description: `Your new verification code is: ${response.code}`,
        });
        setOtp(""); // Clear the input
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to resend code",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Auto-format OTP input (only allow numbers, max 6 digits)
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader 
            title="Verify Admin Code"
            subtitle="Enter the 6-digit code sent to your email"
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
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium flex items-center text-gray-200">
                    <Shield className="h-4 w-4 mr-2" />
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={handleOTPChange}
                    maxLength={6}
                    className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400 text-center text-lg tracking-widest"
                    required
                  />
                  {email && (
                    <p className="text-sm text-gray-400">
                      Code sent to: <span className="text-purple-300">{email}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={isResending || !email}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>

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
              The verification code will expire in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
