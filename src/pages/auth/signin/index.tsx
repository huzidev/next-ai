'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { post } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = {
  email: string;
  password: string;
};

const SIGNIN_USER_URL = '/api/auth/user/signin';

export default function Signin() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function onSubmit(data: FormValues) {
    console.log(data);
    console.log("SW data for signin", data);
    const response = await post(SIGNIN_USER_URL, data);
    console.log("SW response on signin request", response);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-6">Sign In</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {errors.email && (
              <p className="text-red-500 text-xs">
                {errors.email.message}
              </p>
            // <Text className="text-red-500 text-xs">{errors.email.message}</Text>
            )}

          </div>

          <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
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
            {errors.password && (
              <p className="text-red-500 text-xs">
                {errors.password.message}
              </p>
            // <Text className="text-red-500 text-xs">
            //     {errors.password.message}
            //     </Text>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full mb-4">
            Sign In
          </Button>
          
          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
            {/* <Text className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </Text> */}
          </div>
        </form>
      </div>
    </div>
  );
};
