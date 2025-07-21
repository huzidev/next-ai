import Logo from "../ui/logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-800/80 backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <Logo />
          </div>
          <p className="text-sm text-slate-600">
            © 2025 Next-AI. Powered by Google Generative AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
