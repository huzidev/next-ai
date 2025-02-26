import { useRouter } from "next/router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Verify() {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = useState(Array(6).fill(""));

  function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      if (index < otp.length - 1 && value) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    } else if (!value) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });

      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 shadow-md rounded-lg bg-gray-900">
        <h1 className="text-2xl font-semibold mb-6 text-white">Verify Your Email</h1>
        <form>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-2 p-3 border border-gray-600 rounded w-full bg-gray-800 text-white opacity-70" // Added opacity for un-editable look
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="otp" className="block text-sm font-medium text-gray-300">
              Enter Verification Code
            </Label>
            <div className="flex space-x-2 mt-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-12 h-12 text-center bg-gray-800 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md">
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}
