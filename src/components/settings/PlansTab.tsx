import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, User } from "lucide-react";
import { ReactNode } from "react";

interface PlansTabProps {
  user: any;
  onChangePlan: () => void;
}

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  icon: ReactNode;
  features: string[];
  isCurrentPlan: boolean;
  badge?: {
    text: string;
    color: string;
  };
  buttonColor: string;
  accentColor: string;
  borderColor: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  isPopular?: boolean;
  onSelect: () => void;
}

function PlanCard({
  name,
  price,
  period,
  icon,
  features,
  isCurrentPlan,
  badge,
  buttonColor,
  accentColor,
  borderColor,
  backgroundColor,
  iconBackgroundColor,
  isPopular = false,
  onSelect
}: PlanCardProps) {
  return (
    <div className={`border rounded-lg p-6 relative ${borderColor} ${backgroundColor} ${isPopular ? 'transform scale-105' : ''}`}>
      {isCurrentPlan && (
        <Badge className="absolute -top-2 left-4 bg-green-600 text-white">
          Current Plan
        </Badge>
      )}
      {badge && (
        <Badge className={`absolute -top-2 right-4 ${badge.color} text-white`}>
          {badge.text}
        </Badge>
      )}
      
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={`p-2 rounded-lg ${iconBackgroundColor}`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold text-white">{price}</p>
          <p className="text-gray-400">{period}</p>
        </div>
        
        <div className="space-y-3 text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-300">
              <span className={`w-2 h-2 rounded-full mr-3 ${accentColor}`}></span>
              {feature}
            </div>
          ))}
        </div>
        
        <Button
          className={`w-full mt-4 ${buttonColor}`}
          variant={isCurrentPlan ? "secondary" : "outline"}
          disabled={isCurrentPlan}
          onClick={() => !isCurrentPlan && onSelect()}
        >
          {isCurrentPlan ? "Current Plan" : `${name.includes('Free') ? 'Select Free' : `Upgrade to ${name.split(' ')[0]}`}`}
        </Button>
      </div>
    </div>
  );
}

export function PlansTab({ user, onChangePlan }: PlansTabProps) {
  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "per month",
      icon: <User className="h-6 w-6 text-gray-400" />,
      features: [
        "50 AI conversations per month",
        "Basic chat features",
        "Standard response time"
      ],
      isCurrentPlan: user?.plan?.name === "free",
      buttonColor: "",
      accentColor: "bg-blue-400",
      borderColor: "border-gray-700",
      backgroundColor: "bg-gray-700/30",
      iconBackgroundColor: "bg-gray-500/20",
      isPopular: false
    },
    {
      name: "Pro Plan",
      price: "$9.99",
      period: "per month",
      icon: <Crown className="h-6 w-6 text-blue-400" />,
      features: [
        "500 AI conversations per month",
        "Advanced chat features",
        "Priority response time",
        "Chat history export"
      ],
      isCurrentPlan: user?.plan?.name === "pro",
      badge: {
        text: "Most Popular",
        color: "bg-blue-600"
      },
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
      accentColor: "bg-blue-400",
      borderColor: "border-blue-500",
      backgroundColor: "bg-blue-500/10",
      iconBackgroundColor: "bg-blue-500/20",
      isPopular: true
    },
    {
      name: "Premium Plan",
      price: "$19.99",
      period: "per month",
      icon: <Crown className="h-6 w-6 text-purple-400" />,
      features: [
        "Unlimited AI conversations",
        "Premium AI models access",
        "Fastest response time",
        "Advanced analytics",
        "Priority customer support"
      ],
      isCurrentPlan: user?.plan?.name === "premium",
      badge: {
        text: "Best Value",
        color: "bg-purple-600"
      },
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
      accentColor: "bg-purple-400",
      borderColor: "border-gray-700",
      backgroundColor: "bg-gray-700/30",
      iconBackgroundColor: "bg-purple-500/20",
      isPopular: false
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Crown className="h-5 w-5 mr-2 text-blue-400" />
          Choose Your Plan
        </CardTitle>
        <CardDescription className="text-gray-400">
          Select the perfect plan for your AI conversation needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              icon={plan.icon}
              features={plan.features}
              isCurrentPlan={plan.isCurrentPlan}
              badge={plan.badge}
              buttonColor={plan.buttonColor}
              accentColor={plan.accentColor}
              borderColor={plan.borderColor}
              backgroundColor={plan.backgroundColor}
              iconBackgroundColor={plan.iconBackgroundColor}
              isPopular={plan.isPopular}
              onSelect={onChangePlan}
            />
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-700/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">
            ✨ All plans include secure data handling and 24/7 availability
          </p>
          <p className="text-gray-500 text-xs">
            You can upgrade, downgrade, or cancel your subscription at any time
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
