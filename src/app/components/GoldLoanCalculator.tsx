"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowLeft, Coins, TrendingUp, Calendar, DollarSign, Info, Sparkles, HelpCircle, CheckCircle, Shield, Clock, Banknote } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface GoldLoanCalculatorProps {
  onBack: () => void;
}

export default function GoldLoanCalculator({ onBack }: GoldLoanCalculatorProps) {
  const [goldWeight, setGoldWeight] = useState<number>(10);
  const [goldPurity, setGoldPurity] = useState<string>("22");
  const [goldRate, setGoldRate] = useState<number>(6200);
  const [ltvRatio, setLtvRatio] = useState<number>(75);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [loanTenure, setLoanTenure] = useState<number>(12);
  const [tenureType, setTenureType] = useState<string>("months");

  // Calculated values
  const [goldValue, setGoldValue] = useState<number>(0);
  const [eligibleLoanAmount, setEligibleLoanAmount] = useState<number>(0);
  const [emi, setEmi] = useState<number>(0);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Gold purity factors
  const purityFactors = {
    "18": 0.75,
    "22": 0.916,
    "24": 1.0
  };

  // Calculate all values when inputs change
  useEffect(() => {
    const purityFactor = purityFactors[goldPurity] || 0.916;
    const calculatedGoldValue = goldWeight * goldRate * purityFactor;
    const calculatedLoanAmount = (calculatedGoldValue * ltvRatio) / 100;
    
    setGoldValue(calculatedGoldValue);
    setEligibleLoanAmount(calculatedLoanAmount);

    // EMI Calculation
    const monthlyRate = interestRate / 12 / 100;
    const tenureInMonths = tenureType === "years" ? loanTenure * 12 : loanTenure;
    
    if (monthlyRate > 0 && tenureInMonths > 0 && calculatedLoanAmount > 0) {
      const emiAmount = (calculatedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                       (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
      const totalPayableAmount = emiAmount * tenureInMonths;
      const totalInterestAmount = totalPayableAmount - calculatedLoanAmount;
      
      setEmi(emiAmount);
      setTotalPayable(totalPayableAmount);
      setTotalInterest(totalInterestAmount);
    }
  }, [goldWeight, goldPurity, goldRate, ltvRatio, interestRate, loanTenure, tenureType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
          className="grid lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Input Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>Loan Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Gold Weight */}
                <div className="space-y-2">
                  <Label htmlFor="goldWeight" className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#ffbf00]" />
                    <span>Gold Weight (grams)</span>
                  </Label>
                  <Input
                    id="goldWeight"
                    type="number"
                    value={goldWeight}
                    onChange={(e) => setGoldWeight(Number(e.target.value) || 0)}
                    className="focus:ring-[#ffbf00] focus:border-[#ffbf00]"
                    placeholder="Enter gold weight"
                  />
                </div>

                {/* Gold Purity */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-[#ffbf00]" />
                    <span>Gold Purity</span>
                  </Label>
                  <Select value={goldPurity} onValueChange={setGoldPurity}>
                    <SelectTrigger className="focus:ring-[#ffbf00] focus:border-[#ffbf00]">
                      <SelectValue placeholder="Select purity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18">18 Karat (75% pure)</SelectItem>
                      <SelectItem value="22">22 Karat (91.6% pure)</SelectItem>
                      <SelectItem value="24">24 Karat (99.9% pure)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gold Rate */}
                <div className="space-y-2">
                  <Label htmlFor="goldRate" className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#ffbf00]" />
                    <span>Current Gold Rate (₹ per gram)</span>
                  </Label>
                  <Input
                    id="goldRate"
                    type="number"
                    value={goldRate}
                    onChange={(e) => setGoldRate(Number(e.target.value) || 0)}
                    className="focus:ring-[#ffbf00] focus:border-[#ffbf00]"
                    placeholder="Enter current gold rate"
                  />
                </div>

                {/* LTV Ratio */}
                <div className="space-y-3">
                  <Label className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-[#ffbf00]" />
                      <span>Loan-to-Value Ratio</span>
                    </span>
                    <span className="font-semibold text-[#ffbf00]">{ltvRatio}%</span>
                  </Label>
                  <Slider
                    value={[ltvRatio]}
                    onValueChange={(value) => setLtvRatio(value[0])}
                    max={80}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>50%</span>
                    <span>80%</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-3">
                  <Label className="flex items-center justify-between">
                    <span>Interest Rate (% per annum)</span>
                    <span className="font-semibold text-[#ffbf00]">{interestRate}%</span>
                  </Label>
                  <Slider
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
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

                {/* Loan Tenure */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanTenure" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#ffbf00]" />
                      <span>Loan Tenure</span>
                    </Label>
                    <Input
                      id="loanTenure"
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value) || 0)}
                      className="focus:ring-[#ffbf00] focus:border-[#ffbf00]"
                      placeholder="Enter tenure"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tenure Type</Label>
                    <Select value={tenureType} onValueChange={setTenureType}>
                      <SelectTrigger className="focus:ring-[#ffbf00] focus:border-[#ffbf00]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Gold Value Card */}
            <Card className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white shadow-xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Total Gold Value</h3>
                  <p className="text-3xl font-bold">{formatCurrency(goldValue)}</p>
                  <p className="text-sm opacity-90 mt-2">
                    {goldWeight}g × ₹{goldRate} × {(purityFactors[goldPurity] * 100).toFixed(1)}% purity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Loan Details Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Eligible Loan Amount</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(eligibleLoanAmount)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(emi)}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Interest Payable</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInterest)}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount Payable</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPayable)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loan Summary */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-center text-gray-900">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-semibold">{formatCurrency(eligibleLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Amount:</span>
                    <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payable:</span>
                    <span className="font-bold text-lg">{formatCurrency(totalPayable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Tenure:</span>
                    <span className="font-semibold">
                      {loanTenure} {tenureType} 
                      {tenureType === "years" && ` (${loanTenure * 12} months)`}
                    </span>
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
                Apply for Gold Loan
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Information Sections */}
        <motion.div
          className="mt-12 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* What is Gold Loan Calculator */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>What is a Gold Loan Calculator?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Gold Loan Calculator is a financial tool that allows you to calculate the amount of loan you can receive and the interest you will need to pay over the tenure of your Gold Loan. It is a user-friendly and convenient tool for prospective Gold Loan borrowers. You can use it to calculate the worth of your gold and make accurate financial decisions.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* How does it work */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-[#ffbf00]" />
                  <span>How does the Gold Loan Calculator work?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Using the Gold Loan Calculator online is simple. It works by utilizing specific parameters related to your gold. You need to enter the number of ornaments you wish to pledge, their weight, and their caratage (i.e., purity in carats). The calculator will calculate the latest gold value and the amount of loan you can avail of against it. You can even enter the tenure of the loan and the loan amount to know the interest payable on your Gold Loan.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advantages */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#ffbf00]" />
                  <span>Advantages of Gold Loan Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  The Gold Loan Calculator offers numerous advantages and serves as an efficient tool that enables you to align your financial capabilities with your financial goals. It helps you plan your loan accurately before actually applying for the same.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  With the Gold Loan Calculator, you can know how much gold you need to pledge and what loan amount you can avail of. Further, it also informs you of the interest you will need to pay over the loan tenure. Additionally, you can identify the most suitable interest structure with or without Agri documents by experimenting with the different loan amounts, tenures, etc. This assists in making informed loan decisions.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Shield className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Accurate Planning</h4>
                      <p className="text-sm text-gray-600">Make informed decisions with precise loan calculations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Time Saving</h4>
                      <p className="text-sm text-gray-600">Quick calculations without manual computation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <Banknote className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Financial Planning</h4>
                      <p className="text-sm text-gray-600">Better understanding of loan obligations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gold-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-[#ffbf00] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Compare Options</h4>
                      <p className="text-sm text-gray-600">Experiment with different loan scenarios</p>
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
                        <span>How is interest calculated for Gold Loans?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Gold Loans are financing options that offer you flexible repayment methods. The interest calculated for Gold Loans depends on the amount of gold you pledge, the amount of loan you avail and the repayment method you select, i.e., monthly, end of tenure, etc. You are required to pay only the interest portion, followed by a bullet repayment of the principal amount, in the case of monthly interest facility. In the other option, where you repay at the end of the tenure, the interest and principal amount are to be repaid together at the end of the tenure. The Gold Loan Interest Calculator assists you in calculating such interest.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>How is the Gold Loan interest calculated?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      The Gold Loan interest is calculated by simply applying the interest rate on the amount of Gold Loan you have availed of. The calculation uses standard EMI formulas for monthly repayments or simple interest calculations for bullet repayment options.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>How to use an online Gold Loan Calculator?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      The Gold Loan Calculators Online are one of the most useful financial tools to help you calculate the loan amount and EMIs or interest before applying for the loan accurately. To use the online Gold Loan Interest Calculator, you need to submit the ornament type, purity and weight of the gold ornament. You will get to know the gold's value and the amount of loan you can avail.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Why choose FipMoney's Gold Loan calculator?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Using the right interest or EMI calculator for a jewel loan is important to make informed financing decisions and select the lender with the best terms. FipMoney's Gold Loan Calculator allows you to select the type of gold ornament, weight, and purity. It automatically calculates the gold value and amount of Gold Loan you can avail of against it. Our calculator is accurate, user-friendly, and provides real-time market rates for precise calculations.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>What factors affect gold loan eligibility?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Gold loan eligibility depends on several factors including the purity of gold (minimum 18 karat), weight of gold ornaments, current market rates, loan-to-value ratio offered by the lender, and the borrower's repayment capacity. The gold must be in good condition and properly hallmarked for accurate valuation.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>What is the maximum loan-to-value ratio for gold loans?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Most lenders offer a loan-to-value (LTV) ratio of up to 75-80% of the gold's current market value. This means if your gold is worth ₹1,00,000, you can get a loan of up to ₹75,000-₹80,000. The exact LTV ratio may vary based on the lender's policies and current market conditions.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:text-[#ffbf00] transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#ffbf00] rounded-full"></div>
                        <span>Are there any processing fees for gold loans?</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-4">
                      Yes, most lenders charge processing fees ranging from 0.5% to 2% of the loan amount. Additional charges may include valuation fees, documentation charges, and storage fees. It's important to factor in these costs when calculating the total cost of your gold loan. Our calculator provides the basic EMI calculation, but you should inquire about all applicable fees with your lender.
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
                <p>• Gold loan calculations are indicative and actual rates may vary.</p>
                <p>• Processing fees and other charges are not included in this calculation.</p>
                <p>• Gold purity will be verified by certified appraisers.</p>
                <p>• Loan amount depends on gold purity, weight, and current market rates.</p>
                <p>• Interest rates are subject to change based on market conditions.</p>
                <p>• Please consult with our loan specialists for personalized offers.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}