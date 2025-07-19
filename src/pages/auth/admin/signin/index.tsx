import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import FormLayout from "@/components/auth/FormLayout";
import SecurityNotice from "@/components/auth/SecurityNotice";
import SigninForm from "@/components/auth/SigninForm";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminSignin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
      // Call admin signin API using the reusable api utility
      const response = await api.post("/api/auth/admin/signin", formData);

      if (response.success) {
        const adminName = response.data?.username || response.data?.name || "Admin";
        toast({
          title: `Welcome back, ${adminName}!`,
          description:
            response.message || "You have been signed in successfully",
        });

        // Redirect to admin dashboard
        router.push("/dashboard/admin");
      } else {
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
      <AuthHeader
        title="Admin Sign In"
        subtitle="Access the administrative dashboard"
      />

      <SigninForm
        formData={formData}
        isLoading={isLoading}
        showPassword={showPassword}
        onFormDataChange={handleChange}
        onSubmit={handleSubmit}
        onTogglePassword={() => setShowPassword(!showPassword)}
        variant="admin"
      />

      <AuthFooter
        helpText="Other options"
        links={[
          { href: "/auth/user/signin", text: "User Login" },
          { href: "/support", text: "Get Help" },
        ]}
      />

      <SecurityNotice />
    </FormLayout>
  );
}
