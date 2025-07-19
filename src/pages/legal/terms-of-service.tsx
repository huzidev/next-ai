import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { termsOfServiceContent } from "@/data/legal/terms-content";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      sections={termsOfServiceContent}
      icon={<FileText className="h-8 w-8 text-blue-400" />}
    />
  );
}
