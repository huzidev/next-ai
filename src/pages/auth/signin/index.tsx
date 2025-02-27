'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { post } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import * as ENDPOINTS from "@/api/auth/endpoints";
import { FormValues } from "@/types/auth/types";
import  * as ROUTES  from "@/routes/auth/route";

export default function Signin() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: FormValues) {
    console.log("SW data for signin user", data);
    const response = await post(ENDPOINTS.SIGNIN_USER, data);
    console.log("SW response on signin request", response);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-sm p-8 shadow-md rounded-lg border border-gray-600 bg-gray-900">
        <h1 className="text-2xl font-semibold mb-6 text-white">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </Label>
              <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
            Sign In
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account? {" "}
              <Link href={ROUTES.AUTH_SIGNUP} className="text-blue-400 hover:text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
