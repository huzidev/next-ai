import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

interface RequirementItemProps {
  isValid: boolean;
  text: string;
}

function RequirementItem({ isValid, text }: RequirementItemProps) {
  return (
    <div
      className={`password-requirement-item ${
        isValid ? "password-requirement-valid" : "password-requirement-invalid"
      }`}
    >
      {isValid ? (
        <Check className="password-requirement-icon" />
      ) : (
        <X className="password-requirement-icon" />
      )}
      {text}
    </div>
  );
}

export default function PasswordRequirements({
  password,
  show,
}: PasswordRequirementsProps) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  return (
    <div
      className={`password-requirements-container ${
        show ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="password-requirements-list">
        <RequirementItem
          isValid={requirements.length}
          text="At least 8 characters"
        />
        <RequirementItem
          isValid={requirements.uppercase}
          text="One uppercase letter"
        />
        <RequirementItem isValid={requirements.number} text="One number" />
        <RequirementItem
          isValid={requirements.special}
          text="One special character"
        />
      </div>
    </div>
  );
}
