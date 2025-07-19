export interface LegalSection {
  id: string;
  title: string;
  content: string | string[] | {
    sections?: Array<{
      subtitle: string;
      items: string[];
    }>;
    cards?: Array<{
      title: string;
      color: string;
      items: string[];
    }>;
  };
  type: 'text' | 'list' | 'developer-info' | 'contact' | 'highlight';
  icon?: string;
  variant?: 'default' | 'warning' | 'info' | 'success';
}

export const termsOfServiceContent: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: 'Welcome to Next-AI! These Terms of Service ("Terms") govern your use of the Next-AI platform and services provided by Huzaifa Iqbal ("we," "us," or "our"). By accessing or using our service, you agree to be bound by these Terms.',
    type: 'text'
  },
  {
    id: 'about-next-ai',
    title: '2. About Next-AI',
    content: 'Next-AI is developed and maintained by Huzaifa Iqbal, a 23-year-old Full-Stack Engineer with 2+ years of experience, based in Karachi, Pakistan. Next-AI is built with modern technologies including TypeScript, NextJS, NodeJS, Prisma, and PostgreSQL, focusing on clean, scalable code and exceptional user experience.',
    type: 'developer-info'
  },
  {
    id: 'acceptance',
    title: '3. Acceptance of Terms',
    content: 'By creating an account or using Next-AI, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, please do not use our service.',
    type: 'text'
  },
  {
    id: 'user-accounts',
    title: '4. User Accounts',
    content: [
      'You must provide accurate and complete information when creating an account',
      'You are responsible for maintaining the security of your account credentials',
      'You must notify us immediately of any unauthorized use of your account',
      'One person may not maintain multiple accounts',
      'You must be at least 13 years old to create an account'
    ],
    type: 'list'
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable Use',
    content: [
      'Use the service for any illegal or unauthorized purpose',
      'Violate any laws in your jurisdiction',
      'Transmit any malicious code, viruses, or harmful content',
      'Attempt to gain unauthorized access to our systems',
      'Interfere with or disrupt the service or servers',
      'Use the service to spam, harass, or harm others',
      'Impersonate any person or entity'
    ],
    type: 'list'
  },
  {
    id: 'ai-service-usage',
    title: '6. AI Service Usage',
    content: [
      'AI responses are generated automatically and may not always be accurate',
      'You should verify important information independently',
      'Do not share sensitive personal information in AI conversations',
      'Respect usage limits and rate limiting measures',
      'Content generated using our AI services is subject to our content policy'
    ],
    type: 'list'
  },
  {
    id: 'intellectual-property',
    title: '7. Intellectual Property',
    content: 'The Next-AI platform, including its design, code, and features, is the intellectual property of Huzaifa Iqbal. You may not copy, modify, distribute, or create derivative works without explicit permission.',
    type: 'text'
  },
  {
    id: 'limitation-liability',
    title: '8. Limitation of Liability',
    content: 'Next-AI is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.',
    type: 'text'
  },
  {
    id: 'termination',
    title: '9. Termination',
    content: 'We reserve the right to terminate or suspend your account at any time for violations of these Terms. You may also terminate your account at any time by contacting us.',
    type: 'text'
  },
  {
    id: 'changes-terms',
    title: '10. Changes to Terms',
    content: 'We may update these Terms from time to time. We will notify users of significant changes via email or through the platform. Continued use of the service constitutes acceptance of updated Terms.',
    type: 'text'
  },
  {
    id: 'contact',
    title: '11. Contact Information',
    content: 'If you have any questions about these Terms, please contact us.',
    type: 'contact'
  }
];
