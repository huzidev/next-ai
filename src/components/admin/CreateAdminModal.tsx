import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { AlertCircle, Eye, EyeOff, Shield, User } from "lucide-react";
import { useState } from "react";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentAdminRole?: 'ADMIN' | 'SUPER_ADMIN';
}

export function CreateAdminModal({ isOpen, onClose, onSuccess, currentAdminRole }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN' as 'ADMIN' | 'SUPER_ADMIN'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation (only super admins can create other admins)
    if (currentAdminRole !== 'SUPER_ADMIN') {
      newErrors.role = 'Only Super Admins can create new administrators';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/api/admin/create-admin', {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      });

      if (response.success) {
        toast({
          title: "Admin Created Successfully",
          description: `${formData.role.replace('_', ' ')} ${formData.username} has been created`,
        });
        
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'ADMIN'
        });
        setErrors({});
        
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Failed to Create Admin",
          description: response.error || "An error occurred while creating the admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'ADMIN'
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-400" />
            Create New Administrator
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new admin account. Only Super Admins can perform this action.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-200">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-200">Admin Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'ADMIN' | 'SUPER_ADMIN') => handleInputChange('role', value)}
              disabled={isLoading || currentAdminRole !== 'SUPER_ADMIN'}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select admin role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="ADMIN" className="text-white">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </div>
                </SelectItem>
                <SelectItem value="SUPER_ADMIN" className="text-white">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Super Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || currentAdminRole !== 'SUPER_ADMIN'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
