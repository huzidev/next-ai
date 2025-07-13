import PasswordInput from "./PasswordInput";
import PasswordRequirements from "./PasswordRequirements";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordRequirements?: boolean;
  passwordsMatch?: boolean;
  required?: boolean;
  className?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
}

export default function PasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  showPasswordRequirements = true,
  passwordsMatch = true,
  className = "",
  passwordLabel = "Password",
  confirmPasswordLabel = "Confirm Password",
  passwordPlaceholder = "Create a password",
  confirmPasswordPlaceholder = "Confirm your password",
}: PasswordFieldsProps) {
  return (
    <div className={className}>
      <>
        <PasswordInput
          id="password"
          name="password"
          label={passwordLabel}
          placeholder={passwordPlaceholder}
          value={password}
          onChange={onPasswordChange}
        />
        
        {showPasswordRequirements && (
          <PasswordRequirements
            password={password}
            show={!!password}
          />
        )}
      </>

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label={confirmPasswordLabel}
        placeholder={confirmPasswordPlaceholder}
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        showMismatchError={!passwordsMatch && !!confirmPassword}
        className="mt-4"
      />
    </div>
  );
}
