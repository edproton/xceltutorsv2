"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { signInWithOAuth } from "./actions";
import DiscordIcon from "@/components/icons/discord-icon";
import GoogleIcon from "@/components/icons/google-icon";
import providers from "./providers";

const ProviderIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  google: GoogleIcon,
  discord: DiscordIcon,
};

const buttonVariants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95, y: 0 },
};

export default function AuthPage() {
  return (
    <>
      <motion.h2
        className="text-xl sm:text-2xl font-bold text-center mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Continue with
      </motion.h2>
      <AnimatePresence>
        {providers.map((provider, index) => {
          const Icon = ProviderIcons[provider];
          return (
            <motion.div
              key={provider}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <form action={signInWithOAuth} className="w-full">
                <input type="hidden" name="provider" value={provider} />
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 h-10 sm:h-12 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="relative my-6 flex items-center justify-center gap-4"
      >
        <div className="h-px w-full bg-border" />
        <span className="text-xs uppercase whitespace-nowrap text-muted-foreground">
          Or
        </span>
        <div className="h-px w-full bg-border" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <Link href="/auth/credentials" className="block w-full">
          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 h-10 sm:h-12 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <Mail className="h-5 w-5" />
            <span className="ml-2">Email</span>
          </motion.button>
        </Link>
      </motion.div>

      <motion.p
        className="text-center text-xs sm:text-sm text-muted-foreground mt-6"
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
    </>
  );
}
