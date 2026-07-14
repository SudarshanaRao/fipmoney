"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Clock, TrendingUp, Coins, Calculator, Star, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BuyGoldProps {
  onBack: () => void;
}

const BuyGold = ({ onBack }: BuyGoldProps) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [goldPrice, setGoldPrice] = useState<number>(6420);
  const [goldQuantity, setGoldQuantity] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<string>('one-time');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calculate gold quantity based on investment amount
    const quantity = investmentAmount / goldPrice;
    setGoldQuantity(quantity);
  }, [investmentAmount, goldPrice]);

  useEffect(() => {
    // Simulate real-time gold price updates
    const interval = setInterval(() => {
      setGoldPrice(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(6400, Math.min(6500, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Handle purchase logic here
  };

  const investmentPlans = [
    {
      id: 'one-time',
      name: 'One-Time Purchase',
      description: 'Buy gold instantly with a single payment',
      icon: Coins,
      popular: false
    },
    {
      id: 'monthly-sip',
      name: 'Monthly SIP',
      description: 'Invest regularly every month',
      icon: TrendingUp,
      popular: true
    },
    {
      id: 'weekly-sip',
      name: 'Weekly SIP',
      description: 'Small weekly investments for better averaging',
      icon: Clock,
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your gold is stored in MMTC-PAMP certified vaults"
    },
    {
      icon: TrendingUp,
      title: "Real-time Pricing",
      description: "Live gold rates updated every second"
    },
    {
      icon: Coins,
      title: "24K Pure Gold",
      description: "999.9 purity guaranteed digital gold"
    },
    {
      icon: Calculator,
      title: "No Hidden Fees",
      description: "Transparent pricing with minimal charges"
    }
  ];

  const priceHistory = [
    { date: '1 Day', change: '+0.8%', value: 6420 },
    { date: '1 Week', change: '+2.1%', value: 6290 },
    { date: '1 Month', change: '+5.3%', value: 6100 },
    { date: '1 Year', change: '+12.7%', value: 5695 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-[#ffbf00] hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Buy Gold</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-green-600 bg-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live Rates
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Purchase Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Gold Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-[#ffbf00] bg-gradient-to-r from-[#fff8dc] to-[#fffcf0]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-gray-900">Current Gold Price</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-semibold">+0.8%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-[#ffbf00]">₹{goldPrice.toFixed(2)}</span>
                    <span className="text-gray-600">/gram</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">24K Pure Gold • Last updated: Just now</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Investment Plan</CardTitle>
                  <CardDescription>Select how you want to invest in gold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {investmentPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedPlan === plan.id
                            ? 'border-[#ffbf00] bg-[#fff8dc]'
                            : 'border-gray-200 hover:border-[#ffbf00] hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-[#ffbf00] text-white">
                            Popular
                          </Badge>
                        )}
                        <div className="flex items-center space-x-3 mb-2">
                          <plan.icon className="w-5 h-5 text-[#ffbf00]" />
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Investment Amount</CardTitle>
                  <CardDescription>Choose how much you want to invest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="amount"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        className="flex-1"
                        min="1"
                        max="1000000"
                      />
                      <div className="flex space-x-2">
                        {[500, 1000, 5000, 10000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setInvestmentAmount(amount)}
                            className="text-[#ffbf00] border-[#ffbf00] hover:bg-[#ffbf00] hover:text-white"
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount Slider</Label>
                    <Slider
                      value={[investmentAmount]}
                      onValueChange={(value) => setInvestmentAmount(value[0])}
                      max={100000}
                      min={1}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Investment Amount:</span>
                      <span className="font-semibold">₹{investmentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Gold Quantity:</span>
                      <span className="font-semibold">{goldQuantity.toFixed(4)} grams</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-semibold">₹{(investmentAmount * 0.03).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-[#ffbf00]">₹{(investmentAmount * 1.03).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white font-semibold py-3 text-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Buy Gold for ₹${investmentAmount.toLocaleString()}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Info & Benefits */}
          <div className="space-y-6">
            {/* Price History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#ffbf00]" />
                    <span>Price History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {priceHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{item.date}</span>
                          <p className="text-sm text-gray-600">₹{item.value}</p>
                        </div>
                        <Badge
                          variant={item.change.startsWith('+') ? 'default' : 'destructive'}
                          className={item.change.startsWith('+') ? 'bg-green-100 text-green-800' : ''}
                        >
                          {item.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-[#ffbf00]" />
                    <span>Why Choose FipMoney?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#fff8dc] rounded-full flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-[#ffbf00]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">100% Secure & Insured</h4>
                      <p className="text-sm text-green-700">
                        Your gold is stored in MMTC-PAMP certified vaults with full insurance coverage. 
                        All transactions are encrypted and secure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Minimum investment: ₹1</li>
                        <li>• Processing fee: 3% + GST</li>
                        <li>• Gold can be sold anytime</li>
                        <li>• Prices updated in real-time</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyGold;