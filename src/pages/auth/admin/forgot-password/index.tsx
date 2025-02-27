import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { post } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as ENDPOINTS from "@/api/auth/admin/endpoints";
import { FormValues } from "@/types/auth/types";
import * as ROUTES from "@/routes/auth/admin/route";

export default function index() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();

  async function onSubmit(data: FormValues) {
    console.log("SW data for signin user", data);
    const response = await post(ENDPOINTS.FORGOT_PASSWORD, data);
    console.log("SW response on signin request", response);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-sm p-8 shadow-md rounded-lg border border-gray-600 bg-gray-900">
        <h1 className="text-2xl font-semibold mb-6 text-white">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Reset Password
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <Link
                href={ROUTES.SIGNIN}
                className="text-blue-400 hover:text-blue-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
