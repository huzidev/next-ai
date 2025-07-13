import AuthHeader from "@/components/auth/AuthHeader";
import FormLayout from "@/components/auth/FormLayout";
import OTPInput from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserVerify() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const email = router.query.email as string;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

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
      const response = await api.post("/api/auth/user/verify", {
        email,
        code: otp,
      });

      if (response.success) {
        toast({
          title: "Account Verified!",
          description: "Your account has been successfully verified",
        });

        router.push("/auth/user/signin");
      } else {
        toast({
          title: "Error",
          description:
            response.error || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendTimer > 0) return;

    setIsResending(true);
    setResendTimer(10); // Start 10 second timer

    try {
      const response = await api.post("/api/auth/user/resend-verification", {
        email,
      });

      if (response.success) {
        toast({
          title: "New Code Sent",
          description: "A new verification code has been sent to your email",
        });
        setOtp(""); // Clear the input
      } else {
        toast({
          title: "Error",
          description:
            response.error || "Failed to resend code. Please try again.",
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

  return (
    <FormLayout>
      <AuthHeader
        title="Verify Your Email"
        subtitle={
          email
            ? `Enter the 6-digit code sent to ${email}`
            : "Enter the 6-digit code sent to your email"
        }
      />

      <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">

        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
                className="justify-center"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-200"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-400 inline">
              Haven't received the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending || resendTimer > 0 || !email}
                className={`text-sm font-medium transition-colors ${
                  resendTimer > 0 || isResending
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-green-400"
                }`}
              >
                {isResending 
                  ? "Sending..." 
                  : resendTimer > 0 
                    ? `Resend Code (${resendTimer}s)` 
                    : "Resend Code"
                }
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-xs text-gray-400">
        <p>The verification code will expire in 10 minutes.</p>
        <p className="mt-2">
          Make sure to check your spam folder if you don't see the email.
        </p>
      </div>
    </FormLayout>
  );
}
