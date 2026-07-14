"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

interface FooterProps {
  onNavigate?: (page: 'home' | 'terms' | 'privacy' | 'about' | 'careers' | 'help' | 'contact' | 'security' | 'press' | 'blog' | 'investors' | 'risk' | 'grievance' | 'investor-charter' | 'gold-sip-calculator') => void;
}

const FooterSection = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </motion.div>
);

const FooterLink = ({ href, children, external = false, onClick }) => (
  <motion.a
    href={href}
    className="text-gray-600 hover:text-[#ffbf00] transition-colors duration-200 block py-1 cursor-pointer hover-gold"
    target={external ? "_blank" : "_self"}
    rel={external ? "noopener noreferrer" : ""}
    onClick={onClick}
  >
    {children}
  </motion.a>
);

const SocialIcon = ({ Icon, href, delay = 0 }) => (
  <motion.a
    href={href}
    className="w-10 h-10 bg-gray-100 hover:bg-[#ffbf00] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group hover-scale magnetic"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ rotate: 360 }}
    viewport={{ once: true }}
  >
    <Icon className="w-5 h-5" />
  </motion.a>
);

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page as any);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200" id="contact">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              className="flex items-center space-x-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={fipMoneyLogo}
                alt="FipMoney Logo"
                className="h-14 w-auto object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="text-2xl font-bold text-gray-900"
                whileHover={{ color: "#ffbf00" }}
                transition={{ duration: 0.3 }}
              >
                FipMoney
              </motion.span>
            </motion.div>
            
            <motion.p
              className="text-gray-600 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              India's first digital gold SIP platform. Build wealth systematically with automated gold investments starting from just ₹1. Serving customers across India from our Hyderabad headquarters.
            </motion.p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.div
                className="flex items-center space-x-3 text-gray-600 hover-lift"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Mail className="w-4 h-4 text-[#ffbf00]" />
                <span>support@fipmoney.com</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 text-gray-600 hover-lift"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Phone className="w-4 h-4 text-[#ffbf00]" />
                <span>+91 98765 43210</span>
              </motion.div>
              <motion.div
                className="flex items-start space-x-3 text-gray-600 hover-lift"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <MapPin className="w-4 h-4 text-[#ffbf00] mt-1 flex-shrink-0" />
                <span>#709, Gowra FountainHead, HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081</span>
              </motion.div>
            </div>
          </div>

          {/* Products */}
          <FooterSection title="Products" delay={0.1}>
            <div className="space-y-2">
              <FooterLink href="#features">Digital Gold SIP</FooterLink>
              <FooterLink href="#features">Goal-Based Savings</FooterLink>
              <FooterLink href="#features">Auto-Save Features</FooterLink>
              <FooterLink href="/gold-sip-calculator" onClick={handleLinkClick('gold-sip-calculator')}>SIP Calculator</FooterLink>
              <FooterLink href="#features">Gold Vault</FooterLink>
            </div>
          </FooterSection>

          {/* Company */}
          <FooterSection title="Company" delay={0.2}>
            <div className="space-y-2">
              <FooterLink href="/about" onClick={handleLinkClick('about')}>About Us</FooterLink>
              <FooterLink href="/careers" onClick={handleLinkClick('careers')}>Careers</FooterLink>
              <FooterLink href="/press" onClick={handleLinkClick('press')}>Press</FooterLink>
              <FooterLink href="/blog" onClick={handleLinkClick('blog')}>Blog</FooterLink>
              <FooterLink href="/investors" onClick={handleLinkClick('investors')}>Investors</FooterLink>
            </div>
          </FooterSection>

          {/* Support */}
          <FooterSection title="Support" delay={0.3}>
            <div className="space-y-2">
              <FooterLink href="/help" onClick={handleLinkClick('help')}>Help Center</FooterLink>
              <FooterLink href="/contact" onClick={handleLinkClick('contact')}>Contact Us</FooterLink>
              <FooterLink href="/security" onClick={handleLinkClick('security')}>Security</FooterLink>
            </div>
          </FooterSection>
        </div>

        {/* Legal Links */}
        <motion.div
          className="border-t border-gray-200 pt-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
            <FooterLink href="/privacy" onClick={handleLinkClick('privacy')}>Privacy Policy</FooterLink>
            <FooterLink href="/terms" onClick={handleLinkClick('terms')}>Terms & Conditions</FooterLink>
            <FooterLink href="/risk" onClick={handleLinkClick('risk')}>Risk Disclosure</FooterLink>
            <FooterLink href="/grievance" onClick={handleLinkClick('grievance')}>Grievance Policy</FooterLink>
            <FooterLink href="/investor-charter" onClick={handleLinkClick('investor-charter')}>Investor Charter</FooterLink>
          </div>

          {/* Regulatory Info */}
          <div className="text-sm text-gray-500 leading-relaxed">
            <p className="mb-2">
              FipMoney is a trademark of FipMoney Technologies Private Limited. Digital gold is sourced from MMTC-PAMP India Pvt Ltd and stored in highly secure vaults.
            </p>
            <p>
              SEBI Registration: INZ000123456 | Mutual Fund Distributor ARN: 12345 | Insurance Broking License: 123456789
            </p>
          </div>
        </motion.div>

        {/* Social Media & Awards */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Social Media */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Follow us:</span>
            <div className="flex items-center gap-3">
              <SocialIcon Icon={Facebook} href="https://facebook.com/fipmoney" delay={0.1} />
              <SocialIcon Icon={Twitter} href="https://twitter.com/fipmoney" delay={0.2} />
              <SocialIcon Icon={Instagram} href="https://instagram.com/fipmoney" delay={0.3} />
              <SocialIcon Icon={Linkedin} href="https://linkedin.com/company/fipmoney" delay={0.4} />
              <SocialIcon Icon={Youtube} href="https://youtube.com/fipmoney" delay={0.5} />
            </div>
          </div>

          {/* Awards & Certifications */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { icon: "★", label: "Best Gold App 2024" },
              { icon: "ISO", label: "ISO 27001 Certified" },
              { icon: "SSL", label: "256-bit SSL" },
            ].map((award, index) => (
              <motion.div
                key={award.label}
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mb-2 hover-glow">
                  <span className="text-white font-bold text-sm">{award.icon}</span>
                </div>
                <div className="text-xs text-gray-600">{award.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="text-center pt-8 border-t border-gray-200 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500">
            © {currentYear} FipMoney Technologies Private Limited. All rights reserved.
            <motion.span
              className="inline-block ml-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              ✨
            </motion.span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}