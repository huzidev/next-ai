import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatTimeAgo } from "@/utils/timeUtils";
import { AlertCircle, ArrowLeft, Bell, CheckCircle, Info, Megaphone } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export default function AnnouncementsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock announcements data (you can replace this with API call)
  useEffect(() => {
    // Simulate loading announcements
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Welcome to Next-AI!',
        content: 'We\'re excited to have you on board. Explore our AI-powered chat features and make the most of your experience. If you have any questions, don\'t hesitate to reach out to our support team.',
        type: 'success',
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: 'Next-AI Team'
      },
      {
        id: '2',
        title: 'New Image Analysis Feature',
        content: 'You can now upload images in your chat conversations for AI analysis! Simply click the image upload button and let our AI help you understand your images better.',
        type: 'info',
        isActive: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        author: 'Product Team'
      },
      {
        id: '3',
        title: 'Scheduled Maintenance',
        content: 'We will be performing scheduled maintenance on our servers this weekend from 2:00 AM to 4:00 AM EST. During this time, some features may be temporarily unavailable.',
        type: 'warning',
        isActive: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Engineering Team'
      },
      {
        id: '4',
        title: 'Important: Credit System Update',
        content: 'We\'ve updated our credit system to provide better value. All existing users will receive bonus credits as part of this update. Check your dashboard to see your updated balance.',
        type: 'urgent',
        isActive: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Next-AI Team'
      }
    ];

    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setIsLoading(false);
    }, 500);
  }, []);

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'urgent':
        return <Bell className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'success':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'urgent':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'info':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      case 'urgent':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Head>
        <title>Announcements - Next-AI</title>
        <meta name="description" content="Latest announcements and updates from Next-AI" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Megaphone className="h-8 w-8 mr-3 text-blue-400" />
                  Announcements
                </h1>
                <p className="text-gray-400">Stay up to date with the latest news and updates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Bell className="h-5 w-5" />
              <span>{announcements.filter(a => a.isActive).length} active</span>
            </div>
          </div>

          {/* Announcements List */}
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center space-x-3 animate-pulse">
                        <div className="h-5 w-5 bg-gray-600 rounded"></div>
                        <div className="h-6 bg-gray-600 rounded w-1/3"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-600 rounded w-full"></div>
                        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Announcements</h3>
                  <p className="text-gray-400">There are no announcements at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className={`bg-gray-800 border-gray-700 ${
                    announcement.type === 'urgent' ? 'ring-2 ring-red-500/20' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getAnnouncementColor(announcement.type)}`}>
                          {getAnnouncementIcon(announcement.type)}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">
                            {announcement.title}
                          </CardTitle>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge variant={getBadgeVariant(announcement.type)}>
                              {announcement.type.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              by {announcement.author}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(announcement.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Want to be notified of new announcements?{" "}
              <Button 
                variant="link" 
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                onClick={() => router.push('/settings')}
              >
                Manage your notification preferences
              </Button>
            </p>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}
