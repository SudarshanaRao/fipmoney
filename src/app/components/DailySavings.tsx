"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Target, Calendar, TrendingUp, PiggyBank, Star, CheckCircle, Settings, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface DailySavingsProps {
  onBack: () => void;
}

const DailySavings = ({ onBack }: DailySavingsProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [dailyAmount, setDailyAmount] = useState<number>(50);
  const [targetAmount, setTargetAmount] = useState<number>(10000);
  const [timeframe, setTimeframe] = useState<string>('6');

  const savingsGoals = [
    { id: 'wedding', name: 'Wedding', icon: '💍', color: 'bg-pink-100 text-pink-800' },
    { id: 'vacation', name: 'Vacation', icon: '✈️', color: 'bg-blue-100 text-blue-800' },
    { id: 'house', name: 'House', icon: '🏠', color: 'bg-green-100 text-green-800' },
    { id: 'car', name: 'Car', icon: '🚗', color: 'bg-orange-100 text-orange-800' },
    { id: 'education', name: 'Education', icon: '🎓', color: 'bg-purple-100 text-purple-800' },
    { id: 'emergency', name: 'Emergency Fund', icon: '🛡️', color: 'bg-red-100 text-red-800' },
  ];

  const activeSavings = [
    {
      id: 1,
      goal: 'Wedding',
      icon: '💍',
      target: 200000,
      saved: 45000,
      dailyAmount: 100,
      daysLeft: 155,
      progress: 22.5
    },
    {
      id: 2,
      goal: 'Vacation',
      icon: '✈️',
      target: 50000,
      saved: 32000,
      dailyAmount: 75,
      daysLeft: 24,
      progress: 64
    },
    {
      id: 3,
      goal: 'Emergency Fund',
      icon: '🛡️',
      target: 100000,
      saved: 78000,
      dailyAmount: 50,
      daysLeft: 44,
      progress: 78
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Goal-Based Savings",
      description: "Set specific financial goals and save systematically"
    },
    {
      icon: Calendar,
      title: "Automated Daily Savings",
      description: "Money automatically invested in gold every day"
    },
    {
      icon: TrendingUp,
      title: "Gold Appreciation",
      description: "Your savings grow with gold price appreciation"
    },
    {
      icon: PiggyBank,
      title: "Flexible Amounts",
      description: "Start with as little as ₹10 per day"
    }
  ];

  const calculateDays = () => {
    return Math.ceil(targetAmount / dailyAmount);
  };

  const calculateMonthlyAmount = () => {
    return dailyAmount * 30;
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Daily Savings</h1>
            </div>
            <Badge className="bg-[#ffbf00] text-white">
              Auto-Invest in Gold
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create New Goal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-[#ffbf00] bg-gradient-to-r from-[#fff8dc] to-[#fffcf0]">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-[#ffbf00] rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <PiggyBank className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Save Daily, Grow in Gold</h2>
                    <p className="text-gray-600 mb-6">
                      Set up automated daily savings that get invested in gold. Watch your money grow with gold's appreciation.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-[#ffbf00]">₹10</p>
                        <p className="text-sm text-gray-600">Minimum Daily</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#ffbf00]">12.7%</p>
                        <p className="text-sm text-gray-600">Gold Growth (1Y)</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#ffbf00]">100%</p>
                        <p className="text-sm text-gray-600">Automated</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#ffbf00]">24/7</p>
                        <p className="text-sm text-gray-600">Liquidity</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Create New Savings Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-[#ffbf00]" />
                    <span>Create New Savings Goal</span>
                  </CardTitle>
                  <CardDescription>Set up a personalized savings plan for your financial goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Goal Selection */}
                  <div className="space-y-3">
                    <Label>Choose Your Goal</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {savingsGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            selectedGoal === goal.id
                              ? 'border-[#ffbf00] bg-[#fff8dc]'
                              : 'border-gray-200 hover:border-[#ffbf00] hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedGoal(goal.id)}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{goal.icon}</div>
                            <p className="text-sm font-medium text-gray-900">{goal.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(Number(e.target.value))}
                        placeholder="Enter target amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyAmount">Daily Savings (₹)</Label>
                      <Input
                        id="dailyAmount"
                        type="number"
                        value={dailyAmount}
                        onChange={(e) => setDailyAmount(Number(e.target.value))}
                        placeholder="Enter daily amount"
                        min="10"
                      />
                    </div>
                  </div>

                  {/* Timeframe */}
                  <div className="space-y-2">
                    <Label>Preferred Timeframe</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">1 year</SelectItem>
                        <SelectItem value="24">2 years</SelectItem>
                        <SelectItem value="36">3 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Calculation Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Savings Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Daily Investment</p>
                        <p className="font-semibold">₹{dailyAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Investment</p>
                        <p className="font-semibold">₹{calculateMonthlyAmount()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Target Amount</p>
                        <p className="font-semibold">₹{targetAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time to Goal</p>
                        <p className="font-semibold">{calculateDays()} days</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    disabled={!selectedGoal}
                    className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white font-semibold py-3"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Start Savings Goal
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Why Daily Savings?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#fff8dc] rounded-full flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-[#ffbf00]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Active Savings */}
          <div className="space-y-6">
            {/* Active Savings Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-[#ffbf00]" />
                    <span>Active Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSavings.map((saving) => (
                      <div key={saving.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{saving.icon}</span>
                            <h4 className="font-semibold text-gray-900">{saving.goal}</h4>
                          </div>
                          <Badge variant="outline" className="text-[#ffbf00] border-[#ffbf00]">
                            {saving.daysLeft} days left
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>₹{saving.saved.toLocaleString()}</span>
                            <span>₹{saving.target.toLocaleString()}</span>
                          </div>
                          <Progress value={saving.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{saving.progress}% completed</span>
                            <span>₹{saving.dailyAmount}/day</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-[#ffbf00]" />
                    <span>How It Works</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Set Your Goal", description: "Choose what you're saving for" },
                      { step: 2, title: "Define Amount", description: "Set daily savings amount" },
                      { step: 3, title: "Auto-Invest", description: "Money automatically buys gold" },
                      { step: 4, title: "Track Progress", description: "Monitor your goal completion" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-[#ffbf00] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
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
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Key Benefits</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Disciplined saving habit</li>
                        <li>• Gold price appreciation</li>
                        <li>• Flexible goal adjustment</li>
                        <li>• Instant liquidity</li>
                        <li>• No lock-in period</li>
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

export default DailySavings;