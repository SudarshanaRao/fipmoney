"use client";

import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Shield, Eye, Lock, UserCheck, Database, FileText, Scale, Gavel, Phone, Mail, MapPin, Clock, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface PrivacyPolicyProps {
  onBack: () => void;
}

const TableOfContents = ({ onSectionClick }: { onSectionClick: (sectionId: string) => void }) => {
  const sections = [
    { id: "information-collection", title: "1. Information We Collect", number: "1" },
    { id: "automated-collection", title: "2. Automated Information Collection", number: "2" },
    { id: "information-use", title: "3. How We Use Your Information", number: "3" },
    { id: "information-sharing", title: "4. Sharing of Information", number: "4" },
    { id: "third-party-links", title: "5. Third-Party Links", number: "5" },
    { id: "security-measures", title: "6. Security Precautions", number: "6" },
    { id: "data-retention", title: "7. Data Storage and Retention", number: "7" },
    { id: "privacy-rights", title: "8. Your Privacy Rights", number: "8" },
    { id: "policy-changes", title: "9. Changes to Privacy Policy", number: "9" },
    { id: "grievance-officer", title: "10. Grievance Officer", number: "10" },
    { id: "children-privacy", title: "11. Children's Privacy", number: "11" },
    { id: "analytics", title: "12. Analytics", number: "12" },
    { id: "cookies", title: "13. Cookies Policy", number: "13" },
    { id: "contact-info", title: "14. Contact Information", number: "14" },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-8 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#fff8dc] to-[#ffbf00] rounded-2xl p-8 mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#ffbf00]" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your Privacy is Our Priority
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At FipMoney, we understand that your personal information is valuable. This Privacy Policy explains how we collect, use, protect, and share your information when you use our digital gold investment platform. We are committed to maintaining the highest standards of data protection and transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
          <p className="text-gray-600 text-sm">
            Advanced encryption and security measures to protect your personal information
          </p>
        </motion.div>

        <motion.div
          className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
          <p className="text-gray-600 text-sm">
            Clear information about what data we collect and how we use it
          </p>
        </motion.div>

        <motion.div
          className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">User Control</h3>
          <p className="text-gray-600 text-sm">
            You have control over your data with options to modify or delete information
          </p>
        </motion.div>
      </div>

      {/* Table of Contents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Table of Contents</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.02, duration: 0.3 }}
            >
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-lg flex items-center justify-center text-sm font-medium mr-3 group-hover:scale-110 transition-transform duration-200">
                {section.number}
              </span>
              <span className="text-gray-700 group-hover:text-[#ffbf00] transition-colors duration-200">
                {section.title}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.div
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-[#ffbf00]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="w-4/5 mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FipMoney Privacy Policy
            </h1>
            <p className="text-gray-600 mb-2">Last Updated: January 15, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] mx-auto rounded-full"></div>
          </div>

          {/* Table of Contents */}
          <TableOfContents onSectionClick={scrollToSection} />

          {/* Main Privacy Policy Content */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Important Notice */}
            <motion.div
              className="bg-[#fff8dc] border border-[#ffd152] rounded-xl p-6 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-semibold text-[#b38200] mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Important Notice
              </h2>
              <p className="text-[#b38200] leading-relaxed mb-4">
                This privacy policy ("Privacy Policy") is incorporated by reference into the Terms and Conditions (the "Terms and Conditions" or "Terms"). Website https://www.fipmoney.com/ including its mobile application – FipMoney; (collectively referred to as the "Platform") is owned and operated by FipMoney Technologies Private Limited, ("FipMoney" "We" or "Us") and FipMoney Gold Retail Private Limited ("FipMoney Gold" or "We" or "Us") collectively referred to as the company ("Company") to provide you the services.
              </p>
              <p className="text-[#b38200] font-semibold">
                BY USING AND ACCESSING THE PLATFORM AND BY AVAILING THE SERVICES OR BY OTHERWISE GIVING US YOUR INFORMATION, YOU WILL BE DEEMED TO HAVE READ, UNDERSTOOD AND AGREED TO THE PRACTICES AND POLICIES OUTLINED IN THIS PRIVACY POLICY.
              </p>
            </motion.div>

            {/* Introduction */}
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 mb-12">
              <p>
                This Privacy Policy applies to all the Users whose Personal Information has been processed by Us in the course of our business, mobile applications, forums, blogs, and other online or offline offerings.
              </p>

              <p>
                We respect your privacy and hence handle your personal data with the utmost care and confidentiality. By visiting the Platform, You ("You" or "Your"), accept and agree to be bound by the terms and conditions of this Privacy Policy. This Privacy Policy is incorporated into and subject to the Terms and Conditions of the Platform ("Terms") and shall be read harmoniously and in conjunction with the Terms.
              </p>

              <p>
                Please read the Privacy Policy carefully prior to using or registering on the Platform or accessing/availing the services on the Platform inter alia is an online portal that facilitates the Users to purchase/sale/transfer gold and/or other precious metals in digital gold backed by gold bullions and coins with purity as mentioned ("Precious Metal") operated and managed by FipMoney Gold Retail Private Limited ("FipMoney Gold") a company incorporated under the laws of India ("Services").
              </p>

              <p>
                This Privacy Policy specifies the type of information collected from You, the manner in which personal data and other information is collected, received, stored, processed, disclosed, transferred, dealt with or otherwise handled by the Company. This Privacy Policy does not apply to information that You provide to, or that is collected by, any third-party through the Platform.
              </p>

              <p>
                This Privacy Policy is an electronic record in the form of an electronic contract formed under the Information Technology Act, 2000 and the rules made thereunder. This Privacy Policy is published in compliance with Information Technology Act, 2000, Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011 ("SPDI Rules") and regulation 3(1) of Information Technology (Intermediaries Guidelines) Rules, 2011.
              </p>
            </div>

            {/* Section 1: Information We Collect */}
            <section id="information-collection" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="w-6 h-6 mr-3 text-[#ffbf00]" />
                1. INFORMATION WE COLLECT
              </h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information and Sensitive Data</h3>
                  <p className="mb-4">
                    "Personal Information" means individually identifiable information that directly or indirectly, in combination with other information would allow the identification of a specific living person.
                  </p>
                  <p className="mb-4">
                    "Sensitive Personal Data or Information" means Your Personal Information such as financial information such as bank account details and/or any other payment instrument details, sexual orientation, any details that may have been voluntarily provided by You and any of the information received under above clauses by Us in connection with availing the Services.
                  </p>
                  <p>
                    By providing Personal Information (including Sensitive Data) to us, you consent to the collection, usage, and disclosure of Personal Information (including Sensitive Data), as permitted by applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Provided by You</h3>
                  <p className="mb-4">
                    While registering on Our Platform for using Our Services, We collect Your Personal Information including sensitive personal information such as name, mobile number, email address, password, date of birth, gender. We also collect Your personal information through the permissions we seek through the applications such as the permission to access gallery, contacts, notification SMS and location.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-6 my-6">
                    <p className="font-semibold text-blue-900 mb-3">We may collect and process the following Personal Information:</p>
                    <ul className="space-y-2 text-blue-800">
                      <li>• Information provided at registration (name, address, email, phone number, bank details)</li>
                      <li>• KYC information including Aadhaar number, PAN number, driving license</li>
                      <li>• Financial information including bank account details and payment information</li>
                      <li>• Biometric information for identity verification (live selfie)</li>
                      <li>• Device information (IMEI, operating system, hardware model)</li>
                      <li>• Communication records (emails, calls, messages)</li>
                      <li>• Transaction history and investment behavior</li>
                    </ul>
                  </div>

                  <p>
                    We use your contact information, such as your email address or phone number, to authenticate your account and keep it secure, to secure our services and to help prevent spam, fraud, and abuse. We also use contact information to personalize our Services, enable certain account features and to send you information about our Services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC and Financial Information</h3>
                  <p className="mb-4">
                    In order to provide Services to You when you purchase Gold in excess of 30 grams, We may collect your KYC information including Your Proof of identity like Aadhaar number, driving license, PAN number, finger-print details and signature solely for completing the account opening procedures and authenticating Your transactions on the Platform.
                  </p>
                  <p>
                    The act of providing Your Aadhaar is voluntary in nature and the Company hereby agrees and acknowledges that they will collect, use and store such details in compliance with applicable laws and this Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <p>
                    You may be asked for certain financial information, including Your billing address, bank account details, credit card number, expiration date and/or other payment related details or other payment method data, and debit instructions or other standing instructions to process payments for the Services. All payment processors are Payment Card Industry Data Security Standard (PCI DSS) compliant.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Automated Information Collection */}
            <section id="automated-collection" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-[#ffbf00]" />
                2. AUTOMATED INFORMATION COLLECTION
              </h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage and Log Information</h3>
                  <p className="mb-4">
                    To make our Platform and Services more useful to you, our servers collect information from you, including your browser type, operating system, Internet Protocol (IP) address, domain name, and/or a date/time of your visit. We use this information to examine our traffic and to view how our customers use our website.
                  </p>
                  <p>
                    We process this usage data to facilitate your access to our services in technical terms (e.g., to adjust our services to the terminal device you are using), and to recognize and stop any misuse. We also use usage data in anonymized form for statistical purposes and to improve our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                  <p className="mb-4">
                    When and if You download and/or use the Platform through Your mobile, We may receive information about Your location, Your IP address, and/or Your mobile device, including a unique identifier number for Your device. We may use this information to provide You with location-based Services including but not limited to, search results and other personalized content.
                  </p>
                  <p>
                    You can withdraw Your consent at any time by disabling the location-tracking functions on Your mobile. However, this may affect Your enjoyment of certain functionalities on Our Platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Third Party Information</h3>
                  <p>
                    We also collect information from third parties on the tracking technologies to track the activity on our service and hold certain information. Browser based, network based, AD-Tracking, User UX behaviour tracking information is collected from third parties. We collect information to understand and track the behavioral as means for security and connection integrity.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: How We Use Your Information */}
            <section id="information-use" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-[#ffbf00]" />
                3. HOW WE USE YOUR INFORMATION
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>We use the Personal Information and other non-Personal Information for the following purposes:</p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To provide and improve the Services on the Platform that You request</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To resolve disputes and troubleshoot problems</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To help promote a safe service on the Platform and protect the security and integrity of the Platform</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To collect money from You in relation to the Services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To inform You about online and offline offers, products, services, and updates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To customize Your experience on the Platform or share marketing material with You</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To detect, prevent and protect Us from any errors, fraud and other criminal activity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ffbf00] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>To process and fulfill Your request for Services or respond to Your comments and queries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="font-semibold text-blue-900 mb-3">Email and Mobile Integration:</p>
                  <p className="text-blue-800">
                    You may choose to provide Your explicit consent to connect/integrate Your email account(s) and/or registered mobile number with Your account on the Platform. Once connected, the Platform will securely access and analyze the emails and text messages to populate and track Your investment details and history. This integration is used solely for providing Services and improving Your experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Sharing of Information */}
            <section id="information-sharing" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-[#ffbf00]" />
                4. SHARING OF INFORMATION
              </h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  We may make Your Personal Information and/or other non-Personal Information available to Our partners, collaborators including third parties FipMoney Gold to enable them to provide the Services and any other services provided through the Platform to You.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Third Party Service Providers</h3>
                  <p className="mb-4">
                    We may disclose Your Personal Information to third party vendors, consultants, and other service providers who work for the Company, who are bound by contractual obligations to keep such personal information confidential and use it only for the purposes for which We disclose it to them.
                  </p>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <p className="font-semibold text-green-800 mb-3">This disclosure may be required for:</p>
                    <ul className="space-y-2 text-green-700">
                      <li>• Providing access to Services and processing payments</li>
                      <li>• Validation of Your bank accounts</li>
                      <li>• Facilitating marketing and advertising activities</li>
                      <li>• Undertaking auditing or data analysis</li>
                      <li>• Preventing, detecting, and investigating fraudulent activities</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Disclosure</h3>
                  <p>The Company may disclose Your information, to the extent necessary:</p>
                  <ul className="space-y-2 ml-6 mt-4">
                    <li>• To comply with laws and respond to lawful requests and legal process</li>
                    <li>• To protect the rights and property of the Company, users, and others</li>
                    <li>• In an emergency to protect the personal safety and assets of the Company, users, or any person</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="font-semibold text-yellow-800 mb-3">Important Note:</p>
                  <p className="text-yellow-700">
                    We do not disclose Your Personal Information to third parties for their marketing and advertising purposes without Your explicit consent. You specifically agree and consent to Us for transferring and sharing your sensitive personal information related to You with Our partners and service providers solely for the legitimate purpose of providing you the Services.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Third-Party Links */}
            <section id="third-party-links" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-[#ffbf00]" />
                5. THIRD-PARTY LINKS
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our Platform may link You to other third-party Platforms ("Third-Party Sites") that may collect Your Personal Information including Your IP address, browser specification, or operating system. The Company is not in any manner responsible for the security of such information or their privacy practices or content of those Third-Party Sites.
                </p>
                
                <p>
                  These third-party service providers and Third-Party Sites shall have their own privacy policies governing the storage and retention of Your information that You may be subject to. This Privacy Policy does not govern any information provided to, stored on, or used by these third-party providers and Third-Party Sites.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="font-semibold text-red-800 mb-3">Recommendation:</p>
                  <p className="text-red-700">
                    We recommend that when You enter a Third-Party Site, You review the Third-Party Site's privacy policy as it relates to safeguarding of Your information. You agree and acknowledge that We are not liable for the information published in search results or by any Third-Party Sites.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Security Precautions */}
            <section id="security-measures" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-[#ffbf00]" />
                6. SECURITY PRECAUTIONS AND MEASURES
              </h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Our Platform has reasonable security measures and safeguards in place to protect Your privacy and Personal Information from loss, misuse, unauthorized access, disclosure, destruction, and alteration of the information in compliance with applicable laws.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Measures</h3>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                        <span>Secure servers with advanced encryption technology</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                        <span>Payment information protected by encryption during transmission</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                        <span>Regular security audits and monitoring</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                        <span>Firewalls and intrusion detection systems</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
                        <span>PCI DSS compliant payment processing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Responsibilities</h3>
                  <p className="mb-4">
                    You have the obligation to ensure that You shall at all times take adequate physical, managerial, and technical safeguards at Your end to preserve the integrity and security of Your data which shall include and not be limited to Your Personal Information.
                  </p>
                  <p>
                    You play an important role in keeping Your Personal Information secure. You shall not share Your Personal Information or other security information for Your account with anyone. The Company cannot guarantee that transmissions of Your payment-related information or Personal Information will always be secure.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="font-semibold text-yellow-800 mb-3">Important Disclaimer:</p>
                  <p className="text-yellow-700">
                    The Company assumes no liability or responsibility for disclosure of Your information due to errors in transmission, unauthorized third-party access, or other causes beyond its control. However, We shall not be liable for any unauthorized or unlawful disclosures of Your personal information made by any third parties who are not subject to Our control.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Data Storage and Retention */}
            <section id="data-retention" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="w-6 h-6 mr-3 text-[#ffbf00]" />
                7. DATA STORAGE AND RETENTION POLICY
              </h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  We collect and store your data and Personal Information in AWS cloud as you use services and will retain the data for as long as necessary to fulfill the purposes for which it was obtained. Processed and non-identifiable data, however, will be perpetually stored.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Period Determination</h3>
                  <p className="mb-4">
                    To determine the appropriate retention period for Personal Data, we consider:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li>• The amount, nature, and sensitivity of the Personal Data</li>
                    <li>• The potential risk of harm from unauthorized use or disclosure</li>
                    <li>• The purposes for which we process your Personal Data</li>
                    <li>• Whether we can achieve those purposes through other means</li>
                    <li>• The applicable legal requirements</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <p className="font-semibold text-green-800 mb-3">Data Retention Policy:</p>
                  <p className="text-green-700">
                    The Company will retain your Personal Data only as long as is reasonably necessary to fulfill the purposes for which the Personal Data was collected and processed and/or in accordance with legal, regulatory, contractual or statutory obligations. At the expiry of such periods, your Personal Data will be deleted or archived in compliance with applicable laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Privacy Rights */}
            <section id="privacy-rights" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-[#ffbf00]" />
                8. YOUR PRIVACY RIGHTS
              </h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Consent</h3>
                  <p className="mb-4">
                    By visiting the Platform or setting up/creating an account on the Platform for availing the Services, You signify Your acceptance to the provisions of the Privacy Policy. You may choose to withdraw Your consent provided hereunder at any point in time.
                  </p>
                  <p>
                    Such withdrawal of consent must be sent in writing to support@fipmoney.com. In case You do not provide Your consent or later withdraw Your consent, we request you not to access the Platform and/or use the Services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Access and Modification</h3>
                  <p className="mb-4">
                    You have every right to edit, modify, review or delete any information including Sensitive Personal Information provided to us. If your Personal Information or Sensitive Data changes, you may correct, delete inaccuracies, or amend information by reaching out to us at support@fipmoney.com.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="font-semibold text-blue-800 mb-3">Account Deletion:</p>
                  <p className="text-blue-700 mb-4">
                    You may request us to delete your information or revoke the consent to access or opt out of processing your application by submitting a request for account deletion through the FipMoney mobile app.
                  </p>
                  <p className="text-blue-700">
                    On submitting a request to delete Your account, you confirm that you have no outstanding credit facility availed on the FipMoney platform and no pending grievances. Your account will be permanently deleted, and you will receive no further communications from FipMoney.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Policy Changes */}
            <section id="policy-changes" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-[#ffbf00]" />
                9. CHANGES TO PRIVACY POLICY
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the unconditional right to change, modify, add, or remove portions of this Privacy Policy at any time, without specifically notifying You of such changes. Any changes or updates will be effective immediately upon posting.
                </p>
                
                <p>
                  You should review this Privacy Policy regularly for changes. Your acceptance of the amended Privacy Policy shall signify Your consent to such changes and agreement to be legally bound by the same.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="font-semibold text-yellow-800 mb-3">Notification of Changes:</p>
                  <p className="text-yellow-700">
                    In the event there are significant changes in the way we treat your Personal Information, we will display a notice on the Platform or send you an email informing you of such changes. Using the Platform after a notice of changes has been published will constitute your consent to the changed terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10: Grievance Officer */}
            <section id="grievance-officer" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-3 text-[#ffbf00]" />
                10. GRIEVANCE OFFICER
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If You have any privacy concerns, please feel free to reach out to the grievance officer. We are committed to resolving all disputes in a fair, effective and cost-efficient manner.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="font-semibold text-blue-800 mb-4">Contact Details:</p>
                  <div className="space-y-2 text-blue-700">
                    <p><strong>Name:</strong> Mr. Rajesh Kumar</p>
                    <p><strong>Email:</strong> grievance@fipmoney.com</p>
                    <p><strong>Address:</strong> 123 Business Park, Bandra Kurla Complex, Mumbai - 400051</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <p className="font-semibold text-green-800 mb-3">Response Timeline:</p>
                  <ul className="space-y-2 text-green-700">
                    <li>• Acknowledgment within 48 hours of receipt</li>
                    <li>• Resolution within 15 days from the date of receipt</li>
                    <li>• Each grievance will be provided with a complaint/ticket number for tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 11: Children's Privacy */}
            <section id="children-privacy" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-[#ffbf00]" />
                11. CHILDREN'S PRIVACY
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The Company does not knowingly collect or solicit personal information from children under the age of 18 (eighteen) and the Service or any services on the Platform and its content are not directed at children under the age of 18 (eighteen).
                </p>
                
                <p>
                  In the event that we learn that we have collected personal information from a child under the age of 18 (eighteen) without verification of parental consent, we will delete such information as quickly as possible.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="font-semibold text-red-800 mb-3">If you believe we might have information from a child under 18:</p>
                  <p className="text-red-700">
                    Please contact us immediately at grievance@fipmoney.com and we will take appropriate action to remove such information from our systems.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 12: Analytics */}
            <section id="analytics" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-[#ffbf00]" />
                12. ANALYTICS
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may use third-party service providers to monitor and analyze Your use of Our Services. These services help us understand how users interact with our Platform and improve our services accordingly.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="font-semibold text-gray-800 mb-3">Analytics Data Includes:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Page views and user interactions</li>
                    <li>• Time spent on different sections</li>
                    <li>• User journey and navigation patterns</li>
                    <li>• Device and browser information</li>
                    <li>• Performance metrics and error reporting</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 13: Cookies Policy */}
            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-[#ffbf00]" />
                13. COOKIES POLICY
              </h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  We use cookies and URL information to gather information regarding the date and time of your visit and the information for which you searched and which you viewed. Cookies are small digital signature files that are stored by your web browser that allow your preferences to be recorded when you visit the Platform.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Types of Cookies We Use</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="font-semibold text-blue-800 mb-2">Operationally Necessary</p>
                      <p className="text-blue-700">Technologies necessary for the operation of our Services, including security and authentication features.</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="font-semibold text-green-800 mb-2">Performance Related</p>
                      <p className="text-green-700">Analytics to assess the performance of our Services and understand how visitors use our Platform.</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="font-semibold text-purple-800 mb-2">Functionality Related</p>
                      <p className="text-purple-700">Enhanced functionality when accessing our Services, including preferences and user settings.</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="font-semibold text-orange-800 mb-2">Advertising Related</p>
                      <p className="text-orange-700">Deliver content and ads relevant to your interests on our Services or third-party sites.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="font-semibold text-yellow-800 mb-3">Cookie Control:</p>
                  <p className="text-yellow-700">
                    If you would like to opt-out of the technologies we employ on our Platform, you may do so by blocking, deleting, or disabling them as your browser or device permits. However, this may affect your ability to use some features of our Platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact-info" className="mb-12">
              <div className="p-8 bg-gradient-to-r from-[#fff8dc] to-[#ffbf00] rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Email Support
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>General Support:</strong> support@fipmoney.com</p>
                      <p><strong>Privacy Concerns:</strong> privacy@fipmoney.com</p>
                      <p><strong>Grievances:</strong> grievance@fipmoney.com</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Office Details
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Phone:</strong> +91 98765 43210</p>
                      <p><strong>Address:</strong> 123 Business Park, Bandra Kurla Complex, Mumbai - 400051</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Notice */}
            <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
              <p>© 2025 FipMoney Technologies Private Limited. All rights reserved.</p>
              <p>Corporate Identification Number: U47733KA2023PTC181719</p>
              <p>This Privacy Policy was last updated on January 15, 2025</p>
              <p>
                FipMoney, a platform used to encourage savings habits in Indians by helping them save on a daily basis.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}