import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { privacyPolicyContent } from "@/data/legal/privacy-content";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      sections={privacyPolicyContent}
    />
  );
}
