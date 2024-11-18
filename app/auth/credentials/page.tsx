"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { loginWithCredentials } from "./actions";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { credentialsLoginSchema } from "./schema";
import { Controller } from "react-hook-form";

const inputVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 10 },
  },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
};

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    form: {
      control,
      watch,
      formState: { errors, isSubmitting },
    },
    handleSubmitWithAction,
  } = useHookFormAction(
    loginWithCredentials,
    zodResolver(credentialsLoginSchema),
    {
      formProps: {
        defaultValues: {
          email: "",
          password: "",
        },
      },
      actionProps: {
        onError: ({ error }) => {
          toast({
            title: "Error",
            description: error.serverError,
            variant: "destructive",
          });
        },
      },
    }
  );

  const password = watch("password");

  const togglePasswordVisibility = () => {
    if (showPassword) {
      setShowPassword(false);
      setVisibleChars(0);
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    } else {
      setShowPassword(true);
      setVisibleChars(1);
    }
  };

  useEffect(() => {
    if (showPassword && visibleChars < password.length) {
      revealTimeoutRef.current = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, 150);
    }
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [showPassword, visibleChars, password]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmitWithAction}
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 text-muted-foreground" />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="pl-10"
                  {...field}
                />
              )}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </motion.div>
        <motion.div className="space-y-2" variants={inputVariants}>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 text-muted-foreground" />
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type="text"
                        className="pl-10 pr-10"
                        {...field}
                      />
                    )}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...field}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={buttonVariants}>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <motion.span
              className="flex items-center justify-center w-full"
              whileHover="hover"
              whileTap="tap"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </motion.span>
          </Button>
        </motion.div>
      </motion.form>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button variant="outline" asChild>
          <Link href="/auth" className="w-full">
            <motion.span
              className="flex items-center justify-center w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all sign in options
            </motion.span>
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
