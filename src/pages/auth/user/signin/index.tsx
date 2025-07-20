import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import FormLayout from "@/components/auth/FormLayout";
import SigninForm from "@/components/auth/SigninForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
}

export default function UserSignin() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call signin API using the reusable api utility
      const response = await api.post("/api/auth/user/signin", formData);

      console.log("SW response on verifycation page", response);
      console.log("SW response.data:", response.data);
      console.log("SW response.data.data:", response.data?.data);
      console.log("SW response.data.data.user:", response.data?.data?.user);
      console.log("SW response.data.data.token:", response.data?.data?.token);

      if (response.success) {
        console.log('Signin success, token:', response.data.data.token?.substring(0, 20) + '...');
        console.log('Signin success, user data:', response.data.data.user);
        // Update authentication state
        login(response.data.data.user, response.data.data.token);
        
        toast({
          title: "Welcome",
          description:
            response.message || "You have been signed in successfully",
        });

        // RouteGuard will handle the redirect to dashboard
      } else {
        // Check if the error is due to unverified account
        if (response.needsVerification) {
          router.push(`/auth/user/verify?email=${encodeURIComponent(response.email || formData.email)}`);

          toast({
            title: "Account Not Verified",
            description: "Please verify your account to continue.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Error",
          description:
            response.error ||
            "Failed to sign in. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout>
      <AuthHeader title="Sign In" subtitle="Access your AI-powered workspace" />

      <SigninForm
        formData={formData}
        isLoading={isLoading}
        showPassword={showPassword}
        onFormDataChange={handleChange}
        onSubmit={handleSubmit}
        onTogglePassword={() => setShowPassword(!showPassword)}
        variant="user"
      />

      <AuthFooter
        helpText="Need help?"
        links={[
          { href: "/support", text: "Contact Support" },
          { href: "/auth/admin/signin", text: "Admin Login" },
        ]}
      />
    </FormLayout>
  );
}
