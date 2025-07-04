import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  Brain,
  Image,
  MessageSquare,
  Shield,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-[family-name:var(--font-geist-sans)]`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Next-AI
              </span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link href="/auth/user/signin">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                User Login
              </Button>
            </Link>
            <Link href="/auth/admin/signin">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Admin Login
              </Button>
            </Link>
            <Link href="/auth/user/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by Google Generative AI
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Your AI Assistant for
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Everything
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 md:text-xl">
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
      <section className="px-4 py-20 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need for an intelligent AI experience
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">AI Conversations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Chat with Google's advanced AI models. Create multiple chat sessions and 
                  get intelligent responses to any question.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                    <Image className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Image Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Upload images and get AI-powered analysis, descriptions, and insights. 
                  Perfect for visual learning and exploration.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Live Admin Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get real-time help from our admin team through integrated chat. 
                  Socket.IO powered for instant communication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                    <UserCheck className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Secure Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Secure signup with email verification. Toast notifications keep you 
                  informed of all account activities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive admin panel with user management, real-time notifications, 
                  and advanced controls for super-admins.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-cyan-100 group-hover:bg-cyan-200 transition-colors">
                    <Zap className="h-6 w-6 text-cyan-600" />
                  </div>
                  <CardTitle className="text-xl">Usage Plans</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
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

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Next-AI</span>
            </div>
            <p className="text-sm text-slate-600">
              © 2025 Next-AI. Powered by Google Generative AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
