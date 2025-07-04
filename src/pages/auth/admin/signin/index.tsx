import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Crown, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
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
      // TODO: Implement actual admin signin API call
      // const response = await fetch('/api/auth/admin/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Welcome back, Admin!",
        description: "You have been signed in successfully",
      });

      // Redirect to admin dashboard
      router.push('/dashboard/admin');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-300 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next-AI
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-400">
              <Crown className="h-3 w-3 mr-1" />
              Admin Portal
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Admin Sign In</h1>
          <p className="text-slate-300">Access the administrative dashboard</p>
        </div>

        {/* Signin Form */}
        <Card className="shadow-2xl border-purple-800/50 bg-slate-800/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-white">
              <Shield className="h-5 w-5 mr-2 text-purple-400" />
              Admin Authentication
            </CardTitle>
            <CardDescription className="text-slate-300">
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center text-slate-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Admin Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center text-slate-200">
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Label>
                  <Link 
                    href="/auth/admin/forgot-password" 
                    className="text-sm text-purple-400 hover:text-purple-300 font-medium"
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
                    className="h-11 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In to Dashboard"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-300">Need admin access? </span>
              <Link href="/contact" className="text-purple-400 hover:text-purple-300 font-medium">
                Contact Super Admin
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400 mb-2">Other options</p>
          <div className="space-x-4 text-sm">
            <Link href="/auth/user/signin" className="text-purple-400 hover:text-purple-300">
              User Login
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/support" className="text-purple-400 hover:text-purple-300">
              Get Help
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-amber-400 mb-1">Security Notice</p>
              <p>Admin accounts have elevated privileges. Ensure you're on a secure network and never share your credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
