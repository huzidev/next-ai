import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import SigninForm from "@/components/auth/SigninForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserSignin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      // TODO: Implement actual signin API call
      // const response = await fetch('/api/auth/user/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });

      router.push('/dashboard/user');
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <AuthHeader 
          title="Sign In"
          subtitle="Access your AI-powered workspace"
          backHref="/"
          backText="Back to Home"
        />

        <SigninForm
          formData={formData}
          isLoading={isLoading}
          showPassword={showPassword}
          onFormDataChange={handleChange}
          onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword(!showPassword)}
          variant="user"
        />

        {/* Additional Options */}
        <AuthFooter />
      </div>
    </div>
  );
}
