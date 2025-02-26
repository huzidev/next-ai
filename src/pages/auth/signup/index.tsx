import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

const SIGNUP_USER_URL = "/api/auth/user/signup";

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
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>

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
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

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
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

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
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full mb-4">
            Sign Up
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
