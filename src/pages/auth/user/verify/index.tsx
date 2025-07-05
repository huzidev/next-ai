import AuthHeader from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Mail, RotateCcw, Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function UserVerify() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Get email from query params
  const email = router.query.email as string;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/user/verify', { 
        email,
        code: verificationCode 
      });

      if (response.success) {
        toast({
          title: "Account Verified!",
          description: "Your account has been successfully verified",
        });

        // Redirect to signin or dashboard
        router.push('/auth/user/signin');
      } else {
        toast({
          title: "Error",
          description: response.error || "Invalid verification code. Please try again.",
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
    setIsResending(true);

    try {
      const response = await api.post('/api/auth/user/resend-verification', { email });

      if (response.success) {
        toast({
          title: "Code Sent",
          description: "A new verification code has been sent to your email",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to resend code. Please try again.",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <AuthHeader 
          title="Verify Your Email"
          subtitle={email ? `Enter the 6-digit code sent to ${email}` : "Enter the 6-digit code sent to your email"}
          backHref="/auth/user/signup"
          backText="Back to Sign Up"
        />

        {/* Verification Form */}
        <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-white">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              Email Verification
            </CardTitle>
            <CardDescription className="text-gray-300">
              {email ? `We've sent a verification code to ${email}` : "We've sent a verification code to your email address"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code Input */}
              <div className="space-y-2">
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400"
                        placeholder="0"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Account"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-300">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-400 hover:text-blue-300 border-gray-600 hover:bg-gray-700 bg-transparent"
              >
                {isResending ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>
            The verification code will expire in 10 minutes.
          </p>
          <p className="mt-2">
            Make sure to check your spam folder if you don't see the email.
          </p>
        </div>
      </div>
    </div>
  );
}
