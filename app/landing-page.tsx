"use client";

import { useState, useEffect, createElement } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  Clock,
  Mail,
  Atom,
  BookText,
  Calculator,
  Microscope,
  FlaskConical,
  Compass,
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";

const subjects = [
  { name: "Science", icon: Atom, color: "#4CAF50" },
  { name: "Chemistry", icon: FlaskConical, color: "#45B649" },
  { name: "Biology", icon: Microscope, color: "#2E7D32" },
  { name: "English", icon: BookText, color: "#F44336" },
  { name: "Literature", icon: BookOpen, color: "#E53935" },
  { name: "Maths", icon: Calculator, color: "#2196F3" },
  { name: "Physics", icon: Compass, color: "#1976D2" },
];

const features = [
  { icon: BookOpen, text: "Expert Tutors" },
  { icon: GraduationCap, text: "Personalized Learning" },
  { icon: Clock, text: "Flexible Scheduling" },
];

interface LandingPageProps {
  isLoggedIn: boolean;
}

export default function LandingPage({ isLoggedIn }: LandingPageProps) {
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState("#ff5722");
  const [showSubjects, setShowSubjects] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateTitle = async () => {
      await animate(
        scope.current,
        { opacity: 1 },
        { duration: 0.5, delay: 1.5 }
      );
      await animate(
        scope.current,
        { width: "auto" },
        { duration: 1.5, ease: "easeInOut" }
      );
    };

    animateTitle();

    const placeholderTimer = setTimeout(() => {
      setShowPlaceholder(false);
      setShowSubjects(true);
      setCurrentColor(subjects[0].color);
    }, 4000);

    const subjectTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setSubjectIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % subjects.length;
          setCurrentColor(subjects[newIndex].color);
          return newIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    }, 4000);

    return () => {
      clearTimeout(placeholderTimer);
      clearTimeout(subjectTimer);
    };
  }, [animate, scope]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <header className="w-full py-4 sm:py-6 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            scale: {
              type: "spring",
              stiffness: 260,
              damping: 20,
            },
          }}
          className="flex justify-end items-center gap-2"
        >
          <Link
            href={isLoggedIn ? "/dashboard" : "/auth"}
            className="flex items-center"
          >
            <Button variant={isLoggedIn ? "success" : "default"}>
              {isLoggedIn ? "Dashboard" : "Login"}
            </Button>
          </Link>
          <ThemeToggle />
        </motion.div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-start space-y-8 sm:space-y-12">
        {/* Logo and Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="flex flex-col items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-base sm:text-lg text-muted-foreground">
              Xcelling in Education, Xceeding Expectations
            </p>
          </motion.div>

          <div className="flex items-center justify-center">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.8,
                delay: 0.7,
              }}
            >
              <motion.svg
                viewBox="0 0 98 87"
                width={60}
                height={53}
                animate={{ fill: currentColor }}
                transition={{ duration: 0.5 }}
              >
                <motion.rect
                  width="98"
                  height="87"
                  rx="10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.7 }}
                />
                <motion.g
                  transform="matrix(1.337307,0,0,1.337307,19.91976,-8.26914)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <motion.path
                    d="M39.06 53.46c2.1 2.94 4.62 3.48 4.62 5.16v0.24c0 0.72-0.6 1.14-1.44 1.14h-16.08c-0.9 0-1.44-0.42-1.44-1.14v-0.24c0-1.68 3.24-2.76 1.5-5.16l-7.44-10.26-6.78 10.26c-1.56 2.4 1.02 3.48 1.02 5.16v0.24c0 0.72-0.6 1.14-1.44 1.14h-10.08c-0.9 0-1.44-0.42-1.44-1.14v-0.24c0-1.68 3.06-2.4 5.1-5.16l10.56-14.46-10.92-15.06c-2.22-3-4.62-3.48-4.62-5.16v-0.24c0-0.72 0.6-1.14 1.44-1.14h15.78c0.9 0 1.44 0.42 1.44 1.14v0.24c0 1.68-3.24 2.82-1.5 5.16l7.32 9.96 6.66-9.96c1.62-2.34-1.92-3.48-1.92-5.16v-0.24c0-0.72 0.54-1.14 1.44-1.14h11.04c0.84 0 1.44 0.42 1.44 1.14v0.24c0 1.68-3.54 2.28-5.58 5.16l-9.96 14.16z"
                    fill="#eeeeee"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      delay: 1.5,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  />
                </motion.g>
              </motion.svg>
            </motion.div>
            <motion.h1
              ref={scope}
              className="text-3xl sm:text-4xl font-bold ml-2 overflow-hidden whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
            >
              XcelTutors
            </motion.h1>
          </div>
        </motion.div>

        {/* Subjects Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
          className="relative w-full sm:w-80 h-32 bg-background rounded-lg shadow-lg overflow-hidden"
          style={{
            background: `linear-gradient(45deg, ${subjects[subjectIndex].color}15, transparent)`,
          }}
        >
          <AnimatePresence mode="wait">
            {showPlaceholder ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <span className="text-2xl font-bold text-primary">
                  {"Subjects? We've got it!"}
                </span>
              </motion.div>
            ) : (
              showSubjects && (
                <motion.div
                  key={subjectIndex}
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    {createElement(subjects[subjectIndex].icon, {
                      size: 40,
                      className: "text-primary",
                      style: { color: subjects[subjectIndex].color },
                    })}
                  </motion.div>
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{ color: subjects[subjectIndex].color }}
                  >
                    {subjects[subjectIndex].name}
                  </span>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 4 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="group text-base sm:text-lg py-3 sm:py-4 px-5 sm:px-6"
          >
            Start Learning Now
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 4.2 }}
          className="text-center px-4"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            {"Have Questions? We're Here to Help!"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">
            {"Our team is ready to assist you on your learning journey. Don't "}
            {
              "hesitate to reach out for any inquiries about our tutoring services."
            }
          </p>
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5 mr-2 text-primary" />
            <a
              href="mailto:hello@xceltutors.com"
              className="text-base sm:text-lg text-primary hover:underline"
            >
              hello@xceltutors.com
            </a>
          </motion.div>
        </motion.div>

        {/* Features Section (moved to the bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 4.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 4.4 + 0.2 * index }}
              whileHover={{
                scale: 1.05,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-primary" />
              <span className="text-base sm:text-lg font-semibold">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="w-full bg-muted py-3 sm:py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-xs sm:text-sm">
          <p>&copy; 2024 XcelTutors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
