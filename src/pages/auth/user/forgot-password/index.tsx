import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import FormLayout from "@/components/auth/FormLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Mail } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
      const response = await api.post("/api/auth/user/forgot-password", {
        email,
      });

      if (response.success) {
        toast({
          title: "Verification Code Sent",
          description: `Your verification code is: ${response?.code}`,
        });
        // Redirect to OTP verification page
        router.push(
          `/auth/user/forgot-password/verify?email=${encodeURIComponent(email)}`
        );
      } else {
        toast({
          title: "Error",
          description: response.error || "Email not found in our records",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <AuthHeader
        title="Forgot Password?"
        subtitle="Enter your email to reset your password"
      />

      <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center text-gray-200"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Sending Code..." : "Send Verification Code"}
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
        <p>We'll send you a verification code to reset your password.</p>
      </div>
    </FormLayout>
  );
}
