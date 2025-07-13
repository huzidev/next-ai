import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function OTPInput({ 
  value, 
  onChange, 
  disabled = false,
  className = ""
}: OTPInputProps) {
  const length: number = 6; // Default OTP length
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update local state when value prop changes
  useEffect(() => {
    if (value.length <= length) {
      const newOtp = value.split("").concat(new Array(length - value.length).fill(""));
      setOtp(newOtp);
    }
  }, [value, length]);

  // Focus management
  const focusNext = (index: number) => {
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, digit: string) => {
    // Only allow single digits
    if (digit.length > 1) {
      digit = digit.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(digit)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Update parent component
    const otpString = newOtp.join("");
    onChange(otpString);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      focusNext(index);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        focusPrev(index);
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      focusPrev(index);
    }
    else if (e.key === "ArrowRight" && index < length - 1) {
      focusNext(index);
    }
    // Handle paste
    else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);
    
    if (digits.length > 0) {
      const newOtp = digits.split("").concat(new Array(Math.max(0, length - digits.length)).fill(""));
      setOtp(newOtp);
      onChange(digits);
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focused
    inputRefs.current[index]?.select();
  };

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {otp.map((digit, index) => (
      <Input
        key={index}
        ref={(el) => {
        inputRefs.current[index] = el;
        }}
        type="text"
        inputMode="numeric"
        pattern="\d*"
        maxLength={1}
        value={digit}
        onChange={(e) => handleChange(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onPaste={handlePaste}
        onFocus={() => handleFocus(index)}
        disabled={disabled}
        className="!h-12 text-center !text-lg font-bold bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400 transition-colors"
      />
      ))}
    </div>
  );
}
