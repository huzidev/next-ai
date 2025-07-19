import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { developerInfo } from "@/data/legal/developer-info";
import { LegalSection } from "@/data/legal/terms-content";
import { Database, ExternalLink, Eye, Github, Linkedin, Lock, Shield, Twitter } from "lucide-react";
import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  sections: LegalSection[];
  icon?: React.ReactNode;
}

export const legalStyles = {
  container: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
  contentWrapper: "container mx-auto px-4 py-8 max-w-4xl",
  header: "mb-8",
  headerCenter: "text-center",
  title: "text-4xl font-bold text-white mb-4",
  subtitle: "text-gray-400 text-lg",
  card: "bg-gray-800/90 backdrop-blur border-gray-700",
  cardContent: "p-8 space-y-8",
  sectionTitle: "text-2xl font-semibold text-white mb-4",
  sectionTitleWithIcon: "text-2xl font-semibold text-white mb-4 flex items-center",
  text: "text-gray-300 leading-relaxed",
  list: "text-gray-300 space-y-2 list-disc list-inside",
  listItem: "text-gray-300",
  developerBox: "bg-gray-700/50 p-6 rounded-lg mb-4",
  socialLinks: "flex flex-wrap gap-4",
  socialLink: "inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors",
  separator: "bg-gray-600",
  highlight: "p-4 rounded-lg",
  warningHighlight: "bg-red-900/20 border border-red-500/30",
  infoHighlight: "bg-blue-900/20 border border-blue-500/30",
  successHighlight: "bg-green-900/20 border border-green-500/30",
  contactGrid: "grid md:grid-cols-2 gap-6",
  contactSection: "bg-gray-700/50 p-6 rounded-lg",
  cardGrid: "grid md:grid-cols-2 gap-6",
  cardItem: "bg-gray-700/30 p-4 rounded-lg",
  cardTitle: "text-lg font-semibold mb-2",
  cardList: "text-gray-300 text-sm space-y-1 list-disc list-inside"
};

const getIcon = (iconName?: string) => {
  const iconProps = { className: "h-6 w-6 mr-3" };
  
  switch (iconName) {
    case 'eye':
      return <Eye {...iconProps} className="h-6 w-6 mr-3 text-blue-400" />;
    case 'lock':
      return <Lock {...iconProps} className="h-6 w-6 mr-3 text-yellow-400" />;
    case 'database':
      return <Database {...iconProps} className="h-6 w-6 mr-3 text-green-400" />;
    case 'shield':
      return <Shield {...iconProps} className="h-6 w-6 mr-3 text-green-400" />;
    default:
      return null;
  }
};

const getHighlightStyle = (variant?: string) => {
  switch (variant) {
    case 'warning':
      return `${legalStyles.highlight} ${legalStyles.warningHighlight}`;
    case 'info':
      return `${legalStyles.highlight} ${legalStyles.infoHighlight}`;
    case 'success':
      return `${legalStyles.highlight} ${legalStyles.successHighlight}`;
    default:
      return `${legalStyles.highlight} ${legalStyles.infoHighlight}`;
  }
};

const getCardTitleColor = (color: string) => {
  switch (color) {
    case 'green':
      return 'text-green-400';
    case 'purple':
      return 'text-purple-400';
    case 'blue':
      return 'text-blue-400';
    default:
      return 'text-blue-400';
  }
};

const renderContent = (section: LegalSection) => {
  const { content, type, variant } = section;

  switch (type) {
    case 'text':
      return <p className={legalStyles.text}>{content as string}</p>;

    case 'list':
      if (typeof content === 'object' && !Array.isArray(content)) {
        // Handle complex list structures
        if ('sections' in content && content.sections) {
          return (
            <div className="space-y-6">
              {content.sections.map((section, index) => (
                <div key={index}>
                  <h3 className={`text-lg font-semibold text-blue-400 mb-2`}>{section.subtitle}</h3>
                  <ul className={`${legalStyles.list} ml-4`}>
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className={legalStyles.listItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }
        
        if ('cards' in content && content.cards) {
          return (
            <div className={legalStyles.cardGrid}>
              {content.cards.map((card, index) => (
                <div key={index} className={legalStyles.cardItem}>
                  <h3 className={`${legalStyles.cardTitle} ${getCardTitleColor(card.color)}`}>
                    {card.title}
                  </h3>
                  <ul className={legalStyles.cardList}>
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }
      }
      
      // Handle simple list
      if (Array.isArray(content)) {
        const prefix = section.id === 'acceptable-use' ? 'You agree not to:' : 
                     section.id === 'data-sharing' ? 'We may share your information only in these limited circumstances:' :
                     section.id === 'data-retention' ? 'We retain your personal information only as long as necessary to provide our services:' :
                     section.id === 'data-protection' ? 'We implement industry-standard security measures to protect your personal information:' : '';
        
        return (
          <div>
            {prefix && <p className={`${legalStyles.text} mb-4`}>{prefix}</p>}
            <ul className={legalStyles.list}>
              {content.map((item, index) => (
                <li key={index} className={legalStyles.listItem}>
                  {item.includes(':') ? (
                    <>
                      <strong>{item.split(':')[0]}:</strong> {item.split(':').slice(1).join(':')}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      break;

    case 'developer-info':
      return (
        <div className={legalStyles.developerBox}>
          <p className={`${legalStyles.text} mb-4`}>
            Next-AI is developed and maintained by{" "}
            <strong className="text-blue-400">{developerInfo.name}</strong>, 
            a {developerInfo.age}-year-old {developerInfo.role} with {developerInfo.experience} of experience, 
            based in {developerInfo.location}.
          </p>
          
          <div className={legalStyles.socialLinks}>
            <Link
              href={developerInfo.socialLinks.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className={legalStyles.socialLink}
            >
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </Link>
            
            <Link
              href={developerInfo.socialLinks.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className={legalStyles.socialLink}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
              <ExternalLink className="h-3 w-3" />
            </Link>
            
            <Link
              href={developerInfo.socialLinks.twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              className={legalStyles.socialLink}
            >
              <Twitter className="h-4 w-4" />
              X (Twitter)
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          
          {content && typeof content === 'string' && (
            <p className={`${legalStyles.text} mt-4`}>{content}</p>
          )}
        </div>
      );

    case 'highlight':
      const textColor = variant === 'warning' ? 'text-red-300' : 
                       variant === 'info' ? 'text-blue-300' : 
                       'text-green-300';
      
      return (
        <div className={getHighlightStyle(variant)}>
          <p className={`${textColor} leading-relaxed`}>
            <strong>Important:</strong> {content as string}
          </p>
        </div>
      );

    case 'contact':
      return (
        <div>
          <p className={`${legalStyles.text} mb-4`}>{content as string}</p>
          <div className={legalStyles.contactSection}>
            <div className={legalStyles.contactGrid}>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Developer Information</h3>
                <p className={legalStyles.text}>
                  <strong>Name:</strong> {developerInfo.name}<br />
                  <strong>Age:</strong> {developerInfo.age} years old<br />
                  <strong>Location:</strong> {developerInfo.location}<br />
                  <strong>Role:</strong> {developerInfo.role}<br />
                  <strong>Experience:</strong> {developerInfo.experience}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Connect With Me</h3>
                <div className="space-y-2">
                  <Link 
                    href={developerInfo.socialLinks.github.url} 
                    target="_blank" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Github className="h-4 w-4" />
                    {developerInfo.socialLinks.github.display}
                  </Link>
                  <Link 
                    href={developerInfo.socialLinks.linkedin.url} 
                    target="_blank" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                    {developerInfo.socialLinks.linkedin.display}
                  </Link>
                  <Link 
                    href={developerInfo.socialLinks.twitter.url} 
                    target="_blank" 
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Twitter className="h-4 w-4" />
                    {developerInfo.socialLinks.twitter.display}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-600/30 rounded-lg">
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>About the Developer:</strong> {developerInfo.description}
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return <p className={legalStyles.text}>{content as string}</p>;
  }
};

export default function LegalPageLayout({ title, subtitle, sections, icon }: LegalPageLayoutProps) {
  return (
    <div className={legalStyles.container}>
      <Header />
      <div className={legalStyles.contentWrapper}>
        {/* Header */}
        <div className={legalStyles.header}>
          <div className={legalStyles.headerCenter}>
            <h1 className={legalStyles.title}>{title}</h1>
            <p className={legalStyles.subtitle}>
              {subtitle || `Last updated: ${new Date().toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <Card className={legalStyles.card}>
          <CardContent className={legalStyles.cardContent}>
            {sections.map((section, index) => (
              <div key={section.id}>
                <section>
                  <h2 className={section.icon ? legalStyles.sectionTitleWithIcon : legalStyles.sectionTitle}>
                    {getIcon(section.icon)}
                    {section.title}
                  </h2>
                  {renderContent(section)}
                </section>
                {index < sections.length - 1 && <Separator className={legalStyles.separator} />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
