"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowLeft, TrendingUp, Calendar, DollarSign, Info, BarChart3, PieChart, Target, HelpCircle, CheckCircle, Zap } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface StepUpSIPCalculatorProps {
  onBack: () => void;
}

interface YearlyBreakdown {
  year: number;
  sipAmount: number;
  totalInvestment: number;
  expectedValue: number;
  returns: number;
}

export default function StepUpSIPCalculator({ onBack }: StepUpSIPCalculatorProps) {
  const [initialSIP, setInitialSIP] = useState<number>(5000);
  const [stepUpPercentage, setStepUpPercentage] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [investmentTenure, setInvestmentTenure] = useState<number>(10);

  // Calculated values
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(0);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([]);

  // Calculate all values when inputs change
  useEffect(() => {
    let totalInvested = 0;
    let totalValue = 0;
    const breakdown: YearlyBreakdown[] = [];
    
    let currentSIPAmount = initialSIP;
    
    for (let year = 1; year <= investmentTenure; year++) {
      // Annual investment for this year
      const annualInvestment = currentSIPAmount * 12;
      totalInvested += annualInvestment;
      
      // Calculate future value using compound interest formula
      // For each year's investment, calculate returns for remaining years
      const remainingYears = investmentTenure - year + 1;
      const monthlyReturn = expectedReturn / 12 / 100;
      const monthsRemaining = (remainingYears - 1) * 12;
      
      // Future value of this year's SIP investments
      let yearValue = 0;
      for (let month = 1; month <= 12; month++) {
        const monthsToMaturity = monthsRemaining + (12 - month + 1);
        const futureValue = currentSIPAmount * Math.pow(1 + monthlyReturn, monthsToMaturity);
        yearValue += futureValue;
      }
      
      totalValue += yearValue;
      
      breakdown.push({
        year,
        sipAmount: currentSIPAmount,
        totalInvestment: totalInvested,
        expectedValue: totalValue,
        returns: totalValue - totalInvested
      });
      
      // Increase SIP amount for next year
      currentSIPAmount = currentSIPAmount * (1 + stepUpPercentage / 100);
    }
    
    setTotalInvestment(totalInvested);
    setMaturityAmount(totalValue);
    setExpectedReturns(totalValue - totalInvested);
    setYearlyBreakdown(breakdown);
  }, [initialSIP, stepUpPercentage, expectedReturn, investmentTenure]);

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
                  <span>SIP Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Initial SIP Amount */}
                <div className="space-y-2">
                  <Label htmlFor="initialSIP" className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-[#ffbf00]" />
                    <span>Initial Monthly SIP Amount (₹)</span>
                  </Label>
                  <Input
                    id="initialSIP"
                    type="number"
                    value={initialSIP}
                    onChange={(e) => setInitialSIP(Number(e.target.value) || 0)}
                    className="focus:ring-[#ffbf00] focus:border-[#ffbf00]"
                    placeholder="Enter initial SIP amount"
                  />
                </div>

                {/* Step Up Percentage */}
                <div className="space-y-3">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-[#ffbf00]" />
                      <span>Annual Step Up Percentage</span>
                    </span>
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

                {/* Expected Return */}
                <div className="space-y-3">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-[#ffbf00]" />
                      <span>Expected Annual Return</span>
                    </span>
                    <span className="font-semibold text-[#ffbf00]">{expectedReturn}%</span>
                  </Label>
                  <Slider
                    value={[expectedReturn]}
                    onValueChange={(value) => setExpectedReturn(value[0])}
                    max={20}
                    min={8}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>8%</span>
                    <span>20%</span>
                  </div>
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
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>5 years</span>
                    <span>30 years</span>
                  </div>
                </div>

                {/* Step Up Projection */}
                <div className="bg-gold-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">SIP Growth Projection</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year 1 SIP:</span>
                      <span className="font-semibold">{formatCurrency(initialSIP)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year 5 SIP:</span>
                      <span className="font-semibold">{formatCurrency(initialSIP * Math.pow(1 + stepUpPercentage / 100, 4))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Final Year SIP:</span>
                      <span className="font-semibold">{formatCurrency(initialSIP * Math.pow(1 + stepUpPercentage / 100, investmentTenure - 1))}</span>
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
                      After {investmentTenure} years with {stepUpPercentage}% annual step-up
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
                <Calculator className="w-5 h-5 mr-2" />
                Start Step Up SIP
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
                <span>Year-wise Investment Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Monthly SIP</TableHead>
                      <TableHead>Total Investment</TableHead>
                      <TableHead>Expected Value</TableHead>
                      <TableHead>Returns</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyBreakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">{row.year}</TableCell>
                        <TableCell>{formatCurrency(row.sipAmount)}</TableCell>
                        <TableCell>{formatCurrency(row.totalInvestment)}</TableCell>
                        <TableCell>{formatCurrency(row.expectedValue)}</TableCell>
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
          {/* What is Step Up SIP */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>What is a Step Up SIP?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  A Step Up SIP (Systematic Investment Plan) is an enhanced version of regular SIP where you can increase your investment amount periodically, typically annually. This allows investors to align their investments with their growing income and accelerate wealth creation. The Step Up SIP Calculator helps you estimate the potential returns from such systematic step-up investments.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits of Step Up SIP */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#ffbf00]" />
                  <span>Benefits of Step Up SIP</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Zap className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Accelerated Wealth Growth</h4>
                      <p className="text-sm text-gray-600">Increase investment with growing income for faster wealth accumulation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Beat Inflation</h4>
                      <p className="text-sm text-gray-600">Regular increases help maintain purchasing power over time</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Target className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Goal Achievement</h4>
                      <p className="text-sm text-gray-600">Reach financial goals faster with disciplined step-up approach</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Automated Discipline</h4>
                      <p className="text-sm text-gray-600">Systematic approach ensures consistent investment growth</p>
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
                        <span>How does Step Up SIP work?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Step Up SIP allows you to increase your SIP amount periodically (usually annually) by a fixed percentage. For example, if you start with ₹5,000 monthly SIP and choose a 10% annual step-up, your SIP will become ₹5,500 in the second year, ₹6,050 in the third year, and so on.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>What is the ideal step-up percentage?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      The ideal step-up percentage typically ranges from 10-15% annually, which aligns with average salary increments and inflation rates. However, you can choose based on your income growth and financial capacity. A 10% step-up is commonly recommended for most investors.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Can I modify the step-up percentage later?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Yes, most mutual fund companies allow you to modify the step-up percentage or even pause the step-up feature if needed. You can adjust it based on changes in your financial situation or investment goals.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Is Step Up SIP better than regular SIP?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Step Up SIP is generally better for long-term wealth creation as it accelerates your investment growth and helps counter inflation. However, it requires higher financial commitment over time. Choose based on your income growth trajectory and financial discipline.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>What if I cannot afford the increased amount?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      If you cannot afford the increased amount in any particular year, you can pause the step-up for that year or reduce the step-up percentage. Most fund houses provide flexibility to manage your step-up schedule based on your financial capacity.
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
                <p>• Step Up SIP calculations are based on assumed annual returns and may vary with actual market performance.</p>
                <p>• Past performance does not guarantee future returns in mutual fund investments.</p>
                <p>• Consider your risk tolerance and investment horizon before choosing step-up percentages.</p>
                <p>• Ensure you have sufficient income growth to sustain the increased investment amounts.</p>
                <p>• Consult with a financial advisor for personalized investment advice.</p>
                <p>• Market volatility can impact actual returns compared to expected returns shown in calculations.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}