"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Fingerprint, Smartphone, Server, CheckCircle, AlertTriangle, Key, Globe, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface SecurityCenterProps {
  onBack: () => void;
}

const SecurityFeature = ({ icon: Icon, title, description, status, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 interactive-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="flex items-start justify-between mb-4">
      <motion.div
        className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-xl flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <Badge className={`${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
        {status === 'active' ? 'Active' : 'Implemented'}
      </Badge>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const CertificationCard = ({ title, description, badge, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-lg">{badge}</span>
      </div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

const BestPractice = ({ title, description, delay = 0 }) => (
  <motion.div
    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function SecurityCenter({ onBack }: SecurityCenterProps) {
  const securityFeatures = [
    {
      icon: Lock,
      title: "256-bit SSL Encryption",
      description: "All data transmission is protected with bank-grade SSL encryption, ensuring your information remains secure during every transaction.",
      status: "active"
    },
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: "Secure your account with fingerprint and face recognition technology for seamless yet robust access control.",
      status: "active"
    },
    {
      icon: Smartphone,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with SMS or app-based 2FA to protect your account from unauthorized access.",
      status: "active"
    },
    {
      icon: Server,
      title: "Secure Cloud Infrastructure",
      description: "Your data is stored in highly secure, ISO 27001 certified data centers with multiple redundancy layers.",
      status: "implemented"
    },
    {
      icon: Eye,
      title: "24/7 Fraud Monitoring",
      description: "Our AI-powered systems continuously monitor transactions for suspicious activities and alert you instantly.",
      status: "active"
    },
    {
      icon: Key,
      title: "Hardware Security Modules",
      description: "Cryptographic keys are protected using industry-standard Hardware Security Modules (HSMs).",
      status: "implemented"
    }
  ];

  const certifications = [
    {
      title: "ISO 27001 Certified",
      description: "International standard for information security management systems",
      badge: "ISO"
    },
    {
      title: "PCI DSS Compliant",
      description: "Payment Card Industry Data Security Standard compliance",
      badge: "PCI"
    },
    {
      title: "RBI Guidelines",
      description: "Fully compliant with Reserve Bank of India regulations",
      badge: "RBI"
    },
    {
      title: "SEBI Registered",
      description: "Securities and Exchange Board of India registration",
      badge: "SEBI"
    }
  ];

  const bestPractices = [
    {
      title: "Use Strong Passwords",
      description: "Create unique passwords with a mix of letters, numbers, and special characters. Avoid using the same password across multiple platforms."
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Always enable 2FA on your account for an additional layer of security beyond just your password."
    },
    {
      title: "Keep App Updated",
      description: "Regularly update the FipMoney app to ensure you have the latest security patches and features."
    },
    {
      title: "Monitor Account Activity",
      description: "Regularly check your account statements and transaction history. Report any suspicious activity immediately."
    },
    {
      title: "Secure Network Usage",
      description: "Avoid using public Wi-Fi for financial transactions. Use trusted networks or mobile data when possible."
    },
    {
      title: "Logout After Use",
      description: "Always log out of your account when using shared or public devices to prevent unauthorized access."
    }
  ];

  const securityStats = [
    { label: "Uptime", value: "99.99%" },
    { label: "Security Incidents", value: "0" },
    { label: "Data Breaches", value: "0" },
    { label: "Encrypted Transactions", value: "100%" }
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
              <Shield className="w-5 h-5 text-[#ffbf00]" />
              <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
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
              Your Security is Our{" "}
              <span className="gradient-text">Top Priority</span>
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              We employ multiple layers of security to protect your investments and personal information. 
              Learn about our comprehensive security measures and best practices.
            </motion.p>

            {/* Security Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {securityStats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#ffbf00] mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Advanced Security Features</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multi-layered security architecture designed to protect your digital gold investments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <SecurityFeature
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Certifications & Compliance</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We maintain the highest industry standards and regulatory compliance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <CertificationCard
                key={cert.title}
                title={cert.title}
                description={cert.description}
                badge={cert.badge}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Security Best Practices</h3>
              <p className="text-lg text-gray-600 mb-8">
                Follow these guidelines to keep your account secure and protect your investments.
              </p>

              <div className="space-y-4">
                {bestPractices.map((practice, index) => (
                  <BestPractice
                    key={practice.title}
                    title={practice.title}
                    description={practice.description}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Security Alert */}
              <Card className="p-6 border-l-4 border-red-500 bg-red-50">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Important Security Notice</h4>
                    <p className="text-red-800 text-sm leading-relaxed">
                      FipMoney will never ask for your password, PIN, or OTP over phone, email, or SMS. 
                      If you receive such requests, do not share your credentials and report it to us immediately.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contact Security Team */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Report Security Issues</h4>
                <p className="text-gray-600 mb-6">
                  If you notice any suspicious activity or have security concerns, contact our security team immediately.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-[#ffbf00]" />
                    <span className="text-gray-700">security@fipmoney.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-[#ffbf00]" />
                    <span className="text-gray-700">+91 94918 41941</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white interactive-button">
                  Report Security Issue
                </Button>
              </Card>

              {/* Security Resources */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Security Resources</h4>
                <div className="space-y-3">
                  <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-[#ffbf00] transition-colors">
                    <Globe className="w-4 h-4" />
                    <span>Security Guidelines PDF</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-[#ffbf00] transition-colors">
                    <Globe className="w-4 h-4" />
                    <span>Account Security Checklist</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-[#ffbf00] transition-colors">
                    <Globe className="w-4 h-4" />
                    <span>Fraud Prevention Tips</span>
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}