import { LegalSection } from './terms-content';

export const privacyPolicyContent: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: 'At Next-AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our AI-powered platform. By using Next-AI, you consent to the practices described in this policy.',
    type: 'text',
  },
  {
    id: 'commitment',
    title: '2. Our Commitment to Privacy',
    content: 'Next-AI is developed by Huzaifa Iqbal, a Full-Stack Engineer who prioritizes building scalable systems with clean, readable code and exceptional user experience. Privacy and security are fundamental principles in our development approach.',
    type: 'developer-info'
  },
  {
    id: 'information-collect',
    title: '3. Information We Collect',
    content: {
      sections: [
        {
          subtitle: 'Personal Information',
          items: [
            'Username and email address (for account creation)',
            'Password (encrypted and securely stored)',
            'Profile information you choose to provide'
          ]
        },
        {
          subtitle: 'Usage Data',
          items: [
            'AI conversation history and interactions',
            'Platform usage patterns and preferences',
            'Technical information (IP address, browser type, device info)',
            'Login times and session duration'
          ]
        },
        {
          subtitle: 'Automatically Collected Data',
          items: [
            'Cookies and similar tracking technologies',
            'Error logs and performance metrics',
            'Feature usage analytics'
          ]
        }
      ]
    },
    type: 'list',
  },
  {
    id: 'how-we-use',
    title: '4. How We Use Your Information',
    content: {
      cards: [
        {
          title: 'Service Provision',
          color: 'green',
          items: [
            'Provide AI-powered features and responses',
            'Maintain and improve user accounts',
            'Process authentication and authorization',
            'Enable platform functionality'
          ]
        },
        {
          title: 'Platform Improvement',
          color: 'green',
          items: [
            'Analyze usage patterns and trends',
            'Fix bugs and enhance performance',
            'Develop new features and capabilities',
            'Improve AI model responses'
          ]
        },
        {
          title: 'Communication',
          color: 'green',
          items: [
            'Send verification emails',
            'Notify about important updates',
            'Respond to support requests',
            'Share platform announcements'
          ]
        },
        {
          title: 'Security & Legal',
          color: 'green',
          items: [
            'Prevent fraud and abuse',
            'Ensure platform security',
            'Comply with legal obligations',
            'Protect user rights and safety'
          ]
        }
      ]
    },
    type: 'list'
  },
  {
    id: 'data-protection',
    title: '5. How We Protect Your Data',
    content: [
      'Encryption: All passwords are encrypted using secure hashing algorithms',
      'Secure Storage: Data is stored in secure databases with access controls',
      'HTTPS: All communications are encrypted in transit',
      'Access Control: Limited access to personal data on a need-to-know basis',
      'Regular Updates: We keep our security measures updated against emerging threats',
      'Monitoring: Continuous monitoring for suspicious activities'
    ],
    type: 'list',
  },
  {
    id: 'data-sharing',
    title: '6. Data Sharing and Disclosure',
    content: [
      'We do NOT sell, rent, or trade your personal information to third parties.',
      'Legal Requirements: When required by law, court order, or government request',
      'Safety: To protect the safety and rights of our users or the public',
      'Service Providers: With trusted third-party services that help us operate the platform (with strict confidentiality agreements)',
      'Business Transfer: In case of merger, acquisition, or sale of assets (with advance notice)'
    ],
    type: 'list',
    variant: 'warning'
  },
  {
    id: 'ai-data',
    title: '7. AI Conversation Data',
    content: 'Important: Your AI conversations may be used to improve our AI models and services. We recommend not sharing sensitive personal information (like passwords, financial details, or private documents) in AI conversations. Conversation data is anonymized when used for model training.',
    type: 'highlight',
    variant: 'info'
  },
  {
    id: 'user-rights',
    title: '8. Your Rights and Choices',
    content: {
      cards: [
        {
          title: 'Access & Control',
          color: 'purple',
          items: [
            'View your personal information',
            'Update your profile and settings',
            'Download your data',
            'Delete your account'
          ]
        },
        {
          title: 'Privacy Options',
          color: 'purple',
          items: [
            'Opt out of analytics cookies',
            'Control email notifications',
            'Request data correction',
            'Limit data processing'
          ]
        }
      ]
    },
    type: 'list'
  },
  {
    id: 'data-retention',
    title: '9. Data Retention',
    content: [
      'Account Data: Retained while your account is active',
      'Conversation History: Stored for service improvement (anonymized after 30 days)',
      'Usage Analytics: Aggregated data retained for up to 2 years',
      'Legal Compliance: Some data may be retained longer if required by law'
    ],
    type: 'list'
  },
  {
    id: 'international-users',
    title: '10. International Users',
    content: 'Next-AI is operated from Pakistan. If you are accessing our service from outside Pakistan, please be aware that your information may be transferred to, stored, and processed in Pakistan. By using our service, you consent to such transfer and processing.',
    type: 'text'
  },
  {
    id: 'children-privacy',
    title: '11. Children\'s Privacy',
    content: 'Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.',
    type: 'text'
  },
  {
    id: 'changes-policy',
    title: '12. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.',
    type: 'text'
  },
  {
    id: 'contact',
    title: '13. Contact Us',
    content: 'If you have any questions about this Privacy Policy or our data practices, please contact us.',
    type: 'contact'
  }
];
