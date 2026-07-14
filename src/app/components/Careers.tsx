"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, MapPin, Clock, Users, Heart, Lightbulb, Trophy, Coffee } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CareersProps {
  onBack: () => void;
}

const JobCard = ({ job, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 interactive-card border border-gray-100"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{job.type}</span>
          </div>
        </div>
      </div>
      <Badge className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white border-0">
        {job.department}
      </Badge>
    </div>
    
    <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>
    
    <div className="flex flex-wrap gap-2 mb-4">
      {job.skills.map((skill, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {skill}
        </Badge>
      ))}
    </div>
    
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Posted {job.posted}
      </div>
      <Button className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white border-0 interactive-button">
        Apply Now
      </Button>
    </div>
  </motion.div>
);

const BenefitCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.div
      className="w-16 h-16 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-2xl flex items-center justify-center mx-auto mb-4"
      whileHover={{ scale: 1.1, rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-8 h-8 text-white" />
    </motion.div>
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

export default function Careers({ onBack }: CareersProps) {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      location: "Hyderabad, India",
      type: "Full-time",
      department: "Engineering",
      description: "Build beautiful and intuitive user interfaces for our gold investment platform using React, TypeScript, and modern web technologies.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL"],
      posted: "2 days ago"
    },
    {
      title: "Product Manager",
      location: "Hyderabad, India",
      type: "Full-time",
      department: "Product",
      description: "Lead product strategy and development for our core investment features. Work closely with engineering and design teams.",
      skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Fintech"],
      posted: "1 week ago"
    },
    {
      title: "Backend Engineer",
      location: "Hyderabad, India",
      type: "Full-time",
      department: "Engineering",
      description: "Design and build scalable backend systems for handling millions of transactions and ensuring data security.",
      skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Microservices"],
      posted: "3 days ago"
    },
    {
      title: "DevOps Engineer",
      location: "Remote",
      type: "Full-time",
      department: "Engineering",
      description: "Maintain and scale our cloud infrastructure, implement CI/CD pipelines, and ensure 99.9% uptime.",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
      posted: "5 days ago"
    },
    {
      title: "UX/UI Designer",
      location: "Hyderabad, India",
      type: "Full-time",
      department: "Design",
      description: "Create user-centered designs that make gold investment simple and delightful for our users.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Mobile Design"],
      posted: "1 week ago"
    },
    {
      title: "Data Scientist",
      location: "Hyderabad, India",
      type: "Full-time",
      department: "Analytics",
      description: "Analyze user behavior and market trends to drive data-driven product decisions and personalization.",
      skills: ["Python", "SQL", "Machine Learning", "Statistics", "Tableau"],
      posted: "4 days ago"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance for you and your family, plus wellness programs"
    },
    {
      icon: Lightbulb,
      title: "Learning & Growth",
      description: "Annual learning budget, conference attendance, and skill development programs"
    },
    {
      icon: Trophy,
      title: "Equity & Bonuses",
      description: "Competitive salary with equity participation and performance bonuses"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible working hours, remote options, and unlimited paid time off"
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Regular team outings, celebrations, and a collaborative work environment"
    },
    {
      icon: Briefcase,
      title: "Career Growth",
      description: "Clear career progression paths and leadership development opportunities"
    }
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
              <Briefcase className="w-5 h-5 text-[#ffbf00]" />
              <h1 className="text-2xl font-bold text-gray-900">Careers at FipMoney</h1>
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
              Build the Future of{" "}
              <span className="gradient-text">Digital Gold</span>{" "}
              Investment
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Join our mission to democratize wealth building in India. Work with a passionate team 
              of innovators building India's most trusted digital gold platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white border-0 px-8 py-6 text-lg interactive-button"
              >
                View Open Positions
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#ffbf00] text-[#b38200] hover:bg-[#fff8dc] px-8 py-6 text-lg interactive-button"
              >
                Life at FipMoney
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a company that values innovation, growth, and making a real impact on millions of lives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our growing team
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {jobs.map((job, index) => (
              <JobCard
                key={job.title}
                job={job}
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
            <p className="text-gray-600 mb-4">
              Don't see a role that fits? We're always interested in hearing from exceptional talent.
            </p>
            <Button
              variant="outline"
              className="border-2 border-[#ffbf00] text-[#b38200] hover:bg-[#fff8dc] interactive-button"
            >
              Send Us Your Resume
            </Button>
          </motion.div>
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
            <h3 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Join us in revolutionizing how India invests in gold and help millions build lasting wealth
            </p>
            <Button
              size="lg"
              className="bg-white text-[#ffbf00] hover:bg-gray-100 px-8 py-6 text-lg interactive-button"
            >
              Apply Today
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}