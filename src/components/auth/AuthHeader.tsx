interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ 
  title, 
  subtitle
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-300">{subtitle}</p>
    </div>
  );
}
