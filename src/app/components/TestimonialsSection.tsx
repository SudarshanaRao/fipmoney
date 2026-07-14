"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const testimonials = [
  {
    id: 1,
    name: "Chaitanya ",
    title: "Digital Marketing Head, Hyderabad",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&face=center&auto=format",
    rating: 5,
    text: "FipMoney has completely changed how I save and invest. The automatic SIP feature means I'm consistently building wealth without even thinking about it. Already saved 15 grams of gold in just 8 months!",
    goldSaved: "15g",
    duration: "8 months",
  },
  {
    id: 2,
    name: "Rahul Gupta",
    title: "Marketing Manager, Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face=center&auto=format",
    rating: 5,
    text: "The goal-based savings feature is fantastic! I set up a goal for my daughter's education and the app automatically calculates how much I need to save monthly. The returns have been impressive too.",
    goldSaved: "8.5g",
    duration: "5 months",
  },
  {
    id: 3,
    name: "Anita Patel",
    title: "Doctor, Bangalore",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&face=center&auto=format",
    rating: 5,
    text: "As a busy professional, I love how simple and secure FipMoney is. The round-up feature saves my spare change automatically, and I've already accumulated more gold than I expected. Highly recommended!",
    goldSaved: "12g",
    duration: "6 months",
  },
  {
    id: 4,
    name: "Vikram Singh",
    title: "Business Owner, Pune",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face=center&auto=format",
    rating: 5,
    text: "I've been investing in gold for years, but FipMoney made it so much easier. The instant buy/sell feature and transparent pricing give me confidence. Perfect for long-term wealth building.",
    goldSaved: "25g",
    duration: "1 year",
  },
  {
    id: 5,
    name: "Meera Krishnan",
    title: "Teacher, Chennai",
    avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop&face=center&auto=format",
    rating: 5,
    text: "The customer support is excellent and the app is so user-friendly. I started with just ₹100 per month and now I'm investing ₹5000 monthly. Gold prices have been favorable and my portfolio is growing steadily.",
    goldSaved: "18g",
    duration: "10 months",
  },
];

const TestimonialCard = ({ testimonial, isActive }) => (
  <motion.div
    className={`bg-white rounded-2xl p-8 shadow-xl border-2 transition-all duration-300 ${
      isActive ? 'border-[#ffbf00]' : 'border-transparent'
    }`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5 }}
  >
    {/* Quote Icon */}
    <motion.div
      className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mb-6"
      initial={{ rotate: -180, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Quote className="w-6 h-6 text-white" />
    </motion.div>

    {/* Stars */}
    <div className="flex items-center mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <Star className="w-5 h-5 text-[#ffbf00] fill-current" />
        </motion.div>
      ))}
    </div>

    {/* Testimonial Text */}
    <motion.p
      className="text-gray-700 text-lg leading-relaxed mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      "{testimonial.text}"
    </motion.p>

    {/* Stats */}
    <motion.div
      className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-[#fff8dc] to-[#ffe485] rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-center">
        <div className="text-xl font-bold text-[#b38200]">{testimonial.goldSaved}</div>
        <div className="text-sm text-gray-600">Gold Saved</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-[#b38200]">{testimonial.duration}</div>
        <div className="text-sm text-gray-600">Journey</div>
      </div>
    </motion.div>

    {/* User Info */}
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="relative">
        <ImageWithFallback
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover ring-4 ring-[#ffbf00]/20"
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.title}</p>
      </div>
    </motion.div>
  </motion.div>
);

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="testimonials">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#ffbf00] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#ffd152] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
            Happy Customers
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who are building wealth with digital gold investments.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <AnimatePresence mode="wait">
              <TestimonialCard
                key={currentIndex}
                testimonial={testimonials[currentIndex]}
                isActive={true}
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border-2 border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -right-6">
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border-2 border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#ffbf00] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { value: "10L+", label: "Happy Users" },
              { value: "4.9/5", label: "App Rating" },
              { value: "₹500Cr+", label: "Gold Invested" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 bg-gradient-to-r from-[#fff8dc] to-[#ffe485] rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl font-bold text-[#b38200] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}