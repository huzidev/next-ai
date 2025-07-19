import VerificationForm from "@/components/auth/VerificationForm";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserVerifyOTP() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get email from URL query params
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query]);

  const handleVerify = async (email: string, code: string) => {
    const response = await api.post('/api/auth/user/verify-reset-code', { 
      email, 
      code 
    });
    
    return {
      success: response.success,
      error: response.error
    };
  };

  const handleResend = async (email: string) => {
    const response = await api.post('/api/auth/user/forgot-password', { email }) as any;
    
    return {
      success: response.success,
      code: response.code,
      error: response.error
    };
  };

  return (
    <div>
      <VerificationForm
        title="Verify Your Code"
        subtitle="Enter the 6-digit code sent to"
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        successRedirectPath="/auth/user/forgot-password/reset"
        backLinkText="Sign in"
        backLinkHref="/auth/user/signin"
      />
    </div>
  );
}
