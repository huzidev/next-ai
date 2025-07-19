// Shared styles for legal pages and other components
export const sharedStyles = {
  // Layout styles
  container: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
  contentWrapper: "container mx-auto px-4 py-8 max-w-4xl",
  
  // Typography
  title: "text-4xl font-bold text-white mb-4",
  subtitle: "text-gray-400 text-lg",
  sectionTitle: "text-2xl font-semibold text-white mb-4",
  text: "text-gray-300 leading-relaxed",
  
  // Cards and containers
  card: "bg-gray-800/90 backdrop-blur border-gray-700",
  cardContent: "p-8 space-y-8",
  cardItem: "bg-gray-700/30 p-4 rounded-lg",
  
  // Highlights and special sections
  highlight: "p-4 rounded-lg",
  warningHighlight: "bg-red-900/20 border border-red-500/30",
  infoHighlight: "bg-blue-900/20 border border-blue-500/30",
  successHighlight: "bg-green-900/20 border border-green-500/30",
  
  // Developer info
  developerBox: "bg-gray-700/50 p-6 rounded-lg",
  
  // Lists
  list: "text-gray-300 space-y-2 list-disc list-inside",
  listItem: "text-gray-300",
  
  // Links
  socialLink: "inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors",
  
  // Separators
  separator: "bg-gray-600",
  
  // Grids
  cardGrid: "grid md:grid-cols-2 gap-6",
  contactGrid: "grid md:grid-cols-2 gap-6",
  
  // Text colors
  textColors: {
    primary: "text-white",
    secondary: "text-gray-300",
    muted: "text-gray-400",
    accent: "text-blue-400",
    success: "text-green-400",
    warning: "text-red-300",
    info: "text-blue-300",
    purple: "text-purple-400"
  }
};
