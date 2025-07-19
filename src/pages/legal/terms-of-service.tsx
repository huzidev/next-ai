import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { termsOfServiceContent } from "@/data/legal/terms-content";

export default function TermsOfService() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      sections={termsOfServiceContent}
    />
  );
}
