"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, ArrowRight, Search, TrendingUp, BookOpen, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BlogProps {
  onBack: () => void;
}

const BlogCard = ({ post, featured = false, delay = 0 }) => (
  <motion.article
    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 interactive-card overflow-hidden ${
      featured ? 'md:col-span-2 lg:col-span-3' : ''
    }`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className={`${featured ? 'md:flex' : ''}`}>
      <div className={`relative ${featured ? 'md:w-1/2' : ''}`}>
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className={`w-full object-cover ${featured ? 'h-64 md:h-full' : 'h-48'}`}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#ffbf00] text-white border-0">
            {post.category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500 text-white border-0">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <div className={`p-6 ${featured ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <h3 className={`font-bold text-gray-900 mb-3 ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {post.title}
        </h3>
        
        <p className={`text-gray-600 mb-4 ${featured ? 'text-lg' : 'text-sm'} leading-relaxed`}>
          {post.excerpt}
        </p>
        
        <Button
          variant="outline"
          className="self-start border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white interactive-button"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </motion.article>
);

const CategoryCard = ({ category, count, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 interactive-card cursor-pointer"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h4 className="font-semibold text-gray-900 mb-1">{category}</h4>
    <p className="text-sm text-gray-600">{count} articles</p>
  </motion.div>
);

export default function Blog({ onBack }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Digital Gold Investment in 2024",
      excerpt: "Discover everything you need to know about investing in digital gold, from benefits to strategies. Learn how to start your digital gold investment journey today.",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop&auto=format",
      category: "Investment Guide",
      author: "Priya Sharma",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 2,
      title: "Gold vs. Stock Market: Which is Better for Long-term Wealth?",
      excerpt: "A comprehensive comparison between gold and stock market investments, helping you make informed decisions for your portfolio.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&auto=format",
      category: "Market Analysis",
      author: "Rajesh Kumar",
      date: "Dec 12, 2024",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "How SIP in Gold Can Help You Beat Inflation",
      excerpt: "Learn how systematic investment plans in gold can be your shield against inflation and economic uncertainty.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&auto=format",
      category: "SIP Strategy",
      author: "Anita Patel",
      date: "Dec 10, 2024",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "Tax Benefits of Gold Investment: What You Need to Know",
      excerpt: "Understanding the tax implications and benefits of various gold investment options in India.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&auto=format",
      category: "Tax Planning",
      author: "Vikram Singh",
      date: "Dec 8, 2024",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Building an Emergency Fund with Digital Gold",
      excerpt: "Why digital gold makes an excellent emergency fund and how to build one systematically.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop&auto=format",
      category: "Financial Planning",
      author: "Meera Krishnan",
      date: "Dec 5, 2024",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Gold Price Predictions: Expert Analysis for 2025",
      excerpt: "What experts are saying about gold prices in 2025 and factors that could influence the market.",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop&auto=format",
      category: "Market Analysis",
      author: "Dr. Amit Gupta",
      date: "Dec 3, 2024",
      readTime: "9 min read"
    }
  ];

  const categories = [
    { name: "Investment Guide", count: 15 },
    { name: "Market Analysis", count: 12 },
    { name: "SIP Strategy", count: 8 },
    { name: "Tax Planning", count: 6 },
    { name: "Financial Planning", count: 10 },
    { name: "News & Updates", count: 20 }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <motion.div
      className="min-h-screen bg-white"
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
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#ffbf00]" />
              <h1 className="text-2xl font-bold text-gray-900">FipMoney Blog</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#ffbf00] rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#ffd152] rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Insights & Expert{" "}
              <span className="gradient-text">Analysis</span>
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Stay updated with the latest trends in gold investment, market analysis, 
              and expert tips to maximize your wealth building journey.
            </motion.p>

            {/* Search and Filter */}
            <motion.div
              className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.name} value={category.name.toLowerCase()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h3>
            <p className="text-gray-600">Find articles that match your interests</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category.name}
                count={category.count}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Featured Article</h3>
            <p className="text-gray-600">Our most popular and trending content</p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <BlogCard post={featuredPost} featured={true} />
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Latest Articles</h3>
            <p className="text-gray-600">Fresh insights and expert analysis</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                delay={index * 0.1}
              />
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white px-8 py-6 text-lg interactive-button">
              Load More Articles
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Get the latest insights on gold investment and financial planning delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 bg-white text-gray-900"
              />
              <Button className="bg-white text-[#ffbf00] hover:bg-gray-100 px-8 h-12 interactive-button">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}