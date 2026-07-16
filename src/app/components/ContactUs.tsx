"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageCircle, Headphones, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { useFipModal } from "./FipModal";

interface ContactUsProps {
  onBack: () => void;
}

const ContactCard = ({ icon: Icon, title, description, value, delay = 0 }) => (
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
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <p className="font-medium text-[#ffbf00]">{value}</p>
  </motion.div>
);

const FAQItem = ({ question, answer, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-lg"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h4 className="font-semibold text-gray-900 mb-3">{question}</h4>
    <p className="text-gray-600 leading-relaxed">{answer}</p>
  </motion.div>
);

export default function ContactUs({ onBack }: ContactUsProps) {
  const { showAlert, ModalComponent } = useFipModal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: ''
    });

    showAlert("Thank you for your message! We'll get back to you within 24 hours.", "success", "Message Sent");
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our customer support team",
      value: "+91 94918 41941"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries and we'll respond quickly",
      value: "support@fipmoney.com"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through our live chat feature",
      value: "Available 24/7"
    },
    {
      icon: Headphones,
      title: "WhatsApp Support",
      description: "Connect with us on WhatsApp for quick assistance",
      value: "+91 94918 41941"
    }
  ];

  const offices = [
    {
      city: "Hyderabad (Head Office)",
      address: "#709, Gowra FountainHead, Huda techno Enclave, Hitec City, Hyderabad 500081",
      phone: "+91 94918 41941",
      email: "support@fipmoney.com"
    }
  ];

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our phone support line."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please include your account details (if applicable), a clear description of your issue or question, and any relevant screenshots or documents."
    },
    {
      question: "Can I schedule a call with your team?",
      answer: "Yes! You can request a callback through our contact form, and our team will reach out to schedule a convenient time for you."
    },
    {
      question: "Do you provide support in regional languages?",
      answer: "Currently, we provide support in English and Hindi. We're working on expanding our language support to include other regional languages."
    }
  ];

  return (
    <>
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
              <MessageCircle className="w-5 h-5 text-[#ffbf00]" />
              <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
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
              We're Here to{" "}
              <span className="gradient-text">Help You</span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Have questions about digital gold investment? Need support with your account?
              Our dedicated team is ready to assist you with anything you need.
            </motion.p>

            {/* Business Hours */}
            <motion.div
              className="inline-flex items-center bg-white rounded-2xl p-4 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Clock className="w-5 h-5 text-[#ffbf00] mr-3" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Business Hours</div>
                <div className="text-sm text-gray-600">Mon - Fri: 9 AM - 7 PM | Sat: 10 AM - 4 PM</div>
              </div>
            </motion.div>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <ContactCard
                key={method.title}
                icon={method.icon}
                title={method.title}
                description={method.description}
                value={method.value}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Offices */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 94918 41941"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Category
                      </label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Support</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="investment">Investment Guidance</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief description of your inquiry"
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide detailed information about your inquiry..."
                      required
                      className="min-h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white h-12 interactive-button"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Office</h3>

                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <motion.div
                      key={office.city}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">{office.city}</h4>

                      <div className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-[#ffbf00] mt-1 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{office.address}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-[#ffbf00]" />
                          <span className="text-gray-600 text-sm">{office.phone}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-[#ffbf00]" />
                          <span className="text-gray-600 text-sm">{office.email}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about contacting our support team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
    {ModalComponent}
    </>
  );
}