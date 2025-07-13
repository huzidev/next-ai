import VerificationForm from "@/components/auth/VerificationForm";
import { api } from "@/lib/api";
import { useRouter } from "next/router";

export default function UserVerify() {
  const router = useRouter();
  const email = router.query.email as string;

  const handleVerify = async (email: string, code: string) => {
    const response = await api.post("/api/auth/user/verify", {
      email,
      code,
    });
    return response;
  };

  const handleResend = async (email: string) => {
    const response = await api.post("/api/auth/user/resend-verification", {
      email,
    });
    return response;
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Request</h1>
          <p className="text-gray-400 mb-6">No email address provided for verification.</p>
          <button
            onClick={() => router.push("/auth/user/signup")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-md transition-all duration-200"
          >
            Go to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <VerificationForm
      title="Verify Your Email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      email={email}
      onVerify={handleVerify}
      onResend={handleResend}
      successRedirectPath="/auth/user/signin"
      backLinkText="Back to Sign In"
      backLinkHref="/auth/user/signin"
      variant="default"
      type="verification"
    />
  );
}
