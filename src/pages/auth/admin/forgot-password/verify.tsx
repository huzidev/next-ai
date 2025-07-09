import VerificationForm from "@/components/auth/VerificationForm";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Crown } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminVerifyOTP() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get email from URL query params
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query]);

  const handleVerify = async (email: string, code: string) => {
    const response = await api.post('/api/auth/admin/verify-reset-code', { 
      email, 
      code 
    });
    
    return {
      success: response.success,
      error: response.error
    };
  };

  const handleResend = async (email: string) => {
    const response = await api.post('/api/auth/admin/forgot-password', { email }) as any;
    
    return {
      success: response.success,
      code: response.code,
      error: response.error
    };
  };

  const adminBadge = (
    <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-400">
      <Crown className="h-3 w-3 mr-1" />
      Admin Portal
    </Badge>
  );

  return (
    <div>
      <Header />
      <VerificationForm
        title="Verify Admin Code"
        subtitle="Enter the 6-digit code sent to your email"
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        successRedirectPath="/auth/admin/forgot-password/reset"
        backLinkText="Sign In"
        backLinkHref="/auth/admin/signin"
        variant="purple"
        badge={adminBadge}
      />
    </div>
  );
}
