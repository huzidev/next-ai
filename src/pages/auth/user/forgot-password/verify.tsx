import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await api.post('/api/auth/user/verify-reset-code', { 
        email, 
        code: otp 
      });

      if (response.success) {
        toast({
          title: "Code Verified",
          description: "Redirecting to reset password...",
        });
        // Redirect to password reset page
        router.push(`/auth/user/forgot-password/reset?email=${encodeURIComponent(email)}`);
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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/user/forgot-password', { email });
      if (response.success) {
        toast({
          title: "Code Resent",
          description: `New verification code: ${response.code}`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend code",
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
            title="Enter Verification Code"
            subtitle={`We sent a 6-digit code to ${email}`}
          />

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
                  onChange={handleOtpChange}
                  required
                  maxLength={6}
                  className="auth-input text-center text-lg tracking-widest"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
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
                type="button"
                variant="ghost"
                onClick={resendCode}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-300 hover:bg-transparent p-0 h-auto font-normal"
              >
                Resend Code
              </Button>
            </div>

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
            The verification code will expire in 10 minutes.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
