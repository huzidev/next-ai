import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-gray-400 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <Card className="bg-gray-800/90 backdrop-blur border-gray-700">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                1. Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                At Next-AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                and protect your personal information when you use our AI-powered platform. By using Next-AI, 
                you consent to the practices described in this policy.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* About the Developer & Commitment */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Our Commitment to Privacy</h2>
              <div className="bg-gray-700/50 p-6 rounded-lg mb-4">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Next-AI is developed by <strong className="text-blue-400">Huzaifa Iqbal</strong>, a Full-Stack Engineer 
                  who prioritizes building scalable systems with clean, readable code and exceptional user experience. 
                  Privacy and security are fundamental principles in our development approach.
                </p>
                
                <div className="flex flex-wrap gap-4">
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
            </section>

            <Separator className="bg-gray-600" />

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                3. Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Personal Information</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside ml-4">
                    <li>Username and email address (for account creation)</li>
                    <li>Password (encrypted and securely stored)</li>
                    <li>Profile information you choose to provide</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Usage Data</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside ml-4">
                    <li>AI conversation history and interactions</li>
                    <li>Platform usage patterns and preferences</li>
                    <li>Technical information (IP address, browser type, device info)</li>
                    <li>Login times and session duration</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Automatically Collected Data</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside ml-4">
                    <li>Cookies and similar tracking technologies</li>
                    <li>Error logs and performance metrics</li>
                    <li>Feature usage analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-gray-600" />

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Service Provision</h3>
                  <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                    <li>Provide AI-powered features and responses</li>
                    <li>Maintain and improve user accounts</li>
                    <li>Process authentication and authorization</li>
                    <li>Enable platform functionality</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Platform Improvement</h3>
                  <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                    <li>Analyze usage patterns and trends</li>
                    <li>Fix bugs and enhance performance</li>
                    <li>Develop new features and capabilities</li>
                    <li>Improve AI model responses</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Communication</h3>
                  <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                    <li>Send verification emails</li>
                    <li>Notify about important updates</li>
                    <li>Respond to support requests</li>
                    <li>Share platform announcements</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Security & Legal</h3>
                  <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                    <li>Prevent fraud and abuse</li>
                    <li>Ensure platform security</li>
                    <li>Comply with legal obligations</li>
                    <li>Protect user rights and safety</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-gray-600" />

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                5. How We Protect Your Data
              </h2>
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="text-gray-300 space-y-2 list-disc list-inside">
                  <li><strong>Encryption:</strong> All passwords are encrypted using secure hashing algorithms</li>
                  <li><strong>Secure Storage:</strong> Data is stored in secure databases with access controls</li>
                  <li><strong>HTTPS:</strong> All communications are encrypted in transit</li>
                  <li><strong>Access Control:</strong> Limited access to personal data on a need-to-know basis</li>
                  <li><strong>Regular Updates:</strong> We keep our security measures updated against emerging threats</li>
                  <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activities</li>
                </ul>
              </div>
            </section>

            <Separator className="bg-gray-600" />

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Sharing and Disclosure</h2>
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-4">
                <p className="text-red-300 font-semibold">
                  We do NOT sell, rent, or trade your personal information to third parties.
                </p>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                We may share your information only in these limited circumstances:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Safety:</strong> To protect the safety and rights of our users or the public</li>
                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate the platform (with strict confidentiality agreements)</li>
                <li><strong>Business Transfer:</strong> In case of merger, acquisition, or sale of assets (with advance notice)</li>
              </ul>
            </section>

            <Separator className="bg-gray-600" />

            {/* AI Data Usage */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. AI Conversation Data</h2>
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-blue-300 leading-relaxed">
                  <strong>Important:</strong> Your AI conversations may be used to improve our AI models and services. 
                  We recommend not sharing sensitive personal information (like passwords, financial details, or private documents) 
                  in AI conversations. Conversation data is anonymized when used for model training.
                </p>
              </div>
            </section>

            <Separator className="bg-gray-600" />

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights and Choices</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Access & Control</h3>
                  <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                    <li>View your personal information</li>
                    <li>Update your profile and settings</li>
                    <li>Download your data</li>
                    <li>Delete your account</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Privacy Options</h3>
                  <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                    <li>Opt out of analytics cookies</li>
                    <li>Control email notifications</li>
                    <li>Request data correction</li>
                    <li>Limit data processing</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-gray-600" />

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We retain your personal information only as long as necessary to provide our services:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Conversation History:</strong> Stored for service improvement (anonymized after 30 days)</li>
                <li><strong>Usage Analytics:</strong> Aggregated data retained for up to 2 years</li>
                <li><strong>Legal Compliance:</strong> Some data may be retained longer if required by law</li>
              </ul>
            </section>

            <Separator className="bg-gray-600" />

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. International Users</h2>
              <p className="text-gray-300 leading-relaxed">
                Next-AI is operated from Pakistan. If you are accessing our service from outside Pakistan, 
                please be aware that your information may be transferred to, stored, and processed in Pakistan. 
                By using our service, you consent to such transfer and processing.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe 
                your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last updated" date. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            <Separator className="bg-gray-600" />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Developer Information</h3>
                    <p className="text-gray-300">
                      <strong>Name:</strong> Huzaifa Iqbal<br />
                      <strong>Age:</strong> 23 years old<br />
                      <strong>Location:</strong> Karachi, Pakistan<br />
                      <strong>Role:</strong> Full-Stack Engineer<br />
                      <strong>Experience:</strong> 2+ years
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Connect With Me</h3>
                    <div className="space-y-2">
                      <Link href="https://github.com/huzidev" target="_blank" className="flex items-center gap-2 text-gray-300 hover:text-white">
                        <Github className="h-4 w-4" />
                        github.com/huzidev
                      </Link>
                      <Link href="https://www.linkedin.com/in/huzidev/" target="_blank" className="flex items-center gap-2 text-gray-300 hover:text-white">
                        <Linkedin className="h-4 w-4" />
                        linkedin.com/in/huzidev
                      </Link>
                      <Link href="https://x.com/huzideviq" target="_blank" className="flex items-center gap-2 text-gray-300 hover:text-white">
                        <Twitter className="h-4 w-4" />
                        x.com/huzideviq
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-600/30 rounded-lg">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <strong>About the Developer:</strong> I'm passionate about solving complex problems, 
                    eliminating bugs and errors, and crafting reliable, user-friendly software experiences. 
                    I work primarily with TypeScript, NextJS, RemixJS, NodeJS, Prisma, and PostgreSQL, 
                    always prioritizing scalable systems with clean, maintainable code.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
