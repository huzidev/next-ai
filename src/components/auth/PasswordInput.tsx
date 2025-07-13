import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  showMismatchError?: boolean;
  mismatchErrorMessage?: string;
  className?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  showMismatchError = false,
  mismatchErrorMessage = "Passwords do not match",
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={id}
        className="text-sm font-medium flex items-center text-gray-200"
      >
        <Lock className="h-4 w-4 mr-2" />
        {label}
      </Label>
      <div className="password-input-container">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="password-input-field"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="password-toggle-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Password mismatch error */}
      <div
        className={`password-mismatch-container ${
          showMismatchError
            ? "max-h-6 opacity-100 mt-1"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="password-mismatch-message">
          <X className="password-mismatch-icon" />
          {mismatchErrorMessage}
        </div>
      </div>
    </div>
  );
}
