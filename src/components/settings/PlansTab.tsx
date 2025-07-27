import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, User } from "lucide-react";

interface PlansTabProps {
  user: any;
  onChangePlan: () => void;
}

export function PlansTab({ user, onChangePlan }: PlansTabProps) {
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
          {/* Free Plan */}
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-700/30 relative">
            {user?.plan?.name === 'free' && (
              <Badge className="absolute -top-2 left-4 bg-green-600 text-white">
                Current Plan
              </Badge>
            )}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-gray-500/20 rounded-lg">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Free Plan</h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">$0</p>
                <p className="text-gray-400">per month</p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  50 AI conversations per month
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Basic chat features
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Standard response time
                </div>
              </div>
              <Button 
                className="w-full mt-4"
                variant={user?.plan?.name === 'free' ? "secondary" : "outline"}
                disabled={user?.plan?.name === 'free'}
              >
                {user?.plan?.name === 'free' ? 'Current Plan' : 'Select Free'}
              </Button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border border-blue-500 rounded-lg p-6 bg-blue-500/10 relative transform scale-105">
            {user?.plan?.name === 'pro' && (
              <Badge className="absolute -top-2 left-4 bg-green-600 text-white">
                Current Plan
              </Badge>
            )}
            <Badge className="absolute -top-2 right-4 bg-blue-600 text-white">
              Most Popular
            </Badge>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Crown className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Pro Plan</h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">$9.99</p>
                <p className="text-gray-400">per month</p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  500 AI conversations per month
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Advanced chat features
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Priority response time
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Chat history export
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={user?.plan?.name === 'pro'}
                onClick={() => user?.plan?.name !== 'pro' && onChangePlan()}
              >
                {user?.plan?.name === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-700/30 relative">
            {user?.plan?.name === 'premium' && (
              <Badge className="absolute -top-2 left-4 bg-green-600 text-white">
                Current Plan
              </Badge>
            )}
            <Badge className="absolute -top-2 right-4 bg-purple-600 text-white">
              Best Value
            </Badge>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Premium Plan</h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">$19.99</p>
                <p className="text-gray-400">per month</p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Unlimited AI conversations
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Premium AI models access
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Fastest response time
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Advanced analytics
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Priority customer support
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={user?.plan?.name === 'premium'}
                onClick={() => user?.plan?.name !== 'premium' && onChangePlan()}
              >
                {user?.plan?.name === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
              </Button>
            </div>
          </div>
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
