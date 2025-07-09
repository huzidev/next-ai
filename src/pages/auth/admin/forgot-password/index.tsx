import AuthFooter from "@/components/auth/AuthFooter";
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
import { Crown, Mail, Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your admin email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/admin/forgot-password', { email });

      if (response.success) {
        toast({
          title: "Verification Code Sent",
          description: `Your verification code is: ${response.code}`,
        });
        // Redirect to OTP verification page
        router.push(`/auth/admin/forgot-password/verify?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          title: "Error",
          description: response.error || "Admin email not found in our records",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <AuthHeader 
            title="Admin Password Reset"
            subtitle="Enter your admin email to reset your password"
          />
        
        <div className="flex items-center justify-center mb-6">
          <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-400">
            <Crown className="h-3 w-3 mr-1" />
            Admin Portal
          </Badge>
        </div>

        <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center text-gray-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Admin Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Sending Code..." : "Send Verification Code"}
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

        <AuthFooter 
          helpText="Other options"
          links={[
            { href: "/auth/user/signin", text: "User Login" },
            { href: "/support", text: "Contact Support" }
          ]}
        />

        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-amber-400 mb-1">Security Notice</p>
              <p>Only valid admin email addresses will receive verification codes.</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
