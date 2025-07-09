import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthHeader from "./AuthHeader";
import AuthLink from "./AuthLink";
import OTPInput from "./OTPInput";

interface VerificationFormProps {
  title: string;
  subtitle: string;
  email: string;
  onVerify: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  onResend: (email: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  successRedirectPath: string;
  backLinkText: string;
  backLinkHref: string;
  variant?: "default" | "purple";
  badge?: React.ReactNode;
}

export default function VerificationForm({
  title,
  subtitle,
  email,
  onVerify,
  onResend,
  successRedirectPath,
  backLinkText,
  backLinkHref,
  variant = "default",
  badge
}: VerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
      const response = await onVerify(email, otp);

      if (response.success) {
        toast({
          title: "Code Verified",
          description: "You can now proceed to the next step",
        });
        // Redirect to success page
        router.push(`${successRedirectPath}?email=${encodeURIComponent(email)}`);
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
      const response = await onResend(email);

      if (response.success) {
        toast({
          title: "New Code Sent",
          description: response.code ? `Your new verification code is: ${response.code}` : "A new verification code has been sent to your email",
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

  const buttonClass = variant === "purple" 
    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600";

  const resendButtonClass = variant === "purple"
    ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
    : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader 
            title={title}
            subtitle={subtitle}
          />
          
          {badge && (
            <div className="flex items-center justify-center mb-6">
              {badge}
            </div>
          )}

          <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center text-gray-200">
                    <Shield className="h-4 w-4 mr-2" />
                    Verification Code
                  </label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                    className="mb-4"
                  />
                  {email && (
                    <p className="text-sm text-gray-400 text-center">
                      Code sent to: <span className={variant === "purple" ? "text-purple-300" : "text-blue-300"}>{email}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full h-11 ${buttonClass} text-white font-medium transition-all duration-200`}
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
                  className={resendButtonClass}
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>

              <AuthLink 
                text="Remember your password?"
                linkText={backLinkText}
                linkHref={backLinkHref}
                variant={variant === "purple" ? "purple" : "blue"}
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
