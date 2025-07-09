import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

export default function PasswordRequirements({ password, show }: PasswordRequirementsProps) {
  // Password requirements validation
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  return (
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
      show ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="space-y-1 mt-2">
        <div className={`flex items-center text-xs transition-colors duration-200 ${
          requirements.length ? 'text-green-400' : 'text-gray-400'
        }`}>
          <div className="transition-transform duration-200">
            {requirements.length ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
          </div>
          At least 8 characters
        </div>
        <div className={`flex items-center text-xs transition-colors duration-200 ${
          requirements.uppercase ? 'text-green-400' : 'text-gray-400'
        }`}>
          <div className="transition-transform duration-200">
            {requirements.uppercase ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
          </div>
          One uppercase letter
        </div>
        <div className={`flex items-center text-xs transition-colors duration-200 ${
          requirements.number ? 'text-green-400' : 'text-gray-400'
        }`}>
          <div className="transition-transform duration-200">
            {requirements.number ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
          </div>
          One number
        </div>
        <div className={`flex items-center text-xs transition-colors duration-200 ${
          requirements.special ? 'text-green-400' : 'text-gray-400'
        }`}>
          <div className="transition-transform duration-200">
            {requirements.special ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
          </div>
          One special character
        </div>
      </div>
    </div>
  );
}
