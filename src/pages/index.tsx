import { RouteGuard } from "@/components/auth/RouteGuard";
import Main from "@/components/home/Main";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Geist, Geist_Mono } from "next/font/google";

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
    <RouteGuard requireAuth={false}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-[family-name:var(--font-geist-sans)]`}
      >
        <Header />
        <Main />
        <Footer />
      </div>
    </RouteGuard>
  );
}
