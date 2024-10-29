"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Icon from "@/components/icons/logo-icon";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="w-full py-6 px-8">
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
          className="flex justify-end items-center"
        >
          <ThemeToggle />
        </motion.div>
      </header>
      <div className="flex justify-center items-center min-h-[calc(100vh-88px)] p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
        >
          <Card className="overflow-hidden shadow-lg">
            <div className="p-6 sm:p-8 md:p-10">
              <CardHeader className="space-y-2 mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center gap-3 mb-4">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                    <span>xceltutors</span>
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <CardDescription className="text-sm sm:text-base md:text-lg">
                    Unlock your potential with personalized tutoring and start
                    your journey towards academic excellence.
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">{children}</CardContent>
            </div>
          </Card>
        </motion.div>
        <motion.p
          className="text-center text-xs sm:text-sm text-muted-foreground mt-6 absolute bottom-4 left-0 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </motion.p>
      </div>
    </>
  );
}
