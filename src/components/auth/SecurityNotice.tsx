import { Shield } from "lucide-react";

interface SecurityNoticeProps {
  message: string;
}

export default function SecurityNotice({ message }: SecurityNoticeProps) {
  return (
    <div
      className={`mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700`}
    >
      <div className="flex items-start space-x-3">
        <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
        <div className="text-sm text-gray-300">
          <p className="font-medium text-amber-400 mb-1">Security Notice</p>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
