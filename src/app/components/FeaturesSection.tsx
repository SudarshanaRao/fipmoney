"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Zap, Target, PiggyBank, TrendingUp, Shield, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";


interface FeaturesSectionProps {
  onNavigateToCalculator?: () => void;
}

const FeatureCard = ({ feature, index, isActive, onClick }) => {
  const IconComponent = feature.icon;
  
  return (
    <motion.div
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 interactive-card ${
        isActive 
          ? 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white shadow-xl' 
          : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg hover:shadow-xl'
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      viewport={{ once: true }}
    >
      <motion.div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          isActive ? 'bg-white/20' : 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152]'
        }`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white'}`} />
      </motion.div>
      
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
        {feature.description}
      </p>
    </motion.div>
  );
};

const AutoSaveFeature = () => (
  <motion.div
    className="bg-white rounded-2xl p-8 shadow-xl"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Smart Auto-Save</h3>
    
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Round-up Purchases</div>
            <div className="text-sm text-gray-600">Invest spare change automatically</div>
          </div>
        </div>
        <div className="w-12 h-6 bg-[#ffbf00] rounded-full relative">
          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Salary Day Investment</div>
            <div className="text-sm text-gray-600">Auto-invest on payday</div>
          </div>
        </div>
        <div className="w-12 h-6 bg-[#ffbf00] rounded-full relative">
          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Price Drop Alerts</div>
            <div className="text-sm text-gray-600">Buy more when prices dip</div>
          </div>
        </div>
        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow"></div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-[#fff8dc] to-[#ffe485] rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-[#b38200]" />
          <div>
            <div className="font-medium text-gray-900">Smart Savings This Month</div>
            <div className="text-2xl font-bold text-[#b38200]">₹2,847</div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const GoalBasedSavings = () => {
  const goals = [
    { name: "Emergency Fund", target: 100000, current: 65000, color: "bg-red-500" },
    { name: "Wedding", target: 500000, current: 180000, color: "bg-pink-500" },
    { name: "House Down Payment", target: 2000000, current: 450000, color: "bg-blue-500" },
  ];
  
  return (
    <motion.div
      className="bg-white rounded-2xl p-8 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Goal-Based Savings</h3>
      
      <div className="space-y-6">
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <motion.div
              key={goal.name}
              className="p-4 border border-gray-200 rounded-xl hover:border-[#ffbf00] transition-colors duration-200 hover-lift"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${goal.color} rounded-full`}></div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                </div>
                <div className="text-sm text-gray-600">
                  {progress.toFixed(1)}% complete
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <motion.div
                  className={`h-2 rounded-full ${goal.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                ></motion.div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">₹{goal.current.toLocaleString('en-IN')}</span>
                <span className="font-medium text-gray-900">₹{goal.target.toLocaleString('en-IN')}</span>
              </div>
            </motion.div>
          );
        })}
        
        <Button className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white interactive-button">
          <Target className="w-4 h-4 mr-2" />
          Create New Goal
        </Button>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection({ onNavigateToCalculator }: FeaturesSectionProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: Zap,
      title: "Auto-Save Features",
      description: "Automate your savings with round-ups, salary day investments, and smart triggers.",
      component: AutoSaveFeature,
    },
    {
      icon: Zap,
      title: "Auto-Save Features",
      description: "Automate your savings with round-ups, salary day investments, and smart triggers.",
      component: AutoSaveFeature,
    },
    {
      icon: Target,
      title: "Goal-Based Savings",
      description: "Set financial goals and track your progress with dedicated savings buckets.",
      component: GoalBasedSavings,
    },
  ];
  
  const ActiveComponent = features[activeFeature].component;
  
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center bg-[#fff8dc] text-[#b38200] px-4 py-2 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools and features designed to help you build wealth systematically and achieve your financial goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </div>
          
          {/* Active Feature Display */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}