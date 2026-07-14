"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, BookOpen, TrendingUp, Coins, CreditCard, Calculator, Shield, Users, Clock, Filter, Star, ArrowRight, ChevronRight, Zap, Target, PieChart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface HowTosProps {
  onBack: () => void;
  onNavigateToGuide: (guideId: string) => void;
}

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  featured: boolean;
  publishedDate: string;
  views: string;
}

const categories = [
  {
    id: 'all',
    name: 'All Guides',
    icon: BookOpen,
    color: 'from-gray-500 to-gray-600',
    count: 24
  },
  {
    id: 'gold-investment',
    name: 'Gold Investment',
    icon: Coins,
    color: 'from-[#ffbf00] to-[#ffd152]',
    count: 8
  },
  {
    id: 'sip-planning',
    name: 'SIP Planning',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600',
    count: 6
  },
  {
    id: 'loans',
    name: 'Loans & Credit',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    count: 5
  },
  {
    id: 'calculators',
    name: 'Using Calculators',
    icon: Calculator,
    color: 'from-purple-500 to-purple-600',
    count: 3
  },
  {
    id: 'security',
    name: 'Security & Safety',
    icon: Shield,
    color: 'from-red-500 to-red-600',
    count: 2
  }
];

const articles: Article[] = [
  // Gold Investment Guides
  {
    id: '1',
    title: 'How to Start Your Digital Gold Investment Journey',
    description: 'A complete beginner\'s guide to investing in digital gold, understanding market dynamics, and building a strong foundation for wealth creation.',
    category: 'gold-investment',
    readTime: '8 min read',
    difficulty: 'Beginner',
    tags: ['Digital Gold', 'Investment Basics', 'Wealth Building'],
    featured: true,
    publishedDate: '2024-01-15',
    views: '12.5K'
  },
  {
    id: '2',
    title: 'Gold SIP vs Regular SIP: Which is Better?',
    description: 'Compare the benefits of Gold SIP with traditional mutual fund SIPs and learn when to choose each investment option.',
    category: 'gold-investment',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    tags: ['Gold SIP', 'Comparison', 'Investment Strategy'],
    featured: false,
    publishedDate: '2024-01-10',
    views: '8.2K'
  },
  {
    id: '3',
    title: 'Understanding Gold Price Movements and Market Trends',
    description: 'Learn how to analyze gold price patterns, understand market factors, and make informed investment decisions.',
    category: 'gold-investment',
    readTime: '10 min read',
    difficulty: 'Advanced',
    tags: ['Market Analysis', 'Price Trends', 'Technical Analysis'],
    featured: false,
    publishedDate: '2024-01-08',
    views: '15.1K'
  },
  {
    id: '4',
    title: 'Digital Gold vs Physical Gold: Complete Comparison',
    description: 'Explore the differences between digital and physical gold investments, including costs, storage, and liquidity factors.',
    category: 'gold-investment',
    readTime: '7 min read',
    difficulty: 'Beginner',
    tags: ['Digital Gold', 'Physical Gold', 'Investment Options'],
    featured: true,
    publishedDate: '2024-01-05',
    views: '18.7K'
  },

  // SIP Planning Guides
  {
    id: '5',
    title: 'How to Calculate Your Ideal SIP Amount',
    description: 'Learn the step-by-step process to determine the right SIP amount based on your financial goals and income.',
    category: 'sip-planning',
    readTime: '5 min read',
    difficulty: 'Beginner',
    tags: ['SIP Planning', 'Financial Goals', 'Budget Planning'],
    featured: false,
    publishedDate: '2024-01-12',
    views: '9.8K'
  },
  {
    id: '6',
    title: 'Step-Up SIP Strategy: Maximize Your Returns',
    description: 'Discover how to use step-up SIP to accelerate wealth creation and align investments with salary increments.',
    category: 'sip-planning',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    tags: ['Step-Up SIP', 'Wealth Creation', 'Investment Strategy'],
    featured: true,
    publishedDate: '2024-01-07',
    views: '11.3K'
  },
  {
    id: '7',
    title: 'SIP Timing: When to Start and Stop Your Investments',
    description: 'Master the art of SIP timing with market cycles, economic indicators, and personal financial milestones.',
    category: 'sip-planning',
    readTime: '9 min read',
    difficulty: 'Advanced',
    tags: ['Market Timing', 'Investment Cycles', 'Strategy'],
    featured: false,
    publishedDate: '2024-01-03',
    views: '7.6K'
  },

  // Loans & Credit Guides
  {
    id: '8',
    title: 'How to Apply for Gold Loan in 5 Simple Steps',
    description: 'Get instant liquidity against your gold with our easy step-by-step guide to gold loan application process.',
    category: 'loans',
    readTime: '4 min read',
    difficulty: 'Beginner',
    tags: ['Gold Loan', 'Instant Loan', 'Application Process'],
    featured: true,
    publishedDate: '2024-01-14',
    views: '14.2K'
  },
  {
    id: '9',
    title: 'Understanding Interest Rates and EMI Calculations',
    description: 'Learn how loan interest rates work, calculate EMIs, and choose the best repayment options for your needs.',
    category: 'loans',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    tags: ['Interest Rates', 'EMI Calculation', 'Loan Planning'],
    featured: false,
    publishedDate: '2024-01-11',
    views: '6.9K'
  },
  {
    id: '10',
    title: 'Credit Score Impact on Loan Approval',
    description: 'Understand how your credit score affects loan approvals and learn tips to improve your creditworthiness.',
    category: 'loans',
    readTime: '6 min read',
    difficulty: 'Beginner',
    tags: ['Credit Score', 'Loan Approval', 'Financial Health'],
    featured: false,
    publishedDate: '2024-01-09',
    views: '10.4K'
  },

  // Calculator Guides
  {
    id: '11',
    title: 'How to Use FipMoney\'s SIP Calculator Effectively',
    description: 'Master all features of our SIP calculator to plan your investments and achieve your financial goals.',
    category: 'calculators',
    readTime: '5 min read',
    difficulty: 'Beginner',
    tags: ['SIP Calculator', 'Investment Planning', 'Financial Tools'],
    featured: false,
    publishedDate: '2024-01-13',
    views: '8.7K'
  },
  {
    id: '12',
    title: 'Gold Loan Calculator: Plan Your Borrowing',
    description: 'Learn to use our gold loan calculator to estimate loan amounts, interest rates, and repayment schedules.',
    category: 'calculators',
    readTime: '4 min read',
    difficulty: 'Beginner',
    tags: ['Gold Loan Calculator', 'Loan Planning', 'Financial Tools'],
    featured: false,
    publishedDate: '2024-01-06',
    views: '5.3K'
  },

  // Security Guides
  {
    id: '13',
    title: 'Keeping Your FipMoney Account Secure',
    description: 'Essential security practices to protect your digital gold investments and personal financial information.',
    category: 'security',
    readTime: '6 min read',
    difficulty: 'Beginner',
    tags: ['Account Security', 'Digital Safety', 'Privacy Protection'],
    featured: false,
    publishedDate: '2024-01-04',
    views: '7.1K'
  },
  {
    id: '14',
    title: 'Understanding Digital Gold Storage and Insurance',
    description: 'Learn how your digital gold is stored securely and protected with comprehensive insurance coverage.',
    category: 'security',
    readTime: '5 min read',
    difficulty: 'Intermediate',
    tags: ['Digital Storage', 'Insurance', 'Asset Protection'],
    featured: false,
    publishedDate: '2024-01-02',
    views: '4.8K'
  }
];

export default function HowTos({ onBack, onNavigateToGuide }: HowTosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(articles);

  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory]);

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gold-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">FipMoney How To's</h1>
                  <p className="text-gray-600">Learn everything about gold investment and financial planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Search and Filter Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search how-to guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 focus:border-[#ffbf00] focus:ring-[#ffbf00] rounded-xl"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-6 h-6 text-[#ffbf00]" />
                <h2 className="text-2xl font-bold text-gray-900">Featured Guides</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Card className="bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-[#ffbf00] transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{article.views} views</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white"
                            onClick={() => onNavigateToGuide(article.id)}
                          >
                            Read Guide
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Articles */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'All Guides' : categories.find(cat => cat.id === selectedCategory)?.name}
              </h2>
              <div className="text-gray-500">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'guide' : 'guides'} found
              </div>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {regularArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.01 }}
                    className="group"
                  >
                    <Card className="bg-white shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 bg-gradient-to-r ${
                              categories.find(cat => cat.id === article.category)?.color || 'from-gray-500 to-gray-600'
                            } rounded-lg flex items-center justify-center`}>
                              {(() => {
                                const category = categories.find(cat => cat.id === article.category);
                                const IconComponent = category?.icon || BookOpen;
                                return <IconComponent className="w-6 h-6 text-white" />;
                              })()}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ffbf00] transition-colors duration-300 line-clamp-2">
                                {article.title}
                              </h3>
                              <Badge className={getDifficultyColor(article.difficulty)} variant="secondary">
                                {article.difficulty}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{article.readTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{article.views} views</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white"
                                onClick={() => onNavigateToGuide(article.id)}
                              >
                                Read Guide
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Ready to Start Your Investment Journey?</h2>
                  <p className="text-white/90">Access our powerful calculators and tools to plan your financial future</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">SIP Calculator</h3>
                    <p className="text-sm text-white/80 mb-4">Plan your systematic investments</p>
                    <Button size="sm" variant="secondary" className="bg-white text-[#ffbf00] hover:bg-gray-100">
                      Try Now
                    </Button>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Gold SIP Calculator</h3>
                    <p className="text-sm text-white/80 mb-4">Calculate gold investment returns</p>
                    <Button size="sm" variant="secondary" className="bg-white text-[#ffbf00] hover:bg-gray-100">
                      Calculate
                    </Button>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Gold Loan Calculator</h3>
                    <p className="text-sm text-white/80 mb-4">Get instant loan estimates</p>
                    <Button size="sm" variant="secondary" className="bg-white text-[#ffbf00] hover:bg-gray-100">
                      Estimate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Categories Overview */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(cat => cat.id !== 'all').map((category) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Card className="bg-white shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#ffbf00] transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {category.count} {category.count === 1 ? 'guide' : 'guides'} available
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white group-hover:scale-105 transition-all duration-300"
                          >
                            Explore Guides
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}