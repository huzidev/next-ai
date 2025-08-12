import { RouteGuard } from "@/components/auth/RouteGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Check, Crown, Star, Zap } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  tries: number;
  price: number;
}

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      const response = await fetch('/api/user/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        router.push('/settings');
      } else {
        console.error('Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Star className="h-6 w-6" />;
      case 'pro':
        return <Zap className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'pro':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'premium':
        return 'bg-purple-500/20 text-purple-400 border-purple-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
                <p className="text-gray-400">Select the perfect plan for your needs</p>
              </div>
            </div>
          </div>

          {/* Current Plan Info */}
          {user && (
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getPlanColor(user.plan?.name || 'free')}`}>
                      {getPlanIcon(user.plan?.name || 'free')}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Current Plan: {user.plan?.name ? user.plan.name.charAt(0).toUpperCase() + user.plan.name.slice(1) : 'Free'}
                      </h3>
                      <p className="text-gray-400">
                        {user.remainingTries} credits remaining
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="text-center text-gray-400">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors ${
                  user?.plan?.id === plan.id ? 'border-blue-500' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getPlanColor(plan.name)}`}>
                          {getPlanIcon(plan.name)}
                        </div>
                        <CardTitle className="text-xl text-white">
                          {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                        </CardTitle>
                      </div>
                      {user?.plan?.id === plan.id && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          Current
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-400">
                      Perfect for {plan.name === 'free' ? 'getting started' : 
                                 plan.name === 'pro' ? 'regular users' : 'power users'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        ${plan.price}
                        {plan.price > 0 && <span className="text-lg text-gray-400">/month</span>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">
                          {plan.tries === -1 ? 'Unlimited' : plan.tries} AI conversations
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">24/7 Support</span>
                      </div>
                      {plan.name !== 'free' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">Priority Response</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">Advanced Features</span>
                          </div>
                        </>
                      )}
                    </div>

                    <Button 
                      className="w-full"
                      variant={user?.plan?.id === plan.id ? "outline" : "default"}
                      disabled={user?.plan?.id === plan.id}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {user?.plan?.id === plan.id ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Plan Comparison */}
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Need Help Choosing?</CardTitle>
              <CardDescription className="text-gray-400">
                Compare our plans to find the one that's right for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Free Plan</h4>
                  <p className="text-gray-400">Great for trying out our AI assistant</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Pro Plan</h4>
                  <p className="text-gray-400">Perfect for regular users and small teams</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Premium Plan</h4>
                  <p className="text-gray-400">For power users who need unlimited access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}
