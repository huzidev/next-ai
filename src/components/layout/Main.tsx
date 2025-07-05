import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight,
    Brain,
    Image,
    MessageSquare,
    Shield,
    Sparkles,
    UserCheck,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function Main() {
  return (
    <main>
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by Google Generative AI
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Your AI Assistant for
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {" "}Everything
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 md:text-xl">
              Chat with advanced AI, upload images for analysis, and get instant support from our admin team. 
              Experience the future of AI-powered assistance.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/user/signup">
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg">
                  Start Chatting Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/user/signin">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Everything you need for an intelligent AI experience
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-blue-900/50 group-hover:bg-blue-800/50 transition-colors">
                    <Brain className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">AI Conversations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-300">
                  Chat with Google&apos;s advanced AI models. Create multiple chat sessions and 
                  get intelligent responses to any question.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-green-900/50 group-hover:bg-green-800/50 transition-colors">
                    <Image className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Image Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-300">
                  Upload images and get AI-powered analysis, descriptions, and insights. 
                  Perfect for visual learning and exploration.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <MessageSquare className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Live Admin Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-300">
                  Get real-time help from our admin team through integrated chat. 
                  Socket.IO powered for instant communication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-orange-900/50 group-hover:bg-orange-800/50 transition-colors">
                    <UserCheck className="h-6 w-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Secure Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-300">
                  Secure signup with email verification. Toast notifications keep you 
                  informed of all account activities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-red-900/50 group-hover:bg-red-800/50 transition-colors">
                    <Shield className="h-6 w-6 text-red-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Admin Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-300">
                  Comprehensive admin panel with user management, real-time notifications, 
                  and advanced controls for super-admins.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300 bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-cyan-900/50 group-hover:bg-cyan-800/50 transition-colors">
                    <Zap className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Usage Plans</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-300">
                  Flexible usage plans with customizable limits. Track your AI 
                  interactions and upgrade when you need more.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-3xl text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Experience Next-Generation AI?
            </h2>
            <p className="mb-8 text-lg text-blue-100 md:text-xl">
              Join thousands of users who are already exploring the possibilities with our AI platform.
            </p>
            <Link href="/auth/user/signup">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
