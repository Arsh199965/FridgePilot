"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "@/constants/constants";

// Custom Google Icon component
const GoogleIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

interface InputProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg py-3 px-12 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
    />
  </div>
);

const AuthPage: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const endpoint = isLogin
        ? `${baseUrl}/auth/login` 
        : `${baseUrl}/auth/signup` 
      const body = {
        user_name: name,
        user_id: email,
        password: password,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("user_id", email);
        }
        setSuccess(true);
        if (isLogin) router.push("/pantry");
        else toast.success("Signup Successful");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
        toast.error(error);
      }
    } catch (err) {
      setError("Network error: " + err);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center p-4">
      <Toaster />
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Auth Card */}
        <div className="bg-neutral-800/30 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-xl">
          {/* Card Header */}
          <div className="p-8 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2"
            >
              Welcome to Fridge Pilot
            </motion.h2>
            <p className="text-neutral-400">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          {/* Social Login */}
          <div className="px-8 flex flex-col justify-center items-center gap-4 mb-6">
            <button className="px-8 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors">
              <GoogleIcon size={18} />
              Google
            </button>
            <p className="text-xs -mt-3 font-light text-neutral-400">
              Coming Soon
            </p>
          </div>

          <div className="px-8 flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-neutral-700"></div>
            <span className="text-neutral-500 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-neutral-700"></div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    icon={<User size={18} />}
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={<Lock size={18} />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all relative overflow-hidden"
              disabled={isLoading || success}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  />
                ) : success ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Check className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="border-t border-neutral-700/50 p-8">
            <p className="text-neutral-400 text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
