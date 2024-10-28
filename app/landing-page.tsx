"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  Clock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";

const subjects = ["General", "Science", "English", "Maths"];
const features = [
  { icon: BookOpen, text: "Expert Tutors" },
  { icon: GraduationCap, text: "Personalized Learning" },
  { icon: Clock, text: "Flexible Scheduling" },
];

export default function LandingPage() {
  const [subjectIndex, setSubjectIndex] = useState(0);

  const colors = useMemo(
    () => [
      "#ff5722",
      "#4CAF50",
      "#F44336",
      "#2196F3",
      "#FFC107",
      "#9C27B0",
      "#00BCD4",
    ],
    []
  );

  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubjectIndex((prevIndex) => (prevIndex + 1) % subjects.length);
      setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full py-6 px-8">
        <div className="flex justify-end items-center space-x-2">
          <Link href="/auth">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-start">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.svg
              viewBox="0 0 98 87"
              width={60}
              height={53}
              animate={{ fill: currentColor }}
              transition={{ duration: 1 }}
            >
              <rect width="98" height="87" rx="10" />
              <g
                transform="matrix(1.337307,0,0,1.337307,19.91976,-8.26914)"
                fill="#eeeeee"
              >
                <path d="M39.06 53.46c2.1 2.94 4.62 3.48 4.62 5.16v0.24c0 0.72-0.6 1.14-1.44 1.14h-16.08c-0.9 0-1.44-0.42-1.44-1.14v-0.24c0-1.68 3.24-2.76 1.5-5.16l-7.44-10.26-6.78 10.26c-1.56 2.4 1.02 3.48 1.02 5.16v0.24c0 0.72-0.6 1.14-1.44 1.14h-10.08c-0.9 0-1.44-0.42-1.44-1.14v-0.24c0-1.68 3.06-2.4 5.1-5.16l10.56-14.46-10.92-15.06c-2.22-3-4.62-3.48-4.62-5.16v-0.24c0-0.72 0.6-1.14 1.44-1.14h15.78c0.9 0 1.44 0.42 1.44 1.14v0.24c0 1.68-3.24 2.82-1.5 5.16l7.32 9.96 6.66-9.96c1.62-2.34-1.92-3.48-1.92-5.16v-0.24c0-0.72 0.54-1.14 1.44-1.14h11.04c0.84 0 1.44 0.42 1.44 1.14v0.24c0 1.68-3.54 2.28-5.58 5.16l-9.96 14.16z" />
              </g>
            </motion.svg>
            <h1 className="text-4xl font-bold ml-2">XcelTutors</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Personalized tutoring to help you excel
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-80 h-32 bg-background rounded-lg shadow-lg overflow-hidden mb-20"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={subjectIndex}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="text-5xl font-bold"
                style={{ color: currentColor }}
              >
                {subjects[subjectIndex]}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="w-16 h-16 mb-4 text-primary" />
              <span className="text-xl font-semibold">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mb-20"
        >
          <Button size="lg" className="group text-lg py-6 px-8">
            Start Learning Now
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">
            {"Have Questions? We're Here to Help!"}
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            {"Our team is ready to assist you on your learning journey. Don't"}
            {
              "hesitate to reach out for any inquiries about our tutoring services."
            }
          </p>
          <div className="flex items-center justify-center">
            <Mail className="w-6 h-6 mr-3 text-primary" />
            <a
              href="mailto:hello@xceltutors.com"
              className="text-xl text-primary hover:underline"
            >
              hello@xceltutors.com
            </a>
          </div>
        </motion.div>
      </main>

      <footer className="w-full bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 XcelTutors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
