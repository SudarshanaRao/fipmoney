"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingDown, Coins, Clock, Shield, Calculator, AlertCircle, CheckCircle, DollarSign, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Alert, AlertDescription } from "./ui/alert";

interface SellGoldProps {
  onBack: () => void;
}

const SellGold = ({ onBack }: SellGoldProps) => {
  const [goldHoldings, setGoldHoldings] = useState<number>(2.5674); // grams
  const [sellAmount, setSellAmount] = useState<number>(1);
  const [goldPrice, setGoldPrice] = useState<number>(6420);
  const [sellValue, setSellValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sellType, setSellType] = useState<'partial' | 'full'>('partial');

  useEffect(() => {
    // Calculate sell value based on sell amount
    const value = sellAmount * goldPrice * 0.97; // 3% selling fee
    setSellValue(value);
  }, [sellAmount, goldPrice]);

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

  const handleSell = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Handle sell logic here
  };

  const totalValue = goldHoldings * goldPrice;
  const totalInvestment = 15000; // Mock investment amount
  const profitLoss = totalValue - totalInvestment;
  const profitLossPercentage = (profitLoss / totalInvestment) * 100;

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
              <h1 className="text-2xl font-bold text-gray-900">Sell Gold</h1>
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
          {/* Left Column - Sell Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gold Holdings Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-[#ffbf00] bg-gradient-to-r from-[#fff8dc] to-[#fffcf0]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coins className="w-6 h-6 text-[#ffbf00]" />
                    <span>Your Gold Holdings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Gold</p>
                      <p className="text-2xl font-bold text-[#ffbf00]">{goldHoldings.toFixed(4)} g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current Value</p>
                      <p className="text-2xl font-bold text-gray-900">₹{totalValue.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">P&L</p>
                      <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toFixed(2)}
                      </p>
                      <p className={`text-sm ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Sell Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Current Sell Price</span>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-orange-500" />
                      <span className="text-orange-600 font-semibold">-0.3%</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-[#ffbf00]">₹{(goldPrice * 0.97).toFixed(2)}</span>
                    <span className="text-gray-600">/gram</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Sell rate (3% fee included) • Last updated: Just now
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sell Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sell Options</CardTitle>
                  <CardDescription>Choose how much gold you want to sell</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        sellType === 'partial'
                          ? 'border-[#ffbf00] bg-[#fff8dc]'
                          : 'border-gray-200 hover:border-[#ffbf00] hover:bg-gray-50'
                      }`}
                      onClick={() => setSellType('partial')}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Calculator className="w-5 h-5 text-[#ffbf00]" />
                        <h3 className="font-semibold text-gray-900">Partial Sell</h3>
                      </div>
                      <p className="text-sm text-gray-600">Sell a specific amount of gold</p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        sellType === 'full'
                          ? 'border-[#ffbf00] bg-[#fff8dc]'
                          : 'border-gray-200 hover:border-[#ffbf00] hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSellType('full');
                        setSellAmount(goldHoldings);
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Wallet className="w-5 h-5 text-[#ffbf00]" />
                        <h3 className="font-semibold text-gray-900">Sell All</h3>
                      </div>
                      <p className="text-sm text-gray-600">Sell all your gold holdings</p>
                    </div>
                  </div>

                  {sellType === 'partial' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sellAmount">Amount to Sell (grams)</Label>
                        <Input
                          id="sellAmount"
                          type="number"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(Math.min(Number(e.target.value), goldHoldings))}
                          max={goldHoldings}
                          min={0.0001}
                          step={0.0001}
                          placeholder="Enter amount in grams"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Amount Slider</Label>
                        <Slider
                          value={[sellAmount]}
                          onValueChange={(value) => setSellAmount(value[0])}
                          max={goldHoldings}
                          min={0.0001}
                          step={0.0001}
                          className="w-full"
                        />
                      </div>

                      <div className="flex space-x-2">
                        {[25, 50, 75, 100].map((percentage) => (
                          <Button
                            key={percentage}
                            variant="outline"
                            size="sm"
                            onClick={() => setSellAmount((goldHoldings * percentage) / 100)}
                            className="text-[#ffbf00] border-[#ffbf00] hover:bg-[#ffbf00] hover:text-white"
                          >
                            {percentage}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sell Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sell Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Gold Amount:</span>
                      <span className="font-semibold">{sellAmount.toFixed(4)} grams</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price per gram:</span>
                      <span className="font-semibold">₹{(goldPrice * 0.97).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-semibold">₹{(sellAmount * goldPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Selling Fee (3%):</span>
                      <span className="font-semibold text-red-600">-₹{(sellAmount * goldPrice * 0.03).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">Net Amount:</span>
                        <span className="font-bold text-xl text-[#ffbf00]">₹{sellValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Amount will be credited to your bank account within 1-2 business days.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleSell}
                    disabled={isLoading || sellAmount <= 0}
                    className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white font-semibold py-3 text-lg mt-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="loading-spinner" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Sell Gold for ₹${sellValue.toFixed(2)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Instant Liquidation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Instant Liquidation</h4>
                      <p className="text-sm text-green-700">
                        Sell your gold instantly at current market rates. No waiting periods or complex procedures.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Selling Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-[#ffbf00]" />
                    <span>Selling Process</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Choose Amount", description: "Select how much gold to sell" },
                      { step: 2, title: "Confirm Sale", description: "Review and confirm your transaction" },
                      { step: 3, title: "Instant Processing", description: "Your gold is sold at current rates" },
                      { step: 4, title: "Payment", description: "Money credited to your account" }
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

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Selling fee: 3% of transaction value</li>
                        <li>• No minimum selling amount</li>
                        <li>• Instant processing at live rates</li>
                        <li>• Bank transfer in 1-2 business days</li>
                        <li>• Tax implications may apply</li>
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

export default SellGold;