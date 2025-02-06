'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight, Compass, Shield, Sparkles, Linkedin, Github } from 'lucide-react';
import type { NextPage } from 'next';
import Navbar from './components/Navbar';
import Link from 'next/link';
const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const Home: NextPage = () => {
  const featuresRef = useRef(null);
  
  const isFeaturesInView = useInView(featuresRef, { once: false, margin: "-100px" });

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-neutral-900"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.1),transparent_50%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
              Transform Your Kitchen Experience
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Harness the power of AI to revolutionize your fridge and shelf
              management, reduce waste, and discover amazing recipes tailored
              just for you.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/login">
                <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-500 transition-all group">
                  Get Started Free
                  <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-neutral-800/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate={isFeaturesInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="p-6 rounded-xl bg-neutral-800/40 border border-neutral-700/50 hover:border-neutral-600/50 transition-all"
            >
              <motion.div
                animate={floatingAnimation}
                className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4"
              >
                <Compass className="text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
              <p className="text-neutral-400">
                Keep track of your ingredients with our intelligent pantry
                management system.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="p-6 rounded-xl bg-neutral-800/40 border border-neutral-700/50 hover:border-neutral-600/50 transition-all"
            >
              <motion.div
                animate={floatingAnimation}
                className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4"
              >
                <Shield className="text-teal-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Waste Prevention</h3>
              <p className="text-neutral-400">
                Get notified about expiring items and suggestions for using
                them.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="p-6 rounded-xl bg-neutral-800/40 border border-neutral-700/50 hover:border-neutral-600/50 transition-all"
            >
              <motion.div
                animate={floatingAnimation}
                className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4"
              >
                <Sparkles className="text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Recipe AI</h3>
              <p className="text-neutral-400">
                Personalized recipe recommendations based on your available
                ingredients.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>


      

      {/* Simple Footer */}
      <footer className="border-t border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                🥘
              </motion.div>
              <span className="text-neutral-400">Fridge Pilot</span>
            </div>

            <div className="flex gap-6">
              <Link
                href="https://github.com/arsh199965"
                target="_blank"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/arsh-ahmad"
                target="_blank"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-neutral-500">
              Made with 💚 by a Student Developer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;