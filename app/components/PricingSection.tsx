'use client';

import React, { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { Button } from "@/app/components/ui/button"; 
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/app/components/ui/card"; 
import { CheckIcon, AlertCircle } from "lucide-react"; 
import { useAuth } from "../contexts/AuthContext"; 
import { SubscriptionPlan } from "../utils/subscriptionUtils"; 
import RazorpayCheckout from "./RazorpayCheckout"; 

export default function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLoginRedirect = () => {
    router.push('/login?redirect=/pricing');
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Individual Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <Card className="flex flex-col border-2 hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Basic</CardTitle>
                <CardDescription>For individuals getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$X</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Feature 1</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Feature 2</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Feature 3</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter>
                {user ? (
                  <RazorpayCheckout 
                    plan={SubscriptionPlan.BASIC}
                    buttonText="Upgrade to Basic"
                    className="w-full"
                  />
                ) : (
                  <Button 
                    className="w-full" 
                    variant="primary"
                    onClick={handleLoginRedirect}
                  >
                    Sign In to Upgrade
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col border-2 border-primary shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                Popular
              </div>
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Most popular choice</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$Y</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Premium Feature 1</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Premium Feature 2</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Premium Feature 3</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter>
                {user ? (
                  <RazorpayCheckout 
                    plan={SubscriptionPlan.PREMIUM}
                    buttonText="Upgrade to Premium"
                    className="w-full"
                  />
                ) : (
                  <Button 
                    className="w-full" 
                    variant="primary"
                    onClick={handleLoginRedirect}
                  >
                    Sign In to Upgrade
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Business Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <Card className="flex flex-col border-2 hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Team</CardTitle>
                <CardDescription>For small teams</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$A</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Up to 10 team members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Team Feature 1</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Team Feature 2</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Team Feature 3</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="primary"
                  onClick={handleLoginRedirect}
                >
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col border-2 hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-2xl font-bold">Custom Pricing</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Everything in Team plan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Enterprise Feature 1</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Enterprise Feature 2</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="primary"
                  onClick={handleLoginRedirect}
                >
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
