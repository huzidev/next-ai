import AuthHeader from "@/components/auth/AuthHeader";
import AuthLink from "@/components/auth/AuthLink";
import FormLayout from "@/components/auth/FormLayout";
import PasswordFields from "@/components/auth/PasswordFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { isPasswordValid } from "@/utils/passwordValidation";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function UserSignup() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, fieldType: 'password' | 'confirmPassword') => {
    const newFormData = {
      ...formData,
      [fieldType]: e.target.value,
    };
    setFormData(newFormData);
    
    if (fieldType === 'password') {
      setPasswordsMatch(
        e.target.value === formData.confirmPassword
      );
    } else {
      setPasswordsMatch(e.target.value === formData.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

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
      const response = await api.post("/api/auth/user/signup", formData);

      if (response.success) {
        toast({
          title: "Account Created!",
          description: "Please check your email for verification code",
        });

        // Redirect to verification page with email
        router.push(
          `/auth/user/verify?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        toast({
          title: "Error",
          description:
            response.error || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <AuthHeader
        title="Create Your Account"
        subtitle="Join thousands of users exploring"
      />

      <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium flex items-center text-gray-200"
              >
                <User className="h-4 w-4 mr-2" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <PasswordFields
              password={formData.password}
              confirmPassword={formData.confirmPassword}
              onPasswordChange={(e) => handlePasswordChange(e, 'password')}
              onConfirmPasswordChange={(e) => handlePasswordChange(e, 'confirmPassword')}
              passwordsMatch={passwordsMatch}
              required={true}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
              disabled={isLoading || !passwordsMatch || !isPasswordValid(formData.password)}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <AuthLink
            text="Already have an account?"
            linkText="Sign in"
            linkHref="/auth/user/signin"
          />
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-xs text-gray-400">
        By creating an account, you agree to our{" "}
        <Link
          href="/legal/terms-of-service"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy-policy"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </FormLayout>
  );
}
