import AuthHeader from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
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

      // Redirect to dashboard
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
          title="Welcome Back"
          subtitle="Sign in to continue your AI journey"
          backHref="/"
          backText="Back to Home"
        />

        {/* Signin Form */}
        <Card className="shadow-2xl border border-gray-700 bg-gray-800/90 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-white">
              <LogIn className="h-5 w-5 mr-2 text-blue-400" />
              Sign In
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center text-gray-200">
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
                  className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center text-gray-200">
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Label>
                  <Link 
                    href="/auth/user/forgot-password" 
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-300">Don't have an account? </span>
              <Link href="/auth/user/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">Need help?</p>
          <div className="space-x-4 text-sm">
            <Link href="/support" className="text-blue-400 hover:text-blue-300 transition-colors">
              Contact Support
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/auth/admin/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
