import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { post } from "@/services/api";
import { Eye, EyeOff } from "lucide-react";
import { FormValues, PasswordState } from "@/types/auth/types";
import * as ENDPOINTS from "@/api/auth/user/endpoints";
import  * as ROUTES  from "@/routes/auth/user/route";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState<PasswordState>({
    password: false,
    confirmPassword: false,
  });
  const router = useRouter();

  async function onSubmit(data: FormValues) {
    console.log("Signup data:", data);
    const response = await post(ENDPOINTS.SIGNUP, data);

    console.log("SW what is response on register", response);

    if (response) {
      router.push(`/auth/verify?email=${encodeURIComponent(response?.email)}`);
    }
    console.log("Signup response:", response);
  }

  function toggleShowPassword(field: keyof PasswordState) {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 shadow-md rounded-lg border border-gray-600 bg-gray-900">
        <h1 className="text-2xl font-semibold mb-6 text-white">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username.message}</p>
            )}
          </div>

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

          <div className="mb-4">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword.password ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                onClick={() => toggleShowPassword("password")}
              >
                {showPassword.password ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-6">
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                onClick={() => toggleShowPassword("confirmPassword")}
              >
                {showPassword.confirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Sign Up
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
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
