import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import FormLayout from "@/components/auth/FormLayout";
import PasswordFields from "@/components/auth/PasswordFields";
import SecurityNotice from "@/components/auth/SecurityNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import * as ROUTES from "@/routes/auth/admin/route";
import { isPasswordValid } from "@/utils/passwordValidation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Get email from URL query params
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query]);

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldType: "password" | "confirmPassword"
  ) => {
    const newFormData = {
      ...formData,
      [fieldType]: e.target.value,
    };
    setFormData(newFormData);

    // Check if passwords match based on field type
    if (fieldType === "password") {
      setPasswordsMatch(
        e.target.value === formData.confirmPassword ||
          formData.confirmPassword === ""
      );
    } else {
      setPasswordsMatch(e.target.value === formData.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    // Check if all password requirements are met
    if (!isPasswordValid(formData.password)) {
      toast({
        title: "Password Requirements",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/admin/reset-password", {
        email,
        password: formData.password,
      });

      if (response.success) {
        toast({
          title: "Password Reset Successfully",
          description: "You can now sign in with your new password",
        });
        // Redirect to admin sign in page
        router.push(ROUTES.SIGNIN);
      } else {
        toast({
          title: "Error",
          description:
            response.error || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <AuthHeader
        title="Reset Admin Password"
        subtitle={
          <>
            Create a new secure password for your account {" "}
            <span className="text-blue-300 font-medium">{email}</span>
          </>
        }
      />

      <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <PasswordFields
              password={formData.password}
              confirmPassword={formData.confirmPassword}
              onPasswordChange={(e) => handlePasswordChange(e, "password")}
              onConfirmPasswordChange={(e) =>
                handlePasswordChange(e, "confirmPassword")
              }
              passwordsMatch={passwordsMatch}
              required={true}
              passwordLabel="New Password"
              confirmPasswordLabel="Confirm New Password"
              passwordPlaceholder="Enter your new password"
              confirmPasswordPlaceholder="Confirm your new password"
            />

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200"
              disabled={
                isLoading ||
                !passwordsMatch ||
                !isPasswordValid(formData.password)
              }
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
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

      <div className="mt-6 text-center text-xs text-gray-400">
        <p>Your new password will be used for all future admin logins.</p>
      </div>
      <SecurityNotice />
    </FormLayout>
  );
}
