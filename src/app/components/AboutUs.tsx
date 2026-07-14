"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Users, Target, Award, Heart, Lightbulb, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AboutUsProps {
  onBack: () => void;
}

const ValueCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 interactive-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.div
      className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-xl flex items-center justify-center mb-4"
      whileHover={{ scale: 1.1, rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-6 h-6 text-white" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const TeamMember = ({ name, role, image, delay = 0 }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.div
      className="relative mb-4 mx-auto"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-[#ffbf00] shadow-lg">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
    </motion.div>
    <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
    <p className="text-[#ffbf00] text-sm">{role}</p>
  </motion.div>
);

const StatCard = ({ number, label, delay = 0 }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.div
      className="text-3xl md:text-4xl font-bold text-[#ffbf00] mb-2"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ delay: delay + 0.2, duration: 0.5, type: "spring" }}
      viewport={{ once: true }}
    >
      {number}
    </motion.div>
    <div className="text-gray-600">{label}</div>
  </motion.div>
);

export default function AboutUs({ onBack }: AboutUsProps) {
  const values = [
    {
      icon: Target,
      title: "Mission Driven",
      description: "To democratize gold investment and make wealth building accessible to every Indian family through innovative digital solutions."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the highest standards of security and transparency, ensuring your investments are protected with bank-grade encryption."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "Continuously developing cutting-edge features and tools to enhance your investment experience and financial growth."
    },
    {
      icon: Heart,
      title: "Customer Centric",
      description: "Every decision we make is guided by our commitment to providing exceptional service and support to our valued customers."
    }
  ];

  const team = [
    { name: "Rajesh Kumar", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&face=center&auto=format" },
    { name: "Priya Sharma", role: "CTO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&face=center&auto=format" },
    { name: "Amit Patel", role: "Head of Product", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&face=center&auto=format" },
    { name: "Sneha Reddy", role: "Head of Operations", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&face=center&auto=format" }
  ];

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
              <Users className="w-5 h-5 text-[#ffbf00]" />
              <h1 className="text-2xl font-bold text-gray-900">About FipMoney</h1>
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
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Revolutionizing{" "}
              <span className="gradient-text">Digital Gold</span>{" "}
              Investment in India
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Founded in 2022, FipMoney is India's first comprehensive digital gold SIP platform, 
              dedicated to making gold investment accessible, secure, and profitable for everyone. 
              We combine traditional investment wisdom with modern technology to help you build lasting wealth.
            </motion.p>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <StatCard number="3L+" label="Happy Users" delay={0} />
              <StatCard number="₹725Cr" label="Assets Under Management" delay={0.1} />
              <StatCard number="41.2T" label="Gold Secured" delay={0.2} />
              <StatCard number="4.9★" label="User Rating" delay={0.3} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  FipMoney was born from a simple observation: despite gold being India's most trusted 
                  investment, the process of buying, storing, and managing gold investments remained 
                  complicated and expensive for the average investor.
                </p>
                <p>
                  Our founders, experienced professionals from the fintech and precious metals industry, 
                  envisioned a platform that would combine the security and growth potential of gold 
                  with the convenience of modern digital banking.
                </p>
                <p>
                  Today, we're proud to serve over 3 lakh users across India, helping them build 
                  wealth systematically through our innovative SIP platform, goal-based savings, 
                  and comprehensive gold investment solutions.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://static.vecteezy.com/system/resources/previews/007/692/124/non_2x/people-concept-illustration-of-our-team-management-about-us-for-graphic-and-web-design-business-presentation-and-marketing-material-vector.jpg"
                  alt="FipMoney team illustration"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-[#ffbf00]" />
                  <div>
                    <div className="font-semibold text-gray-900">Best Fintech</div>
                    <div className="text-sm text-gray-600">Startup 2024</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every solution we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the visionaries behind FipMoney's success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((member, index) => (
              <TeamMember
                key={member.name}
                name={member.name}
                role={member.role}
                image={member.image}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">Join Our Growing Community</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Be part of India's largest digital gold investment platform and start building your wealth today
            </p>
            <Button
              size="lg"
              className="bg-white text-[#ffbf00] hover:bg-gray-100 px-8 py-6 text-lg interactive-button"
            >
              Start Investing Now
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}