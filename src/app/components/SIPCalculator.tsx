"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, TrendingUp, Target, DollarSign, Calendar, Percent, Info, BarChart3 } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface SIPCalculatorProps {
  onBack?: () => void;
  embedded?: boolean;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

const calculateSIP = (monthlyAmount: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = years * 12;
  
  if (monthlyRate === 0) {
    return {
      totalInvestment: monthlyAmount * totalMonths,
      maturityAmount: monthlyAmount * totalMonths,
      totalReturns: 0
    };
  }
  
  const maturityAmount = monthlyAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalInvestment = monthlyAmount * totalMonths;
  const totalReturns = maturityAmount - totalInvestment;
  
  return {
    totalInvestment,
    maturityAmount,
    totalReturns
  };
};

const generateYearlyData = (monthlyAmount: number, annualRate: number, years: number) => {
  const data = [];
  for (let year = 1; year <= years; year++) {
    const { totalInvestment, maturityAmount } = calculateSIP(monthlyAmount, annualRate, year);
    data.push({
      year,
      invested: totalInvestment,
      returns: maturityAmount - totalInvestment,
      total: maturityAmount
    });
  }
  return data;
};

const COLORS = ['#ffbf00', '#ffd152', '#ffe485'];

const StatCard = ({ title, value, subtitle, icon: Icon, color = "gold" }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 interactive-card"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === 'gold' ? 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152]' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600 mb-2">{title}</div>
    {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
  </motion.div>
);

const CalculatorCard = ({ children, title }) => (
  <Card className="p-6 h-full">
    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
      <Calculator className="w-5 h-5 mr-2 text-[#ffbf00]" />
      {title}
    </h3>
    {children}
  </Card>
);

const SIPCalculatorContent = ({
  monthlyAmount, setMonthlyAmount,
  expectedReturn, setExpectedReturn,
  timePeriod, setTimePeriod,
  goalAmount, setGoalAmount,
  currentAge, setCurrentAge,
  retirementAge, setRetirementAge,
  totalInvestment, maturityAmount, totalReturns,
  yearlyData, pieData, requiredMonthlySIP,
  retirementCorpus, goalYears, yearsToRetire
}) => (
  <motion.div
    className="space-y-8"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* Hero Section */}
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Smart <span className="gradient-text">SIP Calculator</span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Plan your systematic investment journey with our advanced calculator. See how small investments can create big wealth over time.
      </p>
    </div>

    <Tabs defaultValue="sip" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-xl shadow-sm">
        <TabsTrigger value="sip" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">
          SIP Calculator
        </TabsTrigger>
        <TabsTrigger value="goal" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">
          Goal Planning
        </TabsTrigger>
        <TabsTrigger value="retirement" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">
          Retirement Planning
        </TabsTrigger>
      </TabsList>

      {/* SIP Calculator Tab */}
      <TabsContent value="sip" className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Controls */}
          <div className="lg:col-span-1">
            <CalculatorCard title="Investment Details">
              <div className="space-y-6">
                {/* Monthly Investment */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Monthly Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      type="number"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                      className="pl-8 text-lg h-12"
                      min="0"
                      max="1000000"
                    />
                  </div>
                  <Slider
                    value={[monthlyAmount]}
                    onValueChange={(value) => setMonthlyAmount(value[0])}
                    max={100000}
                    min={500}
                    step={500}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                {/* Expected Return */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Expected Annual Return
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Math.max(0, Math.min(30, Number(e.target.value))))}
                      className="pr-8 text-lg h-12"
                      min="0"
                      max="30"
                      step="0.5"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <Slider
                    value={[expectedReturn]}
                    onValueChange={(value) => setExpectedReturn(value[0])}
                    max={30}
                    min={1}
                    step={0.5}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Time Period */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Investment Period
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(Math.max(1, Math.min(40, Number(e.target.value))))}
                      className="pr-16 text-lg h-12"
                      min="1"
                      max="40"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">years</span>
                  </div>
                  <Slider
                    value={[timePeriod]}
                    onValueChange={(value) => setTimePeriod(value[0])}
                    max={40}
                    min={1}
                    step={1}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 year</span>
                    <span>40 years</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#fff8dc] to-[#ffe485] rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-[#b38200] mb-2">
                    <Info className="w-4 h-4" />
                    <span className="text-sm font-medium">Quick Tip</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Starting early gives your money more time to grow through the power of compounding!
                  </p>
                </div>
              </div>
            </CalculatorCard>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Investment"
                value={formatCurrency(totalInvestment)}
                subtitle={`${monthlyAmount.toLocaleString('en-IN')}/month × ${timePeriod} years`}
                icon={DollarSign}
              />
              <StatCard
                title="Expected Returns"
                value={formatCurrency(totalReturns)}
                subtitle={`${expectedReturn}% annual return`}
                icon={TrendingUp}
                color="blue"
              />
              <StatCard
                title="Maturity Amount"
                value={formatCurrency(maturityAmount)}
                subtitle={`After ${timePeriod} years`}
                icon={Target}
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(Number(value)), name]}
                      labelFormatter={(year) => `Year ${year}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="invested" 
                      stroke="#ffbf00" 
                      strokeWidth={3}
                      name="Invested Amount"
                      dot={{ fill: '#ffbf00', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#ffd152" 
                      strokeWidth={3}
                      name="Total Value"
                      dot={{ fill: '#ffd152', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Action Button */}
            <Card className="p-6 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Start Your SIP Journey?</h3>
                  <p className="opacity-90">Begin with just ₹{monthlyAmount.toLocaleString('en-IN')} per month</p>
                </div>
                <Button className="bg-white text-[#ffbf00] hover:bg-gray-100 px-8 py-6 text-lg interactive-button">
                  Start SIP Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>

      {/* Goal Planning Tab */}
      <TabsContent value="goal" className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <CalculatorCard title="Goal Details">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Target Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Math.max(0, Number(e.target.value)))}
                    className="pl-8 text-lg h-12"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Expected Annual Return: {expectedReturn}%
                </label>
                <Slider
                  value={[expectedReturn]}
                  onValueChange={(value) => setExpectedReturn(value[0])}
                  max={30}
                  min={1}
                  step={0.5}
                  className="mt-3"
                />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Goal Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Required Monthly SIP:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(requiredMonthlySIP)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time to achieve goal:</span>
                    <span className="font-semibold text-blue-600">{goalYears.toFixed(1)} years</span>
                  </div>
                </div>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard title="Popular Goals">
            <div className="space-y-4">
              {[
                { name: "Emergency Fund", amount: 500000, icon: "🛡️" },
                { name: "Dream House", amount: 5000000, icon: "🏠" },
                { name: "Child's Education", amount: 2000000, icon: "🎓" },
                { name: "World Tour", amount: 1000000, icon: "✈️" },
                { name: "Luxury Car", amount: 1500000, icon: "🚗" },
              ].map((goal) => (
                <div
                  key={goal.name}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#ffbf00] transition-colors duration-200 cursor-pointer"
                  onClick={() => setGoalAmount(goal.amount)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{goal.name}</div>
                      <div className="text-sm text-gray-600">{formatCurrency(goal.amount)}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#ffbf00] font-medium">
                    ₹{Math.round(goal.amount * (expectedReturn / 1200) / (Math.pow(1 + expectedReturn / 1200, 120) - 1)).toLocaleString('en-IN')}/month
                  </div>
                </div>
              ))}
            </div>
          </CalculatorCard>
        </div>
      </TabsContent>

      {/* Retirement Planning Tab */}
      <TabsContent value="retirement" className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <CalculatorCard title="Retirement Planning">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Current Age
                  </label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Math.max(18, Math.min(100, Number(e.target.value))))}
                    className="text-lg h-12"
                    min="18"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Retirement Age
                  </label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Math.min(100, Number(e.target.value))))}
                    className="text-lg h-12"
                    min={currentAge + 1}
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Monthly SIP Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                    className="pl-8 text-lg h-12"
                    min="0"
                  />
                </div>
                <Slider
                  value={[monthlyAmount]}
                  onValueChange={(value) => setMonthlyAmount(value[0])}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="mt-3"
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Retirement Corpus</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years to retirement:</span>
                    <span className="font-semibold text-green-600">{yearsToRetire} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total investment:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(retirementCorpus.totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retirement corpus:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(retirementCorpus.maturityAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard title="Age-wise Investment Strategy">
            <div className="space-y-4">
              {[
                { age: "20s", allocation: "Aggressive Growth", risk: "High", returns: "15-18%", color: "bg-red-500" },
                { age: "30s", allocation: "Balanced Growth", risk: "Medium-High", returns: "12-15%", color: "bg-orange-500" },
                { age: "40s", allocation: "Conservative Growth", risk: "Medium", returns: "10-12%", color: "bg-yellow-500" },
                { age: "50s+", allocation: "Capital Protection", risk: "Low", returns: "8-10%", color: "bg-green-500" },
              ].map((strategy) => (
                <div
                  key={strategy.age}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl"
                >
                  <div className={`w-4 h-4 ${strategy.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{strategy.age}</div>
                    <div className="text-sm text-gray-600">{strategy.allocation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{strategy.returns}</div>
                    <div className="text-xs text-gray-500">{strategy.risk} risk</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Recommendation</span>
              </div>
              <p className="text-sm text-gray-700">
                {currentAge < 30 
                  ? "You're young! Consider aggressive growth strategies to maximize long-term returns."
                  : currentAge < 40 
                  ? "Balance growth and stability for optimal retirement planning."
                  : currentAge < 50
                  ? "Focus on conservative growth to protect your accumulated wealth."
                  : "Prioritize capital protection and steady income generation."}
              </p>
            </div>
          </CalculatorCard>
        </div>
      </TabsContent>
    </Tabs>
  </motion.div>
);

export default function SIPCalculator({ onBack, embedded = false }: SIPCalculatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(60);
  
  const { totalInvestment, maturityAmount, totalReturns } = calculateSIP(monthlyAmount, expectedReturn, timePeriod);
  const yearlyData = generateYearlyData(monthlyAmount, expectedReturn, timePeriod);
  
  // Calculate goal-based SIP
  const goalYears = Math.max(1, goalAmount > 0 ? Math.log(goalAmount * (expectedReturn / 1200) + 1) / Math.log(1 + expectedReturn / 1200) / 12 : 1);
  const requiredMonthlySIP = goalAmount > 0 ? goalAmount * (expectedReturn / 1200) / (Math.pow(1 + expectedReturn / 1200, goalYears * 12) - 1) : 0;
  
  // Retirement planning calculation
  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const retirementCorpus = calculateSIP(monthlyAmount, expectedReturn, yearsToRetire);
  
  const pieData = [
    { name: 'Total Investment', value: totalInvestment, color: '#ffbf00' },
    { name: 'Returns', value: totalReturns, color: '#ffd152' }
  ];

  if (embedded) {
    // Simplified embedded version
    return (
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">SIP Calculator</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Monthly Investment Amount
            </label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-600">₹</span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Investment Duration: {timePeriod} years
            </label>
            <Slider
              value={[timePeriod]}
              onValueChange={(value) => setTimePeriod(value[0])}
              max={40}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Expected Return: {expectedReturn}%
            </label>
            <Slider
              value={[expectedReturn]}
              onValueChange={(value) => setExpectedReturn(value[0])}
              max={30}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
          
          <div className="bg-gradient-to-r from-[#fff8dc] to-[#ffe485] rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">₹{totalInvestment.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total Invested</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">₹{totalReturns.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Expected Returns</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#b38200]">₹{maturityAmount.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white">
            Start This SIP
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-[#fff8dc] to-[#ffe485] border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Back Button + Logo */}
            <div className="flex items-center space-x-4">
              {onBack && (
                <>
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
                </>
              )}
              
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

      <div className="container mx-auto px-4 py-8">
        <SIPCalculatorContent 
          monthlyAmount={monthlyAmount}
          setMonthlyAmount={setMonthlyAmount}
          expectedReturn={expectedReturn}
          setExpectedReturn={setExpectedReturn}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          goalAmount={goalAmount}
          setGoalAmount={setGoalAmount}
          currentAge={currentAge}
          setCurrentAge={setCurrentAge}
          retirementAge={retirementAge}
          setRetirementAge={setRetirementAge}
          totalInvestment={totalInvestment}
          maturityAmount={maturityAmount}
          totalReturns={totalReturns}
          yearlyData={yearlyData}
          pieData={pieData}
          requiredMonthlySIP={requiredMonthlySIP}
          retirementCorpus={retirementCorpus}
          goalYears={goalYears}
          yearsToRetire={yearsToRetire}
        />
      </div>
    </motion.div>
  );
}