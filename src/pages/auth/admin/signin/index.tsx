import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import SigninForm from "@/components/auth/SigninForm";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Crown, Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminSignin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      // Call admin signin API using the reusable api utility
      const response = await api.post('/api/auth/admin/signin', formData);

      if (response.success) {
        toast({
          title: "Welcome back, Admin!",
          description: response.message || "You have been signed in successfully",
        });

        // Redirect to admin dashboard
        router.push('/dashboard/admin');
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to sign in. Please check your credentials.",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthHeader 
            title="Admin Sign In"
            subtitle="Access the administrative dashboard"
          />
        
        <div className="flex items-center justify-center mb-6">
          <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-400">
            <Crown className="h-3 w-3 mr-1" />
            Admin Portal
          </Badge>
        </div>

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
            { href: "/support", text: "Get Help" }
          ]}
        />

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-amber-400 mb-1">Security Notice</p>
              <p>Admin accounts have elevated privileges. Ensure you're on a secure network and never share your credentials.</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
