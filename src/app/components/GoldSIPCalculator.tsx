"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowLeft, TrendingUp, Calendar, DollarSign, Info, BarChart3, PieChart, Target, HelpCircle, CheckCircle, Zap, Coins, Sparkles } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";

interface GoldSIPCalculatorProps {
  onBack: () => void;
}

interface YearlyBreakdown {
  year: number;
  sipAmount: number;
  goldUnits: number;
  totalInvestment: number;
  totalGoldUnits: number;
  goldValue: number;
  returns: number;
}

export default function GoldSIPCalculator({ onBack }: GoldSIPCalculatorProps) {
  const [monthlySIP, setMonthlySIP] = useState<number>(5000);
  const [investmentTenure, setInvestmentTenure] = useState<number>(10);
  const [expectedGoldReturn, setExpectedGoldReturn] = useState<number>(8);
  const [currentGoldPrice, setCurrentGoldPrice] = useState<number>(6200);
  const [stepUpEnabled, setStepUpEnabled] = useState<boolean>(false);
  const [stepUpPercentage, setStepUpPercentage] = useState<number>(10);

  // Calculated values
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalGoldUnits, setTotalGoldUnits] = useState<number>(0);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([]);

  // Calculate all values when inputs change
  useEffect(() => {
    let totalInvested = 0;
    let totalUnits = 0;
    const breakdown: YearlyBreakdown[] = [];
    
    let currentSIPAmount = monthlySIP;
    let currentGoldPricePerGram = currentGoldPrice;
    
    for (let year = 1; year <= investmentTenure; year++) {
      // Annual investment for this year
      const annualInvestment = currentSIPAmount * 12;
      totalInvested += annualInvestment;
      
      // Calculate gold units purchased this year
      const goldUnitsPurchased = annualInvestment / currentGoldPricePerGram;
      totalUnits += goldUnitsPurchased;
      
      // Calculate gold value at maturity (assuming appreciation)
      const yearsToMaturity = investmentTenure - year + 1;
      const futureGoldPrice = currentGoldPricePerGram * Math.pow(1 + expectedGoldReturn / 100, yearsToMaturity);
      const goldValueAtMaturity = totalUnits * futureGoldPrice;
      
      breakdown.push({
        year,
        sipAmount: currentSIPAmount,
        goldUnits: goldUnitsPurchased,
        totalInvestment: totalInvested,
        totalGoldUnits: totalUnits,
        goldValue: goldValueAtMaturity,
        returns: goldValueAtMaturity - totalInvested
      });
      
      // Increase SIP amount for next year if step-up is enabled
      if (stepUpEnabled) {
        currentSIPAmount = currentSIPAmount * (1 + stepUpPercentage / 100);
      }
      
      // Increase gold price for next year
      currentGoldPricePerGram = currentGoldPricePerGram * (1 + expectedGoldReturn / 100);
    }
    
    const finalMaturityAmount = totalUnits * (currentGoldPrice * Math.pow(1 + expectedGoldReturn / 100, investmentTenure));
    
    setTotalInvestment(totalInvested);
    setTotalGoldUnits(totalUnits);
    setMaturityAmount(finalMaturityAmount);
    setExpectedReturns(finalMaturityAmount - totalInvested);
    setYearlyBreakdown(breakdown);
  }, [monthlySIP, investmentTenure, expectedGoldReturn, currentGoldPrice, stepUpEnabled, stepUpPercentage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gold-50 to-gold-100">
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Back Button + Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#ffbf00] interactive-button"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* FipMoney Logo */}
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <motion.img
                  src={fipMoneyLogo}
                  alt="FipMoney Logo"
                  className="h-10 md:h-12 w-auto object-contain"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span 
                  className="text-xl md:text-2xl font-bold text-gray-900"
                  whileHover={{ color: "#ffbf00" }}
                  transition={{ duration: 0.3 }}
                >
                  FipMoney
                </motion.span>
              </motion.div>
            </div>

            {/* Right Section - Get Started Button */}
            <div className="hidden md:flex">
              <Button
                className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive-button magnetic"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Input Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Gold SIP Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Monthly SIP Amount */}
                <div className="space-y-2">
                  <Label htmlFor="monthlySIP" className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-[#ffbf00]" />
                    <span>Monthly SIP Amount (₹)</span>
                  </Label>
                  <Input
                    id="monthlySIP"
                    type="number"
                    value={monthlySIP}
                    onChange={(e) => setMonthlySIP(Number(e.target.value) || 0)}
                    className="focus:ring-[#ffbf00] focus:border-[#ffbf00]"
                    placeholder="Enter monthly SIP amount"
                  />
                </div>

                {/* Investment Tenure */}
                <div className="space-y-3">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#ffbf00]" />
                      <span>Investment Tenure (Years)</span>
                    </span>
                    <span className="font-semibold text-[#ffbf00]">{investmentTenure} years</span>
                  </Label>
                  <Slider
                    value={[investmentTenure]}
                    onValueChange={(value) => setInvestmentTenure(value[0])}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>

                {/* Expected Gold Return */}
                <div className="space-y-3">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-[#ffbf00]" />
                      <span>Expected Gold Return (% p.a.)</span>
                    </span>
                    <span className="font-semibold text-[#ffbf00]">{expectedGoldReturn}%</span>
                  </Label>
                  <Slider
                    value={[expectedGoldReturn]}
                    onValueChange={(value) => setExpectedGoldReturn(value[0])}
                    max={15}
                    min={4}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>4%</span>
                    <span>15%</span>
                  </div>
                </div>

                {/* Current Gold Price */}
                <div className="space-y-2">
                  <Label htmlFor="goldPrice" className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#ffbf00]" />
                    <span>Current Gold Price (₹ per gram)</span>
                  </Label>
                  <Input
                    id="goldPrice"
                    type="number"
                    value={currentGoldPrice}
                    onChange={(e) => setCurrentGoldPrice(Number(e.target.value) || 0)}
                    className="focus:ring-[#ffbf00] focus:border-[#ffbf00]"
                    placeholder="Enter current gold price"
                  />
                </div>

                {/* Step Up Option */}
                <div className="space-y-4 p-4 bg-gold-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-[#ffbf00]" />
                      <span>Enable Annual Step Up</span>
                    </Label>
                    <Switch
                      checked={stepUpEnabled}
                      onCheckedChange={setStepUpEnabled}
                    />
                  </div>
                  
                  {stepUpEnabled && (
                    <div className="space-y-3">
                      <Label className="flex items-center justify-between">
                        <span>Annual Step Up Percentage</span>
                        <span className="font-semibold text-[#ffbf00]">{stepUpPercentage}%</span>
                      </Label>
                      <Slider
                        value={[stepUpPercentage]}
                        onValueChange={(value) => setStepUpPercentage(value[0])}
                        max={25}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>5%</span>
                        <span>25%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gold Investment Summary */}
                <div className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] p-4 rounded-lg text-white">
                  <h4 className="font-semibold mb-2">Monthly Gold Purchase</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Gold Amount:</span>
                      <span className="font-semibold">{formatNumber(monthlySIP / currentGoldPrice)} grams</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Investment:</span>
                      <span className="font-semibold">{formatCurrency(monthlySIP * 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Gold Units:</span>
                      <span className="font-semibold">{formatNumber((monthlySIP * 12) / currentGoldPrice)} grams</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Main Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Maturity Amount</h3>
                    <p className="text-3xl font-bold">{formatCurrency(maturityAmount)}</p>
                    <p className="text-sm opacity-90 mt-2">
                      After {investmentTenure} years with {expectedGoldReturn}% gold appreciation
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Investment</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Gold Accumulated</p>
                      <p className="text-xl font-bold text-gray-900">{formatNumber(totalGoldUnits)} grams</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Coins className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Expected Returns</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(expectedReturns)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Return Percentage</p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalInvestment > 0 ? ((expectedReturns / totalInvestment) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investment Breakdown Chart */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-center text-gray-900 flex items-center justify-center space-x-2">
                  <PieChart className="w-5 h-5 text-[#ffbf00]" />
                  <span>Investment Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Principal Amount</span>
                    </div>
                    <span className="font-bold">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Expected Returns</span>
                    </div>
                    <span className="font-bold">{formatCurrency(expectedReturns)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Gold Accumulated</span>
                    </div>
                    <span className="font-bold">{formatNumber(totalGoldUnits)} grams</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-lg">
                    <span className="font-bold">Total Maturity Value</span>
                    <span className="font-bold text-lg">{formatCurrency(maturityAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive-button py-6">
                <Coins className="w-5 h-5 mr-2" />
                Start Gold SIP
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Year-wise Breakdown Table */}
        <motion.div
          className="mt-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#ffbf00]" />
                <span>Year-wise Gold SIP Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Monthly SIP</TableHead>
                      <TableHead>Gold Units</TableHead>
                      <TableHead>Total Investment</TableHead>
                      <TableHead>Gold Value</TableHead>
                      <TableHead>Returns</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyBreakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">{row.year}</TableCell>
                        <TableCell>{formatCurrency(row.sipAmount)}</TableCell>
                        <TableCell>{formatNumber(row.goldUnits)} grams</TableCell>
                        <TableCell>{formatCurrency(row.totalInvestment)}</TableCell>
                        <TableCell>{formatCurrency(row.goldValue)}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(row.returns)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Information Sections */}
        <motion.div
          className="mt-12 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* What is Gold SIP */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>What is a Gold SIP?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Gold SIP (Systematic Investment Plan) allows you to invest a fixed amount in gold every month. This disciplined approach helps you accumulate gold gradually over time, taking advantage of rupee-cost averaging. The Gold SIP Calculator helps you estimate the potential value of your gold investments over time, considering the expected appreciation in gold prices.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits of Gold SIP */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#ffbf00]" />
                  <span>Benefits of Gold SIP</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Coins className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Rupee Cost Averaging</h4>
                      <p className="text-sm text-gray-600">Buy more gold when prices are low, less when high</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Hedge Against Inflation</h4>
                      <p className="text-sm text-gray-600">Gold traditionally maintains value during inflationary periods</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Target className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Portfolio Diversification</h4>
                      <p className="text-sm text-gray-600">Add precious metals to balance your investment portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Disciplined Savings</h4>
                      <p className="text-sm text-gray-600">Systematic monthly investment builds long-term wealth</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-[#ffbf00]" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>How does Gold SIP work?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Gold SIP works by investing a fixed amount in gold every month. The investment amount is used to purchase gold at the current market price. Over time, you accumulate gold units which can appreciate in value based on market conditions.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>What is the minimum investment amount?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      With FipMoney's Gold SIP, you can start investing in digital gold with as little as ₹100 per month. This makes gold investment accessible to everyone regardless of their financial capacity.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Can I increase my SIP amount?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Yes, you can enable the step-up feature to automatically increase your SIP amount annually. You can also manually increase or decrease your SIP amount at any time based on your financial situation.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>What are the expected returns from gold?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Historically, gold has provided returns of 8-12% annually over long periods. However, gold prices can be volatile in the short term. The calculator uses your expected return rate to project future values, but actual returns may vary.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Can I sell my gold anytime?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Yes, digital gold is highly liquid. You can sell your accumulated gold units anytime at current market rates. FipMoney provides instant selling facility with competitive rates.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Is my gold investment safe?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Yes, your gold investments are backed by physical gold stored in secure vaults through our partner Augmont. Each gram of digital gold you own is backed by equivalent physical gold with full insurance coverage.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Important Notes */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Important Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 space-y-2">
                <p>• Gold SIP calculations are based on assumed returns and may vary with actual market performance.</p>
                <p>• Past performance of gold does not guarantee future returns.</p>
                <p>• Gold prices can be volatile and are influenced by various economic factors.</p>
                <p>• Consider your risk tolerance and investment goals before starting a Gold SIP.</p>
                <p>• Diversify your portfolio and don't invest all your money in a single asset class.</p>
                <p>• Consult with a financial advisor for personalized investment advice.</p>
                <p>• Digital gold is subject to applicable taxes on capital gains.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}