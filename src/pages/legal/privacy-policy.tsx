import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { privacyPolicyContent } from "@/data/legal/privacy-content";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      sections={privacyPolicyContent}
      icon={<Shield className="h-8 w-8 text-green-400" />}
    />
  );
}
