import { useState } from "react";
import { Button, Input, Label, Text } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { postRequest } from "@/services/api";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SIGNUP_USER_URL = "/api/auth/signup";

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function onSubmit(data: FormValues) {
    console.log("Signup data:", data);
    const response = await postRequest(SIGNUP_USER_URL, data);
    console.log("Signup response:", response);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-4">
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="mt-2 p-3 border rounded w-full"
            />
            {errors.username && <Text className="text-red-500 text-xs">{errors.username.message}</Text>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="mt-2 p-3 border rounded w-full"
            />
            {errors.email && <Text className="text-red-500 text-xs">{errors.email.message}</Text>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className="mt-2 p-3 border rounded w-full"
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M17 7l-1.41-1.41L12 9.17 8.41 5.59 7 7l4.59 4.59L7 16l1.41 1.41L12 14.83l3.59 3.59L17 16l-4.59-4.59z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 5C7 5 3 7.5 3 10c0 1.5 1.5 3 4 3 1.5 0 3-1.5 3-3s1.5-3 3-3 3 1.5 3 3c0 1.5 1.5 3 4 3 0-2.5-4-5-8-5z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <Text className="text-red-500 text-xs">{errors.password.message}</Text>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: value => value === watch("password") || "Passwords do not match",
              })}
              className="mt-2 p-3 border rounded w-full"
            />
            {errors.confirmPassword && <Text className="text-red-500 text-xs">{errors.confirmPassword.message}</Text>}
          </div>

          <Button type="submit" variant="primary" className="w-full mb-4">
            Sign Up
          </Button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Text className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </Text>
          </div>
        </form>
      </div>
    </div>
  );
}
