'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, X, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
const Navbar = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '/about' },
  ];
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-neutral-900/95 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
          >
            <Link href='/'>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Fridge Pilot
              </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  <Link href={item.href}>
                    {item.name}
                    </Link>
                </motion.div>
              ))}
            <Link href='/login'>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                Get Started
              </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden bg-neutral-800"
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 rounded-md"
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </nav>

  )
}

export default Navbar
