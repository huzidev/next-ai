import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function TermsOfService() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <Card className="bg-gray-800/90 backdrop-blur border-gray-700">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to Next-AI! These Terms of Service ("Terms") govern your use of the Next-AI platform 
                and services provided by Huzaifa Iqbal ("we," "us," or "our"). By accessing or using our service, 
                you agree to be bound by these Terms.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* About the Developer */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. About Next-AI</h2>
              <div className="bg-gray-700/50 p-6 rounded-lg mb-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Next-AI is developed and maintained by <strong className="text-blue-400">Huzaifa Iqbal</strong>, 
                  a 23-year-old Full-Stack Engineer with 2+ years of experience, based in Karachi, Pakistan.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link
                    href="https://github.com/huzidev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  
                  <Link
                    href="https://www.linkedin.com/in/huzidev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  
                  <Link
                    href="https://x.com/huzideviq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    X (Twitter)
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Next-AI is built with modern technologies including TypeScript, NextJS, NodeJS, Prisma, and PostgreSQL, 
                focusing on clean, scalable code and exceptional user experience.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By creating an account or using Next-AI, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms. If you do not agree with these Terms, please do not use our service.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. User Accounts</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>One person may not maintain multiple accounts</li>
              </ul>
            </section>

            <Separator className="bg-gray-600" />

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Transmit any malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use the service to spam, harass, or harm others</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <Separator className="bg-gray-600" />

            {/* AI Service Usage */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. AI Service Usage</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>AI responses are generated automatically and may not always be accurate</li>
                <li>You should verify important information independently</li>
                <li>Do not share sensitive personal information in AI conversations</li>
                <li>Respect usage limits and rate limiting measures</li>
                <li>Content generated using our AI services is subject to our content policy</li>
              </ul>
            </section>

            <Separator className="bg-gray-600" />

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                The Next-AI platform, including its design, code, and features, is the intellectual property of 
                Huzaifa Iqbal. You may not copy, modify, distribute, or create derivative works without explicit permission.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                Next-AI is provided "as is" without warranties of any kind. We shall not be liable for any 
                indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to terminate or suspend your account at any time for violations of these Terms. 
                You may also terminate your account at any time by contacting us.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update these Terms from time to time. We will notify users of significant changes 
                via email or through the platform. Continued use of the service constitutes acceptance of updated Terms.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Developer:</strong> Huzaifa Iqbal<br />
                  <strong>Location:</strong> Karachi, Pakistan<br />
                  <strong>GitHub:</strong> <Link href="https://github.com/huzidev" target="_blank" className="text-blue-400 hover:text-blue-300">@huzidev</Link><br />
                  <strong>LinkedIn:</strong> <Link href="https://www.linkedin.com/in/huzidev/" target="_blank" className="text-blue-400 hover:text-blue-300">huzidev</Link><br />
                  <strong>X (Twitter):</strong> <Link href="https://x.com/huzideviq" target="_blank" className="text-blue-400 hover:text-blue-300">@huzideviq</Link>
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
