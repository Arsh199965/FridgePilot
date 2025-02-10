"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AboutPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "Flask",
    "PostgreSQL",
    "Framer Motion",
    "TailwindCSS",
    "Machine Learning",
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 relative overflow-hidden">
      <Navbar />
      {/* Animated background gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)] -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Project Section */}
          <motion.section variants={item} className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Sparkles className="w-16 h-16 text-emerald-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-6">Fridge Pilot</h1>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              A smart kitchen management solution that helps you track your
              ingredients, prevent food waste, and discover delicious recipes
              based on what you have. Powered by AI, designed with love.
            </p>
          </motion.section>

          {/* Developer Section */}
          <motion.section variants={item} className="relative">
            <div className="p-8 bg-neutral-800/40 rounded-2xl border border-neutral-700/50">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl font-bold"
                >
                  AA
                </motion.div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-4">
                    About the Developer
                  </h2>
                  <p className="text-neutral-400 mb-6">
                    Hi! I&apos;m a passionate developer who loves building
                    interesting web solutions. As an AI/ML enthusiast and
                    bachelor&apos;s student, I enjoy exploring the intersection
                    of user-friendly design and cutting-edge technology.
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://github.com/arsh199965"
                      target="_blank"
                      className="p-2 rounded-lg bg-neutral-700/50 hover:bg-neutral-700 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://linkedin.com/in/arsh-ahmad"
                      target="_blank"
                      className="p-2 rounded-lg bg-neutral-700/50 hover:bg-neutral-700 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href="mailto:arsh199965@gmail.com"
                      className="p-2 rounded-lg bg-neutral-700/50 hover:bg-neutral-700 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Technologies Section */}
          <motion.section variants={item} className="text-center">
            <h2 className="text-2xl font-bold mb-8">Built With</h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3 justify-center"
            >
              {technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-full bg-neutral-800/40 border border-neutral-700/50 text-neutral-300"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
